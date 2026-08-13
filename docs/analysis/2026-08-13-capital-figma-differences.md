# Chênh lệch Figma và UI Chi vốn

> Analysis note only. It is not an approved business workflow or data-model decision. Confirm any proposed decision with the PM and update the relevant source-of-truth document separately.

GitHub tracking: [Task #5](https://github.com/xxiihdc/meowzyy-erp/issues/5).

## Question and scope

- **Question:** Node Figma `4:433` được áp dụng thế nào cho route `/capital` mà không làm thay đổi workflow Chi vốn đã duyệt?
- **Inspected:** `docs/workflows/capital-expenditure-mvp.md`, `docs/data-model/entities.md`, `docs/data-model/lifecycle.md`, `app/capital/page.tsx`, `components/capital-expense-quantity-fields.tsx`, và [Figma node 4:433](https://www.figma.com/design/CHBknBlcjsk3m1ioGXA5BW/meowzyy-erp?node-id=4-433&t=gFHAEVoKFCaq8LG9-0).
- **Excluded:** `.env*`, database instance, generated output, dependencies và Figma assets không phù hợp thương hiệu Meowzyy.
- **Method:** Đối chiếu trực tiếp layout/metadata Figma với docs nguồn sự thật và implementation trước thay đổi.

## Observed facts

| Fact | Evidence |
| --- | --- |
| Node 4:433 là frame `Quản lý Chi phí & Nhập liệu`, có sidebar 280px, top navigation, form cột trái và danh sách khoản chi cột phải. | Figma metadata node `4:433`. |
| Form trong Figma chỉ thể hiện amount, date, category và description. | Figma nodes `4:447`–`4:493`. |
| Workflow yêu cầu thêm số lượng, đơn vị tính, số tháng sử dụng có điều kiện và mã chứng từ tùy chọn. | `docs/workflows/capital-expenditure-mvp.md` — Inputs and outputs; `docs/data-model/entities.md` — Capital expense. |
| Figma có `Distribution (MTD)`, nhưng docs quy định báo cáo kỳ gồm tiền đã chi, vốn nhập hàng, khấu hao, chi phí kỳ và chờ phân bổ. | Figma node `4:494`; `docs/workflows/capital-expenditure-mvp.md` — Business rules. |
| Hai ảnh raster trong node mang branding/nhân sự mẫu không phải Meowzyy. | Figma assets của node `4:433`. |

## Structure map

| Area | Role observed | Evidence |
| --- | --- | --- |
| Sidebar + top navigation | Presentation shell của Figma | Figma nodes `4:643`, `4:653`. |
| Form ghi khoản chi | Tạo `capital expense` | Figma node `4:443`; `app/capital/page.tsx`. |
| Báo cáo kỳ | Thay cho chart chưa có metric đã duyệt | `docs/workflows/capital-expenditure-mvp.md`. |
| Bảng khoản chi | Danh sách/lọc/sửa record hiện có | Figma node `4:530`; `app/capital/page.tsx`. |

## Interpretations / hypotheses

| Hypothesis | Confidence | Supporting evidence | What would confirm it |
| --- | --- | --- | --- |
| Figma là reference cho bố cục và visual style, không phải thay đổi workflow Chi vốn. | high | PM xác nhận dùng Figma làm layout chính và giữ logic hiện có. | PM cập nhật source Figma nếu muốn phản ánh đủ field/metric. |
| `Distribution (MTD)` chưa nên triển khai vì chưa có metric/category aggregation được phê duyệt cho nó. | high | Không xuất hiện trong workflow/data model; báo cáo kỳ đã có metric xác định. | PM chốt metric, thời gian và quy tắc tính distribution. |
| Branding và avatar mẫu của Figma không nên dùng cho Meowzyy. | high | Asset trực quan không phải Meowzyy; app đã có nhận diện Meowzyy. | PM cung cấp asset thương hiệu Meowzyy đã duyệt. |

## Open questions

- Không có điểm nào chặn UI layout hiện tại. Chart distribution và asset thương hiệu chỉ được mở rộng sau khi PM xác nhận.

## Suggested next smallest step

> Giữ note này đồng bộ khi PM xác nhận thêm metric distribution hoặc asset thương hiệu vào Figma.
