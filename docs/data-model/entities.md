# Entities

## Import batch

- Purpose: Ghi nhận một lần xử lý file Excel.
- Row grain: Một file upload.
- Owner / source of truth: Hệ thống import.
- Primary key: `id`.
- External identifiers: Không có.
- Important attributes: sàn, tên file, thời điểm, tổng dòng, số tạo mới/cập nhật/lỗi.
- Relations: Có nhiều orders được tạo/cập nhật bởi batch.
- Invariants and constraints: Sàn là Shopee hoặc TikTok Shop.
- Lifecycle / mutability: Kết quả batch không bị sửa sau khi hoàn thành.
- Audit and access considerations: Không lưu file gốc cho đến khi có quyết định retention.
- Open questions: Không có.

## Order

- Purpose: Lưu dữ liệu cấp đơn từ một sàn.
- Row grain: Một mã đơn của một sàn.
- Owner / source of truth: File import, trừ các trường được sửa tay.
- Primary key: `id`.
- External identifiers: `marketplace`, `marketplace_order_id`; kết hợp là duy nhất.
- Important attributes: trạng thái gốc/chuẩn hoá, ngày tạo, ngày hoàn tất, giá bán cuối cùng, doanh thu thực nhận, phiên bản công thức/mapping và import batch gần nhất.
- Relations: Thuộc một import batch gần nhất; có nhiều order lines, order monetary components và order field changes.
- Invariants and constraints: Một đơn chỉ có một sàn; trạng thái hoàn tất phải có ngày hoàn tất và đủ thành phần tiền để được tính báo cáo. Doanh thu thực nhận có thể âm khi chi phí sàn lớn hơn giá bán cuối cùng.
- Lifecycle / mutability: Import mới nhất có thể cập nhật; sửa tay được audit từng trường.
- Audit and access considerations: Truy vết giá trị trước/sau cho sửa tay.
- Open questions: Xác nhận cách xử lý số lượng khi một giá trị tiền nguồn không cùng grain với dòng đơn.

## Order monetary component

- Purpose: Giữ từng thành phần tiền đã import và metadata mapping cần để tính, audit và diễn giải lại doanh thu thực nhận.
- Row grain: Một thành phần tiền của một đơn trong một import batch; thành phần có thể bắt nguồn từ một dòng đơn hoặc toàn đơn.
- Owner / source of truth: File import gốc và mapping phiên bản đã áp dụng cho batch.
- Primary key: `id`.
- External identifiers: Không có.
- Important attributes: mã thành phần ổn định, số tiền nguồn, tên cột nguồn, phạm vi nguồn, kiểu tổng hợp, phiên bản mapping, cờ có tham gia doanh thu hay chỉ thống kê.
- Relations: Thuộc một order và một import batch.
- Invariants and constraints: Không được thay đổi thành phần hoặc phiên bản mapping đã ghi cho một batch hoàn thành; giá gốc và trợ giá người bán Shopee được cộng từ toàn bộ dòng đơn, ba phí Shopee được trừ một lần mỗi đơn; phí vận chuyển không tham gia doanh thu thực nhận.
- Lifecycle / mutability: Import mới tạo bộ thành phần mới cho dữ liệu nguồn mới; kết quả hiện hành của order dùng batch gần nhất, còn bộ cũ giữ để audit.
- Audit and access considerations: Không lưu dữ liệu người mua/giao hàng trong entity này.
- Open questions: Xác nhận quy tắc nguồn cho từng thành phần TikTok Shop và các khoản điều chỉnh hoàn/trả.

## Order line

