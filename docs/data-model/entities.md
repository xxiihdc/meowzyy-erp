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
- Important attributes: trạng thái gốc/chuẩn hoá, ngày tạo, ngày hoàn tất, tiền sàn chuyển, import batch gần nhất.
- Relations: Thuộc một import batch gần nhất; có nhiều order lines và order field changes.
- Invariants and constraints: Một đơn chỉ có một sàn; tiền sàn chuyển không âm khi có giá trị; trạng thái hoàn tất phải có ngày hoàn tất để được tính báo cáo.
- Lifecycle / mutability: Import mới nhất có thể cập nhật; sửa tay được audit từng trường.
- Audit and access considerations: Truy vết giá trị trước/sau cho sửa tay.
- Open questions: Tập thuộc tính lấy từ file sẽ được chốt từ file mẫu.

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
- Important attributes: ngày đã trả, số tiền, cách xử lý đã chụp, mô tả, mã chứng từ và số tháng sử dụng của tài sản.
- Relations: Thuộc một capital category; có nhiều capital expense changes.
- Invariants and constraints: Số tiền dương; chỉ tài sản có số tháng sử dụng.
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
