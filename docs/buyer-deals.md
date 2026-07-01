# Investor Buyer Deals

MLS-sourced buyer inventory for investors, with a public teaser, Buyer Representation gate, and comps engine.

## Routes

| URL | Access |
|-----|--------|
| `/buyers` | Public teaser + buyer calculators + comps UI |
| `/buyers/register` | Public — request buyer account (setup email) |
| `/buyer-representation` | Auth required — sign Buyer Rep |
| `/dashboard/buyers` | Auth + Buyer Rep — full MLS feed (no seller listing agreement) |
| `/dashboard/buyers/[id]` | Auth + Buyer Rep — deal detail + per-deal comps |
| `/dashboard/admin/buyer-deals` | Admin — MLS review queue |
| `/investors` | Public investor hub (calculators, Deals of the Week) |
| `/demo/buyer-dashboard?key=…` | Secret-gated demo (Buyer Rep + dashboard without listing-agreement gate) |

Homepage includes `BuyerDealsTeaser` (top 4 deals).

## Data flow

1. **Seed** — `src/data/buyer-deals-seed.json` upserts into `MlsBuyerDeal` on each API call (`ensureBuyerDealsSeeded`). Seed rows are `reviewStatus: approved`.
2. **MLS webhook** — `POST /api/webhooks/mls-buyer-deals` with header `x-webhook-secret: MLS_BUYER_DEALS_WEBHOOK_SECRET` and body `{ "deals": [ ... ] }` upserts by `externalId`. New webhook deals default to `reviewStatus: pending` until admin approves (pass `autoApprove: true` or `reviewStatus: "approved"` to skip queue).
3. **Teaser** — `GET /api/buyers/teaser` returns limited fields sorted by `teaserFeatured` + `investorScore`. Comp-only rows (`investorTags: ["comp"]`) are excluded from feeds.
4. **Full feed** — `GET /api/buyers/deals` after `buyerRepAcknowledgedAt` on user. Supports query filters: `zip`, `tag`, `status`, `minScore`, `maxPrice`, `sort`.
5. **Deal detail** — `GET /api/buyers/deals/[id]`
6. **Watchlist** — `GET/POST /api/buyers/watchlist` (`User.savedBuyerDealIds`)
7. **Comps** — `POST /api/buyers/comps` with optional `dealId` to exclude subject from comp pool.

## Buyer Rep gate

- Field: `User.buyerRepAcknowledgedAt`
- Ack API: `POST /api/auth/acknowledge-buyer-rep`
- Pattern mirrors seller `/listing-agreement` flow
- `/dashboard/buyers` and `/dashboard/calculators` skip the seller **Listing User Agreement** gate (`src/lib/buyers/dashboard-paths.ts` + `x-listqik-pathname` in middleware)

## Account creation (buyers)

- **Self-serve:** `POST /api/buyers/register` or `/buyers/register` — sends setup email via `adminInviteUser`
- **Admin invite:** `/dashboard/admin/users` → Invite user → `/setup-account`
- **CLI:** `node scripts/create-admin-user.mjs --email … --password … --name "…"`

Then: sign in → Buyer Rep → `/dashboard/buyers` (no seller agreement required).

## Env

```
MLS_BUYER_DEALS_WEBHOOK_SECRET=...
BUYERS_DEMO_ACCESS_KEY=...   # optional — /demo/buyer-dashboard
```

## Next steps (production MLS)

- Connect RETS/IDX/MLS vendor feed to webhook payload mapper
- Formal TREC buyer rep e-sign (DocuSign / GHL)
- Price-drop / new-deal alerts and map view
