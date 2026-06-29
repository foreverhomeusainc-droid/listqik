# Investor Buyer Deals

MLS-sourced buyer inventory for investors, with a public teaser, Buyer Representation gate, and comps engine.

## Routes

| URL | Access |
|-----|--------|
| `/buyers` | Public teaser + comps UI (comps execution requires Buyer Rep) |
| `/buyer-representation` | Auth required — sign Buyer Rep |
| `/dashboard/buyers` | Auth + Buyer Rep — full MLS feed + comps |

Homepage includes `BuyerDealsTeaser` (top 4 deals).

## Data flow

1. **Seed** — On first API call, `src/data/buyer-deals-seed.json` populates `MlsBuyerDeal` if empty.
2. **MLS webhook** — `POST /api/webhooks/mls-buyer-deals` with header `x-webhook-secret: MLS_BUYER_DEALS_WEBHOOK_SECRET` and body `{ "deals": [ ... ] }` upserts by `externalId`.
3. **Teaser** — `GET /api/buyers/teaser` returns limited fields sorted by `teaserFeatured` + `investorScore`.
4. **Full feed** — `GET /api/buyers/deals` after `buyerRepAcknowledgedAt` on user.
5. **Comps** — `POST /api/buyers/comps` pulls same-ZIP pool from `MlsBuyerDeal` and runs adjustment math in `src/lib/buyers/comps.ts`.

## Buyer Rep gate

- Field: `User.buyerRepAcknowledgedAt`
- Ack API: `POST /api/auth/acknowledge-buyer-rep`
- Pattern mirrors seller `/listing-agreement` flow

## Env

```
MLS_BUYER_DEALS_WEBHOOK_SECRET=...
```

## Next steps (production MLS)

- Connect RETS/IDX/MLS vendor feed to webhook payload mapper
- Add admin review queue before deals go `active`
- Per-deal detail page + save/watchlist
- Formal TREC buyer rep e-sign (DocuSign / GHL)
