# Phân tích file mẫu Shopee: đơn hoàn thành

> Analysis note only. It is not an approved business workflow or data-model decision. Confirm any proposed decision with the PM and update the relevant source-of-truth document separately.

## Question and scope

- **Question:** File export Shopee mẫu có thể cung cấp dữ liệu nào cho MVP import đơn/doanh thu, và cần chốt thêm điều gì?
- **Inspected:** `docs/refs/Order.completed.20260711_20260810.xlsx`, sheet `orders`; đối chiếu [workflow import đơn](../workflows/order-import-and-revenue-mvp.md) và [data model đơn](../data-model/entities.md).
- **Excluded:** Tên, số điện thoại, địa chỉ, mã đơn, mã vận đơn, tên/mã sản phẩm và mọi giá trị cấp khách hàng/đơn cụ thể. Báo cáo chỉ ghi metadata, tên cột và số liệu tổng hợp.
- **Method:** Đọc workbook chỉ-đọc; kiểm tra sheet, header, mức độ đầy dữ liệu, số dòng/mã đơn, trạng thái, và tính lặp lại của các trường cấp đơn trên dòng sản phẩm.

## Observed facts

| Fact | Evidence |
| --- | --- |
| Workbook có một sheet tên `orders`, vùng dữ liệu `A1:BI45`, gồm 61 cột và 44 dòng dữ liệu; không có công thức Excel. | Workbook metadata và cell inspection. |
| Có 36 mã đơn duy nhất trong 44 dòng. Năm đơn có nhiều dòng, từ 2 đến 4 dòng mỗi đơn. | Cột `Mã đơn hàng`; group theo mã đơn. |
| Các cột cấp sản phẩm gồm `Tên sản phẩm`, `Tên phân loại hàng`, `SKU sản phẩm`, `SKU phân loại hàng`, `Số lượng`. Cả hai cột SKU đều trống trong toàn bộ mẫu. | Header và completeness scan. |
| `Tên sản phẩm` và `Số lượng` có dữ liệu tại toàn bộ 44 dòng; `Tên phân loại hàng` có dữ liệu tại 37 dòng. | Completeness scan. |
| Cột cấp đơn có sẵn gồm `Mã đơn hàng`, `Ngày đặt hàng`, `Trạng Thái Đơn Hàng`, `Thời gian hoàn thành đơn hàng`, `Thời gian đơn hàng được thanh toán`, giao hàng, phương thức thanh toán và các cột tiền/phí. | Header scan. |
| 12 mã đơn có trạng thái chính xác `Hoàn thành`; 24 mã đơn có thông báo “Người mua xác nhận đã nhận…” kèm hạn vẫn có thể trả hàng/hoàn tiền. | Group theo `Mã đơn hàng` và `Trạng Thái Đơn Hàng`. |
| Nội dung trạng thái “đã nhận” chứa ngày hạn khác nhau, nên có nhiều chuỗi trạng thái dù cùng một ý nghĩa quan sát được. | 10 giá trị trạng thái văn bản trong mẫu. |
| Trong cả năm đơn nhiều dòng, `Thời gian hoàn thành đơn hàng`, tổng tiền người mua thanh toán và ba cột phí (`Phí cố định`, `Phí Dịch Vụ`, `Phí xử lý giao dịch`) giống nhau giữa các dòng của cùng đơn. Tên sản phẩm thay đổi. | So sánh từng nhóm mã đơn nhiều dòng. |
| File không có cột tên “tiền sàn chuyển”/payout. Cột `Tiền ký quỹ` có mặt nhưng cùng một giá trị 0 ở toàn bộ dòng mẫu. | Header và value scan. |
| Có hai header gần giống nhau: `Tổng số tiền Người mua thanh toán` và `Tổng số tiền người mua thanh toán`; chúng không thể được coi là cùng một trường chỉ theo tên. | Header scan và distinct-value scan. |
| File có các trường nhận diện/giao hàng nhạy cảm: người mua, người nhận, số điện thoại và địa chỉ. | Header scan. |

## Structure map

