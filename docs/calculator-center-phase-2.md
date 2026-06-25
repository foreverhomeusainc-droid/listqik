# Calculator Center — Phase 2 Checkpoints

Phase 2 delivers six investor calculators with Velocity Club gating, Push to Live Listing, and Syndicate+ PDF export.

**You can stop after any checkpoint** — each leaves the app in a working state.

---

## Checkpoint A — Foundation ✅

**Stop here if:** You only want the math layer and APIs wired, no public UI yet.

| Deliverable | Status |
|-------------|--------|
| `src/lib/calculators/*` math modules (all 6) | Done |
| `CalculatorUsage` + `CalculatorDealDraft` models | Done |
| `src/lib/calculators/access.ts` gating | Done |
| `GET/POST /api/calculators/access` | Done |
| `CalculatorShell`, `useCalculatorAccess` | Done |

**Verify:** `npm run build` passes.

---

## Checkpoint B — Fix & Flip + Mortgage (public) ✅

**Stop here if:** You want SEO landing tools only (2 calculators live).

| Deliverable | Status |
|-------------|--------|
| `/calculators` hub | Done |
| `/calculators/fix-and-flip` | Done |
| `/calculators/mortgage` | Done |
| Anonymous 3/day limit | Done |
| Public nav: Calculators | Done |

**Verify:** Open `/calculators/fix-and-flip` logged out; run 4 times → limit message.

---

## Checkpoint C — SFR Rental + BRRRR ✅

**Stop here if:** Yield + BRRRR tools are enough for v1 launch.

| Deliverable | Status |
|-------------|--------|
| `/calculators/rental` | Done |
| `/calculators/brrrr` | Done |
| 5/10 yr projection (rental) | Done |
| Infinite return indicator (BRRRR) | Done |

---

## Checkpoint D — Multifamily + Wholesale ✅

**Stop here if:** Full public calculator suite is enough without dashboard/PDF.

| Deliverable | Status |
|-------------|--------|
| `/calculators/multifamily` | Done |
| `/calculators/wholesale` | Done |
| Unit slider + rent growth scenario | Done |

---

## Checkpoint E — Dashboard + Push to Live ✅

**Stop here if:** Conversion loop matters more than PDF export.

| Deliverable | Status |
|-------------|--------|
| `/dashboard/calculators` hub | Done |
| `/dashboard/calculators/[slug]` | Done |
| `POST /api/calculators/push-listing` | Done |
| Pricing prefill via `?calcDraft=` | Done |
| Dashboard nav: Deal Analyzer | Done |
| Scout+ Push to Live CTA | Done |

**Verify:** Log in → run calculator → Push to Live → pricing wizard opens with prefilled address/plan.

---

## Checkpoint F — PDF Deal Memo ✅

**Stop here if:** Phase 2 is complete.

| Deliverable | Status |
|-------------|--------|
| `POST /api/calculators/deal-memo` | Done |
| Syndicate+ tier gate | Done |
| `buildDealMemoPdf` (pdf-lib) | Done |
| Export button on all calculators | Done |

**Verify:** User at Syndicate+ tier → Export Deal Memo PDF downloads.

---

## Access matrix (reference)

| Audience | Runs | PDF | Push to Live |
|----------|------|-----|--------------|
| Anonymous | 3/day per tool | No | No (login prompt) |
| Scout (logged in) | Unlimited | No | Yes |
| Syndicate+ | Unlimited | Yes | Yes |

---

## Environment

```env
CALCULATOR_ANON_DAILY_LIMIT=3   # optional, default 3
```

Requires Phase 1 loyalty tiers for PDF gating. No Stripe config needed for calculators.

---

## File map

```
src/lib/calculators/          # Pure math + access + PDF
src/models/CalculatorUsage.ts
src/models/CalculatorDealDraft.ts
src/app/api/calculators/      # access, push-listing, draft, deal-memo
src/components/calculators/     # UI per tool + hub
src/app/(site)/calculators/   # Public SEO routes
src/app/(dashboard)/dashboard/calculators/  # Member routes
```

---

## Known limitations (Phase 2)

- Push to Live does not skip pricing when user already has active plan/credit (Phase 2.5).
- Calculator address fields not on all tools yet — draft may have price only.
- Day 3 / SEO metadata per slug is basic; expand in Phase 2.5.
- Spanish (`/es/calculators`) not added — English only for now.

---

## What comes next (Phase 2.5 / Phase 3)

- Address fields on calculators for richer pricing prefill
- Skip pricing when `PlanPurchase` active or credit bank > 0
- Link homepage `NetProceedsCalculator` → `/calculators/fix-and-flip`
- Velocity Score bonus for calculator usage
- `/es/calculators` localized copy
