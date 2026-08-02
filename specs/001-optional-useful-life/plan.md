# Implementation Plan: Cho phép bỏ trống số tháng sử dụng khi có số lượng

**Branch**: `001-optional-useful-life` | **Date**: 2026-08-02 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-optional-useful-life/spec.md`

## Summary

Cho phép khoản chi thuộc danh mục tài sản được lưu khi có số lượng nguyên dương nhưng để trống số tháng sử dụng. Khoản chi này được ghi nhận là **chờ phân bổ theo số đơn hàng trong tháng**: vẫn tính vào tiền đã chi, không được tính vào khấu hao hoặc chi phí kỳ hiện tại, và được hiển thị như một placeholder trong báo cáo kỳ. Triển khai bằng cách thay thế ràng buộc dữ liệu chéo hiện tại, chuẩn hoá giá trị biểu mẫu trống thành `null`, giữ xác thực ở server/database và mở rộng truy vấn cùng UI Chi vốn để hiển thị trạng thái chờ phân bổ. Không xây thống kê đơn hàng hoặc công thức phân bổ.

## Technical Context

**Language/Version**: TypeScript 5; Next.js 16.2.12; React 19.2.4
**Primary Dependencies**: Next.js App Router/Server Actions, `@supabase/supabase-js` 2.110.8, Tailwind CSS 4
**Storage**: Supabase PostgreSQL; migration SQL trong `supabase/migrations/`
**Testing**: Chưa có test runner tự động; xác nhận migration cục bộ, `pnpm lint`, `pnpm build`, và các kịch bản end-to-end trong [quickstart.md](./quickstart.md)
**Target Platform**: Web nội bộ, chạy server-side
**Project Type**: Next.js web application đơn
**Performance Goals**: Không thêm tính toán phân bổ; trang Chi vốn tiếp tục tải dữ liệu theo giới hạn hiện có và không thêm truy vấn theo đơn hàng
**Constraints**: Chỉ server role truy cập bảng nghiệp vụ; số tháng đã nhập phải là số nguyên dương; số lượng dương là điều kiện duy nhất để bỏ trống số tháng; đơn vị tính vẫn tùy chọn; placeholder không làm thay đổi chi phí kỳ
**Scale/Scope**: Một màn hình Chi vốn, hai luồng tạo/sửa khoản chi, một migration thay đổi ràng buộc và một chỉ số placeholder theo kỳ báo cáo

## Constitution Check

### Before research

- **Business workflow first — PASS**: [workflow Chi vốn](../../docs/workflows/capital-expenditure-mvp.md) đã xác nhận điều kiện ngoại lệ và hành vi báo cáo tạm thời.
- **PM authority — PASS**: PM đã quyết định phân bổ tương lai theo số đơn hàng và cho phép giữ placeholder cho đến khi có thống kê đơn hàng.
- **Docs source of truth — PASS**: Workflow, entity definition và [technical-debt memo](../../docs/technical-debt/capital-expense-order-allocation.md) được cập nhật cùng feature.
- **Safe implementation — PASS**: Không thêm dependency, không đổi auth/RLS, không phát triển phần phân bổ bị hoãn.
- **Integrity, security, traceability — PASS**: Ràng buộc database và xác thực Server Action cùng bảo vệ invariant; audit update hiện hữu tiếp tục lưu snapshot trước/sau.

### After design

- **PASS**: Thiết kế chỉ nới chính xác invariant đã duyệt; không dùng sentinel, không tạo số liệu chi phí suy diễn, và không làm browser truy cập trực tiếp dữ liệu.

## Project Structure

### Documentation (this feature)

```text
specs/001-optional-useful-life/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── capital-expense-form.md
└── tasks.md                 # Created later by $speckit-tasks
```

### Source Code (repository root)

```text
app/
├── capital/
│   ├── actions.ts           # Server-side create/update validation and mutation
│   ├── page.tsx             # Create form, monthly summary and expense list
│   └── [id]/page.tsx        # Edit form and change history
components/
└── capital-expense-quantity-fields.tsx
lib/
└── capital/queries.ts       # Expense reads and monthly summary derivation
supabase/
└── migrations/              # Ordered PostgreSQL schema migrations
docs/
├── workflows/capital-expenditure-mvp.md
├── data-model/entities.md
└── technical-debt/capital-expense-order-allocation.md
```

**Structure Decision**: Giữ cấu trúc Next.js hiện có. Logic xác thực/ghi dữ liệu tiếp tục ở Server Actions, giá trị dẫn xuất báo cáo ở `lib/capital/queries.ts`, và migration là nơi thực thi bất biến dữ liệu chéo.

## Complexity Tracking

Không có vi phạm Constitution cần biện minh.
