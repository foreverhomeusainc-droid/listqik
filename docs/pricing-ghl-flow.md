# Pricing plan purchase → GHL → user provisioning

This document describes how **ListQik** connects **pricing / checkout**, **GoHighLevel (GHL)**, and **user + listing creation** in this codebase.

There are **two paths**:

1. **Path A — Pay in GHL** — `POST /api/ghl/pricing/checkout` (optional GHL notify webhook, then GHL payment), then **your GHL workflow** calls `POST /api/webhooks/order-complete` after payment.
2. **Path B — In-app pricing wizard with staged GHL payments** — Step 2 runs a **plan-only GHL checkout**, then Step 3 runs an **upgrades checkout** before intake is completed.

Implementation references:

- Checkout + optional GHL webhook: `src/app/api/ghl/pricing/checkout/route.ts`
- Paid-order webhook: `src/app/api/webhooks/order-complete/route.ts`
- Provisioning logic: `src/lib/seller-order-provision.ts`
- In-app intake: `src/app/api/pricing/intake/complete/route.ts`
- Wizard UI: `src/components/pricing/pricing-console.tsx`

## Rendered flowcharts (shapes — not Mermaid source)

| File | Description |
|------|-------------|
| [diagrams/pricing-ghl-path-a.pdf](diagrams/pricing-ghl-path-a.pdf) | Path A as PDF (boxes, diamonds, arrows). |
| [diagrams/pricing-ghl-path-b.pdf](diagrams/pricing-ghl-path-b.pdf) | Path B as PDF. |
| [diagrams/pricing-ghl-path-a.svg](diagrams/pricing-ghl-path-a.svg) | Path A as SVG (open in browser or editor). |
| [diagrams/pricing-ghl-path-b.svg](diagrams/pricing-ghl-path-b.svg) | Path B as SVG. |
| [diagrams/pricing-ghl-flows-print.html](diagrams/pricing-ghl-flows-print.html) | Both charts on one page — **Print → Save as PDF** for a single combined PDF. |

Source definitions (editable): `diagrams/pricing-ghl-path-a.mmd`, `diagrams/pricing-ghl-path-b.mmd`. Regenerate PDF/SVG after edits:

```bash
npx -y @mermaid-js/mermaid-cli@11 -q -i docs/diagrams/pricing-ghl-path-a.mmd -o docs/diagrams/pricing-ghl-path-a.pdf -f -w 1600 -H 2400 -t neutral
npx -y @mermaid-js/mermaid-cli@11 -q -i docs/diagrams/pricing-ghl-path-b.mmd -o docs/diagrams/pricing-ghl-path-b.pdf -f -w 1200 -H 400 -t neutral
npx -y @mermaid-js/mermaid-cli@11 -q -i docs/diagrams/pricing-ghl-path-a.mmd -o docs/diagrams/pricing-ghl-path-a.svg -w 1600 -H 2400 -t neutral -b transparent
npx -y @mermaid-js/mermaid-cli@11 -q -i docs/diagrams/pricing-ghl-path-b.mmd -o docs/diagrams/pricing-ghl-path-b.svg -w 1200 -H 400 -t neutral -b transparent
```

---

## Path A — Paid in GHL → webhook creates user

