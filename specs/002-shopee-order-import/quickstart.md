# Validation Guide

1. Configure server-only Supabase values and apply the feature migration locally.
2. Run lint and production build.
3. Import a sanitized multi-SKU Shopee fixture with one invalid row.
4. Verify batch counts, one order per marketplace code, retained lines/components, formula reconciliation and no buyer/address data.
5. Re-import the fixture and verify no duplicate marketplace order identifier.
