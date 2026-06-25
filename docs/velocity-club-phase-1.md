# Velocity Club — Phase 1 Operations Guide

Phase 1 turns ListQik into a **retention layer** for real estate investors: tier status, automated savings proof, bulk listing credits, fast-track compliance queueing, and a 3-day onboarding sequence.

---

## What Phase 1 Includes

| Feature | Location | Purpose |
|---------|----------|---------|
| Investor Snapshot | `/dashboard`, `/dashboard/velocity-club` | Tier, stats, savings, progress bar |
| Tier engine | Server (`src/lib/loyalty/`) | Rolling volume + credit bank → tier |
| Credit bank | `/dashboard/velocity-club` | Buy bundles, redeem credits |
| Savings tracker | Snapshot widget (automated) | 3% commission avoided − fees paid |
| Fast-track queue | Listing finalize + admin | Priority compliance review |
| Onboarding | In-app + email (Days 1–3) | Welcome, persona, progress nudge |
| First-listing perk | On first ACTIVE finalize | Fast-track trial for *next* listing |

**Not in Phase 1:** calculators, market intel, deal vault, leaderboard, SMS alerts, wholesaler pass-through.

---

## How Tiering Works

### Effective count formula

```
effectiveCount = rolling12MonthListings + unusedCredits
```

- **Rolling listings:** `ACTIVE`, `PENDING`, `SOLD`, or `EXPIRED` listings with `listedOn` or `setupFinalizedAt` in the last 365 days.
- **MLS vs rental:** `listingKind === "rental"` counts as rental; otherwise `tenantOccupied === true` also counts as rental (approximation until dedicated rental product exists).
- **Unused credits:** sum of `quantityRemaining` across all `ListingCredit` bundles.

### Tier thresholds

| Tier | Effective count | Fast-track queue |
|------|-----------------|------------------|
| Solo Scout | 0–3 | No |
| Volume Velocity Syndicate | 4–11 | Yes |
| Portfolio Titan | 12–24 | Yes |
| Market Mogul | 25+ | Yes |

### Velocity Score (gamification)

| Signal | Points |
|--------|--------|
| MLS listing (12 mo) | +100 each |
| Rental listing (12 mo) | +40 each |
| 5+ credits purchased (lifetime) | +100 bonus |
| 10+ credits purchased | +250 bonus |
| 25+ credits purchased | +500 bonus |
| 1–3 month activity streak | +25 / +75 / +150 |

---

## How Savings Tracker Works

Calculated automatically on every snapshot load — **no user input**.

```
traditionalCommissionsAvoided = Σ (listing.price × 0.03)   // lifetime non-INCOMPLETE listings
listQikFeesPaid              = Σ plan purchases + Σ credit bundle purchases
netSavings                   = max(0, avoided − paid)
```

- Plan purchases matched by `userId` **or** `purchaserEmail`.
- Credit-redeemed plans (`paymentStatus: credit_redeemed`) are **excluded** from fees (already paid via bundle).
- Plans without `amountTotal` use fallback: Subsonic $79, Supersonic $295, Hypersonic $595.

---

## Credit Bank & Bundles

### Bundles (Stripe one-time)

| Slug | Credits | Price |
|------|---------|-------|
| `pipeline-5` | 5 | $335 |
| `pipeline-10` | 10 | $630 |
| `pipeline-25` | 25 | $1,487 |

### Purchase flow

1. User clicks **Secure bundle** on `/dashboard/velocity-club`.
2. `POST /api/dashboard/velocity-club/credits/checkout` creates Stripe Checkout (`checkoutKind: credit-bundle`).
3. Stripe webhook `checkout.session.completed` → `fulfillListingCreditBundle()` creates `ListingCredit` row.
4. Credits appear in bank immediately (UI polls up to ~25s after return).

### Redeem flow

1. User clicks **Use 1 credit for next listing**.
2. `POST /api/dashboard/velocity-club/credits/redeem` decrements oldest bundle, creates `PlanPurchase` (Subsonic, `credit_redeemed`, $0).
3. Redirects to `/dashboard?credit=redeemed` — user continues listing setup with active plan.

**Note:** Redeeming reduces unused credits (may lower tier until a new listing is published).

---

## Fast-Track Queue

### Who gets priority (`priorityLevel = 1`)

- **Syndicate+** tier (effective count ≥ 4), OR
- **Fast-track trial** active (granted after first listing goes ACTIVE)

### First-listing surprise perk

1. User finalizes their **first** listing → status becomes `ACTIVE`.
2. System sets `loyaltyFastTrackTrialActive = true`.
3. In-app **Surprise unlock** modal appears (takes priority over Day 2 persona).
4. On **next** listing finalize: that listing gets fast-track; trial is consumed.

