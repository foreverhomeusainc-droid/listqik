import { Types } from "mongoose";
import { connectDb } from "@/lib/mongodb";
import { User } from "@/models/User";

/**
 * Returns true when the given user has clicked "I understand" on the
 * /listing-agreement gate at least once. Returns false for missing users or
 * invalid ids so callers default to showing the gate.
 */
export async function hasAcknowledgedUserAgreement(userId: string): Promise<boolean> {
  if (!userId || !Types.ObjectId.isValid(userId)) {
    return false;
  }
  await connectDb();
  const row = (await User.findById(userId, { userAgreementAcknowledgedAt: 1 }).lean()) as
    | { userAgreementAcknowledgedAt?: Date | null }
    | null;
  return Boolean(row?.userAgreementAcknowledgedAt);
}
