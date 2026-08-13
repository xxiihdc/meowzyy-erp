# Chênh lệch Figma và Tổng quan doanh thu

> Analysis note only. It is not an approved business workflow or data-model decision. Confirm any proposed decision with the PM and update the relevant source-of-truth document separately.

GitHub tracking: [Task #4](https://github.com/xxiihdc/meowzyy-erp/issues/4).

## Question and scope

- **Question:** Áp dụng node Figma `4:3` cho route `/` thế nào mà không suy diễn chỉ số tài chính ngoài MVP?
- **Inspected:** `docs/workflows/order-import-and-revenue-mvp.md`, `docs/data-model/entities.md`, `app/page.tsx`, `lib/orders/queries.ts`, và [Figma node 4:3](https://www.figma.com/design/CHBknBlcjsk3m1ioGXA5BW/meowzyy-erp?node-id=4-3&t=gFHAEVoKFCaq8LG9-0).
- **Excluded:** `.env*`, database instance, generated output, dependencies và các asset thương hiệu/ảnh người mẫu của Figma.
- **Method:** Đối chiếu trực tiếp node Figma với workflow và dữ liệu implementation có thể truy xuất.

## Observed facts

| Fact | Evidence |
| --- | --- |
| Node 4:3 là dashboard với sidebar 280px, top navigation, bốn KPI, chart và bảng. | Figma metadata/context node `4:3`. |
| KPI mẫu bao gồm Total Revenue, Total Cost, Net Profit và ROI. | Figma nodes `4:11`–`4:58`. |
| MVP chỉ định doanh thu là tiền sàn chuyển của đơn hoàn tất; không gồm giá vốn hoặc lợi nhuận. | `docs/workflows/order-import-and-revenue-mvp.md` — Scope và Business rules. |
| Implementation chỉ có truy vấn tổng tiền sàn chuyển, số đơn hoàn tất và danh sách đơn mới cập nhật. | `lib/orders/queries.ts`. |
| Phân rã report theo ngày, sàn và SKU cần dữ liệu import đã xác minh. | `docs/workflows/order-import-and-revenue-mvp.md` — Outputs và Exceptions. |

## Structure map

| Area | Role observed | Evidence |
| --- | --- | --- |
| Sidebar, top navigation, grid | Presentation layout được áp dụng | Figma node `4:3`. |
| Tiền sàn chuyển, đơn hoàn tất | KPI có nguồn dữ liệu hiện tại | `lib/orders/queries.ts`. |
| Cost, profit, ROI | Không hiển thị như số liệu trong MVP | `docs/workflows/order-import-and-revenue-mvp.md`. |
| Chart area | Trạng thái chờ dữ liệu thay vì số liệu mẫu | Figma node `4:60`; workflow order import. |

## Interpretations / hypotheses

| Hypothesis | Confidence | Supporting evidence | What would confirm it |
| --- | --- | --- | --- |
| Figma được dùng cho layout, nhưng KPI mẫu không phải business metric đã phê duyệt. | high | PM đã chốt quy ước Figma có thể không chính xác 100%; workflow MVP loại trừ lợi nhuận. | PM phê duyệt metric cùng công thức và nguồn dữ liệu. |
| Không triển khai chart Revenue vs Cost trong MVP hiện tại. | high | Không có `cost` query hay quy tắc kết hợp vốn/chi phí với doanh thu trong docs. | PM chốt scope báo cáo tài chính liên mô-đun. |

## Open questions

- Công thức và thời gian tính cho cost, profit, ROI.
- Điều kiện để bật phân rã doanh thu theo ngày, sàn và SKU sau import.

## Suggested next smallest step

> Khi PM mở scope báo cáo lợi nhuận, chốt riêng công thức và thời gian trước khi thay các card placeholder trong dashboard.
