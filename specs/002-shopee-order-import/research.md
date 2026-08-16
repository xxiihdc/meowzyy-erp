# Research: Shopee Order Import

## Decisions

- Use Next.js server-side `FormData` handling and SheetJS to parse the named worksheet.
- Use the existing server-only Supabase service-role client; it must never reach browser code.
- Persist immutable source components and mapping metadata with each batch so a later mapping does not reinterpret historical imports.

## Alternatives rejected

- Client-side parsing: would expose too much import logic and cannot perform privileged writes safely.
- A single payout total: cannot reconcile the approved revenue formula.
- Completing buyer-received statuses: business decision remains deferred in Task #6.
