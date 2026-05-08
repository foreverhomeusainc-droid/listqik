import Link from "next/link";
import { connectDb } from "@/lib/mongodb";
import { Listing } from "@/models/Listing";
import { User } from "@/models/User";

export default async function AdminListingsPage() {
  await connectDb();
  const [listings, users] = await Promise.all([
    Listing.find().sort({ createdAt: -1 }).lean(),
    User.find().select("_id email name").lean(),
  ]);

  const userById = new Map(users.map((u) => [String(u._id), u]));

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/15 bg-black/30">
      <table className="min-w-full text-left text-sm text-white/90">
        <thead className="bg-white/5 text-xs uppercase tracking-wider text-white/70">
          <tr>
            <th className="px-3 py-2">Address</th>
            <th className="px-3 py-2">Owner</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Plan Label</th>
            <th className="px-3 py-2">Price</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((row) => {
            const owner = userById.get(String(row.userId));
            return (
              <tr key={String(row._id)} className="border-t border-white/10 align-top">
                <td className="px-3 py-2">
                  {row.street}
                  {row.unit ? `, ${row.unit}` : ""}, {row.city}, {row.state} {row.zip}
                </td>
                <td className="px-3 py-2">
                  {owner ? (
                    <Link className="text-emerald-300 underline" href={`/dashboard/admin/users/${String(owner._id)}`}>
                      {owner.name} ({owner.email})
                    </Link>
                  ) : (
                    <span className="text-white/50">Unknown user</span>
                  )}
                </td>
                <td className="px-3 py-2">{row.status}</td>
                <td className="px-3 py-2">{row.planLabel || "-"}</td>
                <td className="px-3 py-2">{typeof row.price === "number" ? `$${row.price}` : "-"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
