# Tasks: Shopee Order Import

**Input**: Design documents in `specs/002-shopee-order-import/`.

## Phase 1: Foundation

- [X] T001 Create the order-revenue migration and service-role grants in `supabase/migrations/`.
- [X] T002 Update typed order queries for actual revenue and monetary components in `lib/orders/queries.ts`.
- [X] T003 Create reusable Shopee header mapping, validation and grouping logic in `lib/orders/shopee-parser.ts`.

## Phase 2: User Story 1 — Import Shopee orders (P1)

**Independent test**: A fixture with a multi-SKU order and invalid row imports valid data, rejects the invalid row and does not duplicate on repeat import.

- [ ] T004 [US1] Add parser unit coverage for headers, row validation and multi-SKU grouping in `tests/orders/shopee-parser.test.ts`.
- [X] T005 [US1] Implement server-side batch creation, order upsert and replacement of current lines in `app/orders/actions.ts`.
- [X] T006 [US1] Add the Shopee Excel import form and batch-result UI in `app/page.tsx`.

## Phase 3: User Story 2 — Inspect actual revenue components (P1)

**Independent test**: An imported multi-SKU order reconciles to the approved formula using retained components.

- [X] T007 [US2] Persist source components, mapping metadata and derived revenue in `app/orders/actions.ts`.
- [X] T008 [US2] Display actual revenue and retained component detail in `app/page.tsx` and `lib/orders/queries.ts`.

## Phase 4: User Story 3 — Preserve deferred status (P2)

**Independent test**: Deferred statuses remain raw/uncompleted after import.

- [X] T009 [US3] Preserve raw status and exclude deferred statuses from completed reporting in `lib/orders/shopee-parser.ts` and `lib/orders/queries.ts`.

## Phase 5: Validation

- [ ] T010 Run migration, fixture import/re-import, lint, build and quickstart validation; update evidence in `specs/002-shopee-order-import/quickstart.md`.

## Dependencies

`T001–T003` → `T004–T006` → `T007–T009` → `T010`.

## MVP scope

Complete T001–T010. TikTok mapping, tax and buyer-received completion policy remain excluded under Task #6.
