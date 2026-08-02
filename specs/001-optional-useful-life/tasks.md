# Tasks: Cho phép bỏ trống số tháng sử dụng khi có số lượng

**Input**: Design documents from `/specs/001-optional-useful-life/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [capital-expense-form.md](./contracts/capital-expense-form.md), [quickstart.md](./quickstart.md)

**Tests**: Không có test runner tự động trong project; các task validation dùng các kịch bản trong `quickstart.md`, `pnpm lint` và `pnpm build`.

**Organization**: Tasks được nhóm theo user story; migration foundation bảo vệ invariant cho cả hai story.

## Phase 1: Setup

**Purpose**: Xác nhận implementation bám tài liệu nghiệp vụ và migration hiện có.

- [X] T001 Review current capital-expense constraints and approved rules in `supabase/migrations/202607280002_capital_expenditure_mvp.sql`, `supabase/migrations/202608020001_capital_expense_quantity.sql`, and `docs/workflows/capital-expenditure-mvp.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Thực thi bất biến dữ liệu chung trước khi thay đổi hai luồng form/báo cáo.

- [X] T002 Create a new ordered migration in `supabase/migrations/` that replaces the original capital treatment/useful-life CHECK with a named constraint: depreciable assets require a positive useful-life or a positive quantity, while other treatments require a null useful-life
- [X] T003 Apply and verify the new constraint against the local database using `supabase/migrations/` and record any migration adjustment required by the baseline constraint name

**Checkpoint**: Database accepts only the approved optional-useful-life state; user stories can proceed.

---

## Phase 3: User Story 1 - Lưu khoản chi có số lượng nhưng không có số tháng sử dụng (Priority: P1) 🎯 MVP

**Goal**: Người dùng tạo/sửa tài sản với số lượng dương, không có số tháng sử dụng, và thấy placeholder trong báo cáo kỳ.

**Independent Test**: Tạo rồi sửa khoản chi tài sản có số lượng dương, để trống số tháng; xác nhận bản ghi/audit được lưu và báo cáo kỳ tách khoản này khỏi chi phí kỳ.

- [X] T004 [US1] Normalize blank `useful_life_months` to null and allow a depreciable asset with a positive quantity in create/update Server Actions at `app/capital/actions.ts`
- [X] T005 [P] [US1] Derive `pendingOrderAllocation` for the selected paid-on month without adding it to depreciation or period expense in `lib/capital/queries.ts`
- [X] T006 [US1] Show the optional-useful-life guidance on the create form and render the pending-order-allocation placeholder from the monthly summary in `app/capital/page.tsx`
- [X] T007 [P] [US1] Show the same useful-life guidance and retained blank value on the edit form in `app/capital/[id]/page.tsx`

**Checkpoint**: US1 is independently functional: a valid asset expense can omit useful-life if it has quantity, and the period report shows it as waiting for order allocation.

---

## Phase 4: User Story 2 - Giữ kiểm tra dữ liệu số lượng (Priority: P2)

**Goal**: Ngoại lệ chỉ áp dụng cho số lượng dương; đơn vị tính tiếp tục tùy chọn.

**Independent Test**: Thử tạo/sửa tài sản thiếu cả số tháng lẫn số lượng, hoặc dùng số lượng 0/âm; các thao tác bị chặn. Thử số lượng dương, đơn vị tính trống; thao tác thành công.

- [X] T008 [US2] Enforce the missing-useful-life validation message only when a depreciable asset has no positive quantity, while preserving positive-integer validation for supplied useful-life and quantity in `app/capital/actions.ts`
- [X] T009 [US2] Keep the quantity field's positive-integer affordance and document that unit label is optional rather than an exception condition in `components/capital-expense-quantity-fields.tsx`

**Checkpoint**: US2 is independently functional: invalid bypass attempts fail at server/database level; positive quantity with an empty unit label remains valid.

---

## Phase 5: Polish & Cross-Cutting Validation

**Purpose**: Đồng bộ tài liệu, xác nhận build và chạy acceptance scenarios.

- [X] T010 Verify the implemented behavior remains synchronized with `docs/workflows/capital-expenditure-mvp.md`, `docs/data-model/entities.md`, `docs/data-model/lifecycle.md`, and `docs/technical-debt/capital-expense-order-allocation.md`
- [X] T011 Run the create/edit/report acceptance scenarios in `specs/001-optional-useful-life/quickstart.md` against the local Supabase stack
- [X] T012 Run `pnpm lint` and `pnpm build` for the implementation described in `specs/001-optional-useful-life/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5.
- T003 requires T002 to have created the migration.
- T004 and T005 require T003 to have verified the database invariant.
- T006 requires T005; T007 can run after T004.
- T008 follows T004 because both modify `app/capital/actions.ts`.
- T009 can run in parallel with T008; T010–T012 run after both user stories.

### User Story Dependencies

- **US1 (P1)**: Depends on Phase 2 only; delivers the MVP flow.
- **US2 (P2)**: Depends on the same database foundation and US1's Server Action normalization; hardens the exception without altering its report behavior.

### Parallel Opportunities

- T005 and T007 can run in parallel after T003 because they modify separate files.
- T008 and T009 can run in parallel after US1, because they modify separate files.

## Parallel Example: User Story 1

```text
After T003:
- T005: update `lib/capital/queries.ts`
- T007: update `app/capital/[id]/page.tsx`
```

## Implementation Strategy

### MVP First

1. Complete T001–T003 to secure the database invariant.
2. Complete T004–T007 and validate the P1 create/edit/report flow.
3. Complete T008–T009 to enforce invalid boundary cases.
4. Complete T010–T012 before declaring the feature ready.

### Incremental Delivery

US1 can be demonstrated immediately after Phase 3. US2 then confirms the same rule cannot be bypassed by missing, zero, or negative quantity values. The order-based allocation remains deliberately deferred to the technical-debt memo.
