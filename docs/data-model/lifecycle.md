# Lifecycle, constraints and correction policy

## Order status

File import giữ trạng thái gốc của sàn và chuẩn hoá sang trạng thái nội bộ. Chỉ những giá trị có mapping hoàn tất đã được xác minh mới được tính doanh thu. Mapping chi tiết là pending cho đến khi có file mẫu.

## Correction policy

- Import cùng `(sàn, mã đơn)` cập nhật đơn hiện có.
- Sửa tay cập nhật giá trị hiện hành và thêm một record audit trước/sau; record audit không được sửa hoặc xoá.
- Import logs chỉ ghi kết quả batch; dòng lỗi không tạo order.

## Derived values

- Đơn được tính báo cáo khi trạng thái chuẩn hoá là hoàn tất, có ngày hoàn tất và tiền sàn chuyển.
- Báo cáo lọc theo ngày hoàn tất.

## Access

MVP không có đăng nhập/phân quyền theo quyết định PM. Khi bổ sung auth, các bảng phải áp dụng ownership/RLS trước khi mở truy cập ngoài một người dùng nội bộ.

Ứng dụng MVP truy cập dữ liệu server-side bằng `service_role`; browser roles không được cấp quyền trực tiếp trên các bảng nghiệp vụ.

## Capital expenditure

- Danh mục đã được dùng chỉ được ngừng sử dụng; không xoá hoặc đổi cách xử lý.
- Sửa khoản chi cập nhật giá trị hiện hành và thêm audit snapshot trước/sau; audit là append-only.
- Chi phí kỳ là giá trị dẫn xuất: chi phí ngay theo tháng đã trả cộng khấu hao đều của tài sản; vốn nhập hàng không tham gia chỉ số này.