### Admin

`/dashboard/admin/listings` sorts `priorityLevel` descending; fast-track rows show a **Fast-track** label.

---

## Onboarding Sequence

| Day | Channel | Trigger | Action |
|-----|---------|---------|--------|
| 1 | In-app | First Velocity Club API load | Welcome modal → **Enter Velocity Club** |
| 2 | Email + in-app | ≥1 day after `velocityClubJoinedAt` | Persona: flipper / wholesaler / landlord |
| 3 | Email + in-app | ≥2 days, no listings yet | Progress nudge toward Syndicate (4 effective) |
| Live | In-app | First ACTIVE listing | Fast-track trial unlock modal |

`velocityClubJoinedAt` is set on first `GET /api/dashboard/velocity-club` (dashboard home or Velocity Club page).

### Cron emails

- **Route:** `GET /api/cron/loyalty` (daily 14:00 UTC via `vercel.json`)
- **Auth:** `Authorization: Bearer <CRON_SECRET>`
- Sends Day 2 and Day 3 emails to users with `velocityClubJoinedAt` set.

---

## Environment & Infrastructure Requirements

### Required for core tier/savings (no Stripe bundles)

| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` | User, Listing, ListingCredit, PlanPurchase |
| `NEXTAUTH_SECRET` / `NEXTAUTH_URL` | Dashboard auth |
| `SMTP_*` | Onboarding emails, listing notifications |

### Required for credit bundle checkout

| Variable | Purpose |
|----------|---------|
| `STRIPE_SECRET_KEY` | Checkout session creation |
| `STRIPE_WEBHOOK_SECRET` | Fulfill credits on payment |
| `STRIPE_CREDIT_BUNDLE_PRICE_IDS_JSON` | Map slug → Stripe price ID |

Create products:

```bash
npm run stripe:create-catalog
```

Copy `STRIPE_CREDIT_BUNDLE_PRICE_IDS_JSON` into `.env.local`.

### Required for automated onboarding emails

| Variable | Purpose |
|----------|---------|
| `CRON_SECRET` | Protect `/api/cron/loyalty` |
| `SMTP_*` | Day 2 / Day 3 emails |

On Vercel: add `CRON_SECRET`; cron job is defined in `vercel.json`.

### Stripe webhook events

Ensure `/api/webhooks/stripe` receives:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`

---

## User-Facing URLs

| URL | What users see |
|-----|----------------|
| `/dashboard` | Compact investor snapshot + listing dashboard |
| `/dashboard/velocity-club` | Full portal: onboarding, credit bank, bundles |
| My Account → Velocity Club | Nav shortcut |

---

## Operational Checklist (Launch)

- [ ] Run `npm run stripe:create-catalog` and set `STRIPE_CREDIT_BUNDLE_PRICE_IDS_JSON`
- [ ] Confirm Stripe webhook includes `credit-bundle` metadata path
- [ ] Set `CRON_SECRET` in production
- [ ] Verify SMTP sends (admin test email or cron dry-run)
- [ ] Test: new user → welcome → persona → buy bundle → credits appear
- [ ] Test: redeem credit → dashboard banner → active Subsonic plan
- [ ] Test: finalize first listing → fast-track trial → second listing fast-track in admin
- [ ] Review savings numbers against a known test account

---

## Known Limitations (Phase 1)

1. **Rentals** — counted via `tenantOccupied` / `listingKind`; no separate rental checkout yet.
2. **Tier from credits only** — user can reach Syndicate+ without live listings (intentional per blueprint).
3. **Savings math** — uses flat 3% listing-side commission assumption, not buyer-agent or closing fees.
4. **Day 3 email** — static “4 effective listings” copy (not personalized per user’s current count).
5. **No tier downgrade warnings** — cron only sends onboarding emails (Phase 1 scope).
6. **Bundle checkout** — fails gracefully with 501 if Stripe price IDs missing.

---

## File Reference

```
src/lib/loyalty/
  tiers.ts                    — tier definitions & progress
  compute-loyalty-snapshot.ts — tier, savings, velocity score
  credit-bundles.ts           — bundle catalog & Stripe map parser
  fulfill-credit-bundle.ts    — webhook fulfillment & redeem
  onboarding.ts               — in-app step derivation
  fast-track.ts               — priority level resolution

src/models/ListingCredit.ts   — credit bundle ledger
src/models/User.ts            — loyalty + onboarding fields
src/models/Listing.ts         — priorityLevel, listingKind

src/app/api/dashboard/velocity-club/     — snapshot API
src/app/api/dashboard/velocity-club/credits/ — checkout & redeem
src/app/api/cron/loyalty/                — onboarding emails
```
