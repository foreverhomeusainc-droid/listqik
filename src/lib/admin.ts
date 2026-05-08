export function parseAdminEmails(raw: string | undefined): Set<string> {
  return new Set(
    (raw ?? "")
      .split(",")
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function isAdminEmail(email: string | null | undefined): boolean {
  const value = email?.trim().toLowerCase();
  if (!value) return false;
  return parseAdminEmails(process.env.ADMIN_EMAILS).has(value);
}
