import { Types } from "mongoose";
import { connectDb } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function hasAcknowledgedBuyerRep(userId: string): Promise<boolean> {
  if (!userId || !Types.ObjectId.isValid(userId)) {
    return false;
  }
  await connectDb();
  const row = (await User.findById(userId, { buyerRepAcknowledgedAt: 1 }).lean()) as
    | { buyerRepAcknowledgedAt?: Date | null }
    | null;
  return Boolean(row?.buyerRepAcknowledgedAt);
}
