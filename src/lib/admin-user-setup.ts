import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { connectDb } from "@/lib/mongodb";
import { newPasswordSetupSecret, sha256Hex } from "@/lib/password-setup-token";
import { sendSetupAccountEmail } from "@/lib/transactional-email";
import { User } from "@/models/User";

const SETUP_TOKEN_TTL_MS = 14 * 24 * 60 * 60 * 1000;

async function unusablePasswordHash(): Promise<string> {
  return bcrypt.hash(randomBytes(32).toString("hex"), 12);
}

function appBaseUrl(): string {
  const auth = process.env.NEXTAUTH_URL?.trim();
  if (auth) return auth.replace(/\/$/, "");
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;
  return "";
}

export function buildSetupAccountUrl(setupSecretPlain: string): string | null {
  const base = appBaseUrl();
  if (!base) return null;
  return `${base}/setup-account?token=${encodeURIComponent(setupSecretPlain)}`;
}

export async function issuePasswordSetupToken(userId: string): Promise<{
  setupSecretPlain: string;
  setupAccountUrl: string | null;
}> {
  const setupSecretPlain = newPasswordSetupSecret();
  const tokenSha = sha256Hex(setupSecretPlain);
  const expires = new Date(Date.now() + SETUP_TOKEN_TTL_MS);

  await User.updateOne(
    { _id: userId },
    {
      $set: {
        passwordSetupTokenSha256: tokenSha,
        passwordSetupExpiresAt: expires,
      },
    },
  );

  return {
    setupSecretPlain,
    setupAccountUrl: buildSetupAccountUrl(setupSecretPlain),
  };
}

export type AdminInviteUserResult =
  | { ok: true; userId: string; created: boolean; emailSent: boolean; emailError: string | null }
  | { ok: false; error: string; status: number };

export async function adminInviteUser(input: {
  email: string;
  name: string;
  phone?: string;
  sendEmail?: boolean;
}): Promise<AdminInviteUserResult> {
  await connectDb();

  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();
  const phone = input.phone?.trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "A valid email is required.", status: 400 };
  }
  if (!name) {
    return { ok: false, error: "Name is required.", status: 400 };
  }

  const existing = await User.findOne({ email }).lean();
  if (existing) {
    return { ok: false, error: "A user with this email already exists.", status: 409 };
  }

  const setupSecretPlain = newPasswordSetupSecret();
  const tokenSha = sha256Hex(setupSecretPlain);
  const expires = new Date(Date.now() + SETUP_TOKEN_TTL_MS);
  const setupAccountUrl = buildSetupAccountUrl(setupSecretPlain);

  const user = await User.create({
    email,
    name,
    phone: phone || undefined,
    passwordHash: await unusablePasswordHash(),
    passwordSetupTokenSha256: tokenSha,
    passwordSetupExpiresAt: expires,
  });

  let emailSent = false;
  let emailError: string | null = null;

  if (input.sendEmail !== false) {
    if (!setupAccountUrl) {
      emailError = "App base URL is not configured for setup email.";
    } else {
      const sent = await sendSetupAccountEmail({
        to: email,
        fullName: name,
        setupAccountUrl,
        firstLoginPath: "/dashboard",
      });
      emailSent = sent.sent;
      emailError = sent.sent ? null : sent.error ?? "Setup email send failed.";
    }
  }

  return {
    ok: true,
    userId: String(user._id),
    created: true,
    emailSent,
    emailError,
  };
}

export async function adminResendSetupEmail(userId: string): Promise<{
  ok: boolean;
  emailSent: boolean;
  error: string | null;
  status: number;
}> {
  await connectDb();
  const user = await User.findById(userId).lean();
  if (!user) {
    return { ok: false, emailSent: false, error: "User not found.", status: 404 };
  }

  const { setupAccountUrl } = await issuePasswordSetupToken(userId);
  if (!setupAccountUrl) {
    return {
      ok: false,
      emailSent: false,
      error: "App base URL is not configured for setup email.",
      status: 500,
    };
  }

  const sent = await sendSetupAccountEmail({
    to: user.email,
    fullName: user.name,
    setupAccountUrl,
    firstLoginPath: "/dashboard",
  });

  if (!sent.sent) {
    return {
      ok: false,
      emailSent: false,
      error: sent.error ?? "Setup email send failed.",
      status: 502,
    };
  }

  return { ok: true, emailSent: true, error: null, status: 200 };
}
