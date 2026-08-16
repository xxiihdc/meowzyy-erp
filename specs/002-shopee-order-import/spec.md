# Feature Specification: Shopee Order Import

**Feature Branch**: `002-shopee-order-import`

**Created**: 2026-08-16

**Status**: Draft

**Input**: User description: "Implement the approved Shopee MVP import slice: import the original Shopee Excel export, group multi-SKU orders, preserve monetary source components and calculate actual revenue without being blocked by deferred TikTok or completion-status decisions."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Import Shopee orders (Priority: P1)

As a người dùng nội bộ, I upload an original Shopee order export so that the system creates or updates my shop orders without duplicate orders.

**Why this priority**: This is the smallest operational slice that makes the approved Shopee data available in the ERP.

**Independent Test**: Upload a verified Shopee export containing a multi-SKU order and an invalid row; confirm valid orders are imported or updated, while the invalid row is reported with a reason.

**Acceptance Scenarios**:

1. **Given** an original Shopee export with several lines sharing one order code, **When** the user imports it, **Then** the system creates or updates one order with all corresponding order lines.
2. **Given** an import that contains an invalid row, **When** processing completes, **Then** valid rows are retained and the invalid row is excluded with a visible reason.
3. **Given** a later import contains an existing Shopee order code, **When** it is processed, **Then** the existing order is updated rather than duplicated.

---

### User Story 2 - Inspect actual revenue components (Priority: P1)

As a người dùng nội bộ, I can inspect the source monetary components and actual revenue of an imported Shopee order so that I can reconcile its calculation and retain inputs for future per-order tax work.

**Why this priority**: A total without its source components cannot be checked or safely recalculated when Shopee changes its export format.

**Independent Test**: Import an order with multiple product lines and verify that its stored original-price total, seller-subsidy total, three seller fees, final selling price and actual revenue reconcile to the approved formula.

**Acceptance Scenarios**:

1. **Given** a valid multi-SKU Shopee order, **When** it is imported, **Then** original price and seller subsidy are aggregated over all order lines, while each confirmed fee is counted once per order.
2. **Given** an imported order, **When** the user views its monetary data, **Then** the source column, aggregation scope and mapping version are available for each retained component.
3. **Given** a source transport-fee value, **When** it is imported, **Then** it may be retained for statistics but does not change actual revenue.

---

### User Story 3 - Preserve deferred source status (Priority: P2)

As a người dùng nội bộ, I can see the original Shopee status after import so that the order remains usable while the completed-status policy is deferred.

**Why this priority**: It allows Shopee import to proceed without silently classifying orders that remain within a return/refund window.

**Independent Test**: Import rows with both exact `Hoàn thành` and buyer-received status messages; confirm their source statuses are retained and no deferred status is treated as completed by this feature.

**Acceptance Scenarios**:

1. **Given** an imported Shopee source status, **When** the order is saved, **Then** its source status is retained unchanged.
2. **Given** a status whose completed mapping is deferred, **When** the order is imported, **Then** this feature does not include it in completed-order reporting.

### Edge Cases

- A single order contains multiple product lines and repeated order-level fee values.
- A seller or variant SKU is absent from the export.
- A required order identifier, product name, quantity, date or monetary component is invalid or missing.
- A source mapping changes after an earlier batch has been imported.
- A file contains buyer or recipient information that is outside the approved import scope.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST accept the verified original Shopee order-export structure and identify its `orders` data sheet.
- **FR-002**: The system MUST validate required fields before saving each source row and return a row-level reason for every rejected row.
- **FR-003**: The system MUST group all valid source rows with the same Shopee order code into one order and retain their product lines.
- **FR-004**: The system MUST update, rather than duplicate, an existing order identified by the Shopee marketplace and its marketplace order code.
- **FR-005**: The system MUST calculate a Shopee order's final selling price as the total original price across its order lines minus the total seller subsidy across its order lines.
- **FR-006**: The system MUST calculate actual revenue as final selling price minus fixed fee, service fee and payment-processing fee, counting each of those fees once per order.
- **FR-007**: The system MUST retain each monetary component used in the calculation with its source column, source scope, aggregation method and mapping version.
- **FR-008**: The system MUST retain transport-fee source values only as optional statistics and exclude them from actual-revenue calculation.
- **FR-009**: The system MUST retain the Shopee source status and MUST NOT treat a deferred buyer-received/return-window status as completed.
- **FR-010**: The system MUST avoid storing buyer, recipient, phone number and delivery-address fields for this feature.
- **FR-011**: The system MUST record an import batch outcome including total rows, created orders, updated orders and rejected rows.

### Key Entities *(include if feature involves data)*

- **Import batch**: One processed Shopee export, including its aggregate outcome.
- **Order**: One Shopee marketplace order, including its source status, dates, final selling price and actual revenue.
- **Order line**: One imported product line belonging to an order.
- **Order monetary component**: One imported or derived monetary component tied to an order and batch, with its mapping metadata.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A verified Shopee export with at least one multi-SKU order imports without creating a duplicate marketplace order.
- **SC-002**: For every valid imported order in the verification file, a reviewer can reconcile final selling price and actual revenue to the retained source components.
- **SC-003**: Every rejected source row in the verification file has one visible rejection reason and is not persisted as an order or line.
- **SC-004**: Re-importing the same verification file leaves the count of marketplace order identifiers unchanged.

## Assumptions

- The current Shopee export in `docs/refs` is the verified source structure for this slice.
- TikTok Shop mapping, tax calculation, source-file retention and the buyer-received completion policy remain out of scope and are tracked by Task #6 or existing open questions.
- Only the exact source status and its deferred classification are handled here; no additional completed-status rule is introduced.
- Existing internal single-user access and audit requirements remain unchanged.