```mermaid
flowchart TB
  subgraph client["Browser — pricing / marketing site"]
    A[User picks plan, property, upgrades, contact]
    A --> B{How checkout is started?}
    B -->|Integration: POST payload| C["ListQik API\nPOST /api/ghl/pricing/checkout"]
  end

  subgraph listqik_checkout["ListQik — checkout route"]
    C --> V{Required fields OK?}
    V -->|No| R400[400 Missing fields]
    V -->|Yes| W{GHL_PRICING_WEBHOOK_URL set?}
    W -->|Yes| WH["Server POST JSON to GHL\nInbound Webhook URL"]
    WH -->|Fail| E502[502 GHL pricing webhook failed]
    WH -->|OK| INV
    W -->|No| INV{GHL API + price IDs OK?}
    INV -->|text2pay invoice| PAY["Customer opens invoice URL\nand pays in GHL Payments"]
    INV -->|Fallback| LEG["Redirect-style checkout URL\nGHL_STORE_CHECKOUT_BASE_URL + query params"]
    LEG --> PAY
  end

  subgraph ghl["GoHighLevel — you configure workflows"]
    WH -.->|Payload: plan, contact, property, upgrades, receivedAt| WF1["Workflow A optional:\nInternal actions from webhook\n— e.g. tag contact, internal email"]
    PAY --> WF2["Workflow B required for app user:\nTrigger on Payment success / Order paid"]
    WF2 --> HTTP["HTTP POST to ListQik\nPOST /api/webhooks/order-complete"]
  end

  subgraph listqik_webhook["ListQik — order-complete"]
    HTTP --> SEC{Header matches\nORDER_WEBHOOK_SECRET?}
    SEC -->|No| U401[401 Unauthorized]
    SEC -->|Yes| PROV["provisionSellerFromPaidOrder()\n— idempotent on externalOrderId"]
    PROV --> DUP{Duplicate externalOrderId?}
    DUP -->|Yes| OKDUP[200 ok duplicate]
    DUP -->|No| USER{User exists for email?}
    USER -->|No| NEW["Create User\nplaceholder password hash\n+ password setup token"]
    USER -->|Yes| LINK[Link to existing user]
    NEW --> PP[Create ACTIVE PlanPurchase]
    LINK --> PP
    PP --> LIST{Property address complete?}
    LIST -->|Yes| LST[Create INCOMPLETE Listing draft]
    LIST -->|No| SKIPL[No listing]
    NEW --> SMTP{SMTP configured?}
    SMTP -->|Yes| EM["sendSetupAccountEmail()\n/setup-account?token=…"]
    SMTP -->|No| NOEM[setupEmailSent false]
  end

  PAY -.->|Same customer| WF2
```

### Environment and contracts

| Variable / endpoint | Role |
|---------------------|------|
| `GHL_PRICING_WEBHOOK_URL` | ListQik **forwards** the checkout JSON to your GHL inbound webhook (optional; if set, webhook failure returns **502**). |
| `GHL_PRIVATE_INTEGRATION_TOKEN`, `GHL_LOCATION_ID` | Used to build **Text2Pay** invoice or resolve price IDs. |
| `GHL_PLAN_PRICE_IDS` / `GHL_PLAN_PRODUCT_IDS`, `GHL_UPGRADE_PRICE_IDS` | Map plans and upgrades to GHL price/product IDs. |
| `GHL_STORE_CHECKOUT_BASE_URL` | Fallback **redirect** checkout URL when invoice path is not used or fails. |
| `POST /api/webhooks/order-complete` | Expects `x-webhook-secret` or `Authorization: Bearer` matching `ORDER_WEBHOOK_SECRET`. Body: `OrderWebhookPayload` — include `externalOrderId` for idempotency. |
| SMTP env vars | Used by `sendSetupAccountEmail` in `src/lib/transactional-email.ts` — **ListQik** sends the password-setup email, not GHL (unless you duplicate email in GHL). |

---

## Path B — Pricing wizard with Step 2 + Step 3 GHL checkouts

```mermaid
flowchart LR
  S2[Step 2: User selects core plan]
  S2 --> C2["Checkout #1 in GHL\nselected plan only"]
  C2 --> P2{Plan payment successful?}
  P2 -->|No| R2[Stay on Step 2]
  P2 -->|Yes| S3[Step 3: User selects upgrades]
  S3 --> C3["Checkout #2 in GHL\nupgrades only"]
  C3 --> P3{Upgrade payment successful?}
  P3 -->|No| R3[Stay on Step 3]
  P3 -->|Yes| I["POST /api/pricing/intake/complete"]
  I --> UCR["Create User + PlanPurchase + Listing\n(plus upgrade records if selected)"]
  UCR --> SI[signIn credentials]
  SI --> DASH["Redirect /dashboard"]
```

This path performs two explicit GHL checkout events in the wizard:

- Step 2 checkout: the selected base plan.
- Step 3 checkout: selected upgrades (if any).

The wizard should only proceed to `POST /api/pricing/intake/complete` after the required payment(s) succeed.

---

## Exporting to PDF (summary)

- Use the prebuilt **`diagrams/pricing-ghl-path-a.pdf`** and **`pricing-ghl-path-b.pdf`**, or open **`diagrams/pricing-ghl-flows-print.html`** in a browser and choose **Print → Save as PDF** for one file with both flowcharts.

---

## Related: lead capture (not pricing)

`POST /api/ghl/lead` forwards to `GHL_LEAD_WEBHOOK_URL` — separate from the pricing checkout flow. See `src/app/api/ghl/lead/route.ts` and `README.md`.
