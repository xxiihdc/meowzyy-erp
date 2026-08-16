# Implementation Plan: Shopee Order Import

**Branch**: `002-shopee-order-import` | **Date**: 2026-08-16 | **Spec**: [spec.md](./spec.md)

## Summary

Add a server-side Shopee Excel import that validates and groups source rows, persists auditable monetary components, and calculates actual revenue. TikTok, tax and the return-window completion policy remain deferred.

## Technical Context

- **Language/Platform**: TypeScript 5, Next.js 16 App Router, React 19.
- **Dependencies**: existing `xlsx`, `@supabase/supabase-js` and server-only client.
- **Storage**: Supabase Postgres; no source-file retention.
- **Testing**: lint, production build, parser unit tests and import integration tests with sanitized fixtures.
- **Security**: service-role key is server-only; no buyer, recipient, phone or address persistence.

## Constitution Check

Pass. The approved workflow and data model are the source of truth. The design preserves source-derived monetary evidence, keeps privileged access on the server, and does not introduce new business rules for deferred statuses.

## Research decisions

- Parse the upload's `FormData` server-side; use SheetJS to read its `ArrayBuffer`, require an `orders` worksheet and validate headers.
- Put parsing, validation and grouping in a pure `lib/orders/shopee-parser.ts` module; keep database writes in a server action or route handler.
- Extend the current schema with final selling price, actual revenue and immutable `order_monetary_components` linked to an import batch.
- Preserve raw status and do not classify deferred buyer-received statuses as completed.

## Design

### Database

- Replace the legacy payout measure with `final_selling_price`, `actual_revenue` and mapping metadata on `orders`.
- Add `order_monetary_components`: component code, amount, source column, source scope, aggregation method, mapping version and revenue-inclusion flag.
- Keep unique `(marketplace, marketplace_order_id)`. Sum original price and seller subsidy across all lines; store the three fees once per order.

### Application

- Add an import entry point that accepts a `.xlsx` file and displays batch results.
- Validate required order/product/quantity/money fields, reject invalid rows individually, then upsert valid orders and replace their current lines/components.
- Update order queries/dashboard labels to use actual revenue while only reporting statuses that have an approved completed mapping.

### Validation

Use a sanitized fixture with a multi-SKU order, an invalid row and a repeat import. Reconcile every order's retained components to the approved formula and confirm duplicate prevention.

## Project Structure

```text
app/
├── page.tsx
└── orders/actions.ts
lib/orders/
├── queries.ts
└── shopee-parser.ts
supabase/migrations/
tests/orders/
specs/002-shopee-order-import/
```

## Complexity Tracking

No constitution violation or additional project is required.