| Area | Role observed | Evidence |
| --- | --- | --- |
| Dòng dữ liệu trong `orders` | Dòng sản phẩm thuộc đơn, không phải một record đơn duy nhất. | 44 dòng / 36 mã đơn; có nhiều dòng cho cùng mã đơn. |
| `Mã đơn hàng` | Khoá nguồn phù hợp để nhóm/upsert đơn Shopee. | Có đủ trên 44 dòng; 36 giá trị duy nhất. |
| Nhóm `Tên sản phẩm`, phân loại, số lượng | Candidate cho `order_lines`; SKU hiện không thể dùng làm định danh vì trống trong mẫu. | Header và completeness scan. |
| `Trạng Thái Đơn Hàng` + `Thời gian hoàn thành đơn hàng` | Candidate cho trạng thái nguồn và ngày hoàn tất. | Có đủ toàn bộ dòng; trạng thái có hai nhóm ngữ nghĩa quan sát được. |
| Các trường tổng tiền/phí | Dữ liệu cấp đơn lặp trên các dòng sản phẩm; chỉ an toàn để xử lý một lần mỗi đơn sau khi chốt ý nghĩa cột. | So sánh năm đơn nhiều dòng. |
| Thông tin người mua/giao hàng | Không cần cho MVP đã duyệt và là dữ liệu nhạy cảm. | Header; workflow không yêu cầu các thuộc tính này. |

## Interpretations / hypotheses

| Hypothesis | Confidence | Supporting evidence | What would confirm it |
| --- | --- | --- | --- |
| Parser Shopee cần group theo `Mã đơn hàng`, tạo/cập nhật một `order`, rồi tạo nhiều `order_lines`; không được cộng số tiền/phí theo 44 dòng. | high | Một mã đơn xuất hiện nhiều dòng; trường tiền/phí quan sát được lặp trong các nhóm nhiều dòng. | Acceptance test có đơn 2+ sản phẩm và đối chiếu tổng tiền/phí một lần mỗi đơn. |
| Chỉ trạng thái chính xác `Hoàn thành` có thể là candidate an toàn cho `completed` ở MVP; nhóm “đã nhận nhưng còn cửa sổ trả hàng/hoàn tiền” cần quy tắc PM xác nhận. | high | Hai nhóm trạng thái khác nhau xuất hiện trong export “completed”; workflow yêu cầu mapping hoàn tất đã xác minh. | PM xác nhận thời điểm ghi nhận doanh thu và cách xử lý hoàn/trả sau đó. |
| Mapping trạng thái không nên hard-code toàn bộ chuỗi “đã nhận… tới ngày …”, vì phần ngày thay đổi theo đơn. | high | Mười biến thể chuỗi chỉ khác phần hạn ngày trong mẫu. | PM chốt nhóm trạng thái chuẩn hoá và test với export ở kỳ khác. |
| Mẫu này chưa đủ để tính chỉ số “tiền sàn chuyển” đã duyệt. | high | Không có cột payout rõ ràng; `Tiền ký quỹ` là 0; workflow cấm tự thay bằng một giá trị tiền khác. | PM xác nhận công thức từ các cột hiện có hoặc cung cấp export đối soát/thanh toán có payout theo đơn. |
| Thiết kế order line cần cho phép `sku` null và không được dùng SKU làm khoá import. | high | Hai cột SKU trống trong toàn bộ mẫu; data model đã cho phép `sku` không bắt buộc. | Thêm mẫu export có SKU hoặc PM xác nhận SKU luôn có thể vắng. |

## Open questions

- PM xác nhận trạng thái “Người mua xác nhận đã nhận… còn có thể trả hàng/hoàn tiền” có được tính doanh thu MVP không, hay chỉ `Hoàn thành`?
- `Tổng số tiền Người mua thanh toán` khác gì `Tổng số tiền người mua thanh toán` trong định nghĩa export Shopee? Không được suy đoán chỉ từ tên cột.
- Nguồn chính xác của `tiền sàn chuyển` là cột/công thức nào, hoặc có cần một loại export Shopee khác?
- Khi re-import cùng đơn, parser sẽ thay thế toàn bộ order lines theo file mới nhất hay cần giữ line history? Workflow hiện nói lines được thay theo import mới nhất, nhưng cần test với mẫu thay đổi.
- Có cần lưu các trường giao hàng/khách hàng không? Workflow MVP hiện không yêu cầu; nếu không, parser cần bỏ qua để giảm xử lý dữ liệu nhạy cảm.

## Suggested next smallest step

PM chốt hai quyết định trước khi thiết kế parser: **(1)** mapping của hai nhóm trạng thái trên vào `completed`/`in_progress`, và **(2)** nguồn hay công thức được phép cho “tiền sàn chuyển”. Nếu chưa có payout theo đơn, cung cấp thêm export đối soát/thanh toán Shopee thay vì suy diễn từ tổng tiền người mua trả.