- Purpose: Lưu sản phẩm/SKU đã chụp tại thời điểm đơn được import.
- Row grain: Một dòng sản phẩm trong một đơn.
- Owner / source of truth: File import.
- Primary key: `id`.
- External identifiers: Mã dòng của sàn nếu file cung cấp; chưa được xác nhận.
- Important attributes: tên sản phẩm, SKU, số lượng.
- Relations: Thuộc một order.
- Invariants and constraints: Số lượng lớn hơn 0; không suy diễn giá trị tiền của đơn từ dòng đơn khi chưa có quy tắc phân bổ được PM duyệt.
- Lifecycle / mutability: Được thay thế theo import mới nhất của đơn.
- Audit and access considerations: Không chứa dữ liệu nhạy cảm ngoài dữ liệu hàng hoá.
- Open questions: Quy tắc định danh dòng đơn từ từng sàn.

## Order field change

- Purpose: Audit một thay đổi tay trên trường dữ liệu đơn.
- Row grain: Một trường của một đơn trong một lần chỉnh sửa.
- Owner / source of truth: Hệ thống chỉnh sửa đơn.
- Primary key: `id`.
- External identifiers: Không có.
- Important attributes: tên trường, giá trị cũ/mới, thời điểm.
- Relations: Thuộc một order.
- Invariants and constraints: Không được ghi đè lịch sử; chỉ ghi cho sửa tay.
- Lifecycle / mutability: Append-only.
- Audit and access considerations: Chưa có định danh người sửa vì MVP một tài khoản nội bộ.
- Open questions: Không có.

## Capital category

- Purpose: Nhóm các khoản chi và quyết định cách xử lý báo cáo.
- Row grain: Một danh mục chi do người dùng nội bộ tạo.
- Owner / source of truth: Người dùng nội bộ.
- Primary key: `id`.
- Important attributes: tên, cách xử lý, trạng thái đang dùng.
- Relations: Có nhiều capital expenses.
- Invariants and constraints: Tên là duy nhất; danh mục đã có khoản chi không được đổi cách xử lý hoặc xoá.
- Lifecycle / mutability: Có thể ngừng sử dụng; lịch sử khoản chi vẫn giữ nguyên.
- Audit and access considerations: MVP chưa có auth.
- Open questions: Không có.

## Capital expense

- Purpose: Ghi nhận một khoản tiền đã thanh toán thực tế.
- Row grain: Một lần chi tiền.
- Owner / source of truth: Người dùng nội bộ; sửa tay là giá trị hiện hành.
- Primary key: `id`.
- Important attributes: ngày đã trả, số tiền, cách xử lý đã chụp, mô tả, mã chứng từ, số tháng sử dụng của tài sản, số lượng và đơn vị tính tự do tùy chọn của vật phẩm đếm được. Đơn giá tham chiếu là giá trị dẫn xuất từ số tiền đã trả chia cho số lượng, không lưu như một giá trị độc lập.
- Relations: Thuộc một capital category; có nhiều capital expense changes.
- Invariants and constraints: Số tiền dương; số tháng sử dụng chỉ áp dụng cho tài sản và được yêu cầu trừ khi khoản chi có số lượng dương; số lượng chỉ có mặt khi khoản chi mua vật phẩm có thể đếm được và phải dương; đơn vị tính chỉ có mặt cùng số lượng. Tài sản có số lượng nhưng không có số tháng sử dụng là khoản chờ phân bổ theo số đơn hàng trong tháng và không được tự động tính vào chi phí kỳ hiện tại.
- Lifecycle / mutability: Có thể sửa; mỗi sửa tạo audit trước/sau.
- Audit and access considerations: Chưa có người sửa vì MVP chưa có auth.
- Open questions: Không có.

## Capital expense change

- Purpose: Lịch sử thay đổi một khoản chi.
- Row grain: Một lần cập nhật một khoản chi.
- Owner / source of truth: Hệ thống.
- Primary key: `id`.
- Relations: Thuộc một capital expense.
- Invariants and constraints: Append-only; lưu snapshot JSON trước/sau.
- Lifecycle / mutability: Không sửa hoặc xoá.
- Audit and access considerations: Chưa có người sửa vì MVP chưa có auth.
- Open questions: Không có.
