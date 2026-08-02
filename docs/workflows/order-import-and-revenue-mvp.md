# Import đơn hàng và báo cáo doanh thu MVP

## Goal

Tập trung dữ liệu đơn hàng xuất từ Shopee và TikTok Shop để một người dùng nội bộ có thể xem đơn, chỉnh sửa khi cần và theo dõi tiền sàn chuyển theo ngày hoàn tất.

## Scope

Bao gồm import file Excel export gốc của từng sàn, danh sách đơn theo sàn/trạng thái, chỉnh sửa dữ liệu đơn có audit, và báo cáo theo khoảng ngày, sàn, ngày và sản phẩm/SKU.

Không bao gồm kết nối API sàn, đăng nhập/phân quyền, tồn kho, vận chuyển, đối soát độc lập, giá vốn hoặc lợi nhuận.

### Trạng thái triển khai

- **Đang có thể xem:** dashboard khung cho tổng tiền sàn chuyển, số đơn hoàn tất và bảng đơn mới cập nhật; schema Supabase cho đơn/import/audit đã sẵn sàng.
- **Pending:** template import Excel, parser Shopee/TikTok, mapping cột/trạng thái, upload file và ghi dữ liệu import. Các phần này tạm thời không triển khai.
- **Chưa thể có số liệu thật:** dashboard chỉ có dữ liệu sau khi import được triển khai và chạy với file đã xác minh.

## Actors and responsibilities

- Người dùng nội bộ: cung cấp file export, import, xem/sửa đơn và xem báo cáo.
- Hệ thống: kiểm tra dữ liệu, cập nhật đơn trùng theo sàn + mã đơn, lưu lỗi import và lịch sử sửa tay.

## Current and desired flow

1. Người dùng xuất file Excel từ Shopee hoặc TikTok Shop.
2. Người dùng tải file lên và xem kết quả kiểm tra.
3. Hệ thống lưu các dòng hợp lệ; các dòng lỗi không được lưu và được trả kèm lý do.
4. Đơn có cùng sàn và mã đơn được cập nhật bằng dữ liệu import mới nhất, không tạo trùng.
5. Người dùng lọc danh sách đơn theo sàn/trạng thái và có thể sửa dữ liệu đơn.
6. Báo cáo chỉ tính các đơn ở trạng thái hoàn tất theo mapping cố định của từng sàn, với ngày hoàn tất trong khoảng lọc.

## Inputs and outputs

- Input: file Excel export gốc từ Shopee hoặc TikTok Shop.
- Output import: số dòng tạo mới, cập nhật, lỗi và lý do lỗi.
- Output vận hành: danh sách đơn và lịch sử sửa tay.
- Output báo cáo: tiền sàn chuyển, số đơn hoàn tất, phân rã theo ngày–sàn và sản phẩm/SKU.

## Business rules

- Đơn được định danh duy nhất bằng cặp `(sàn, mã đơn của sàn)`.
- Khi import trùng đơn, dữ liệu import mới nhất cập nhật đơn hiện có.
- File có thể được import một phần: chỉ dòng hợp lệ được lưu; dòng lỗi bị bỏ qua và phải hiển thị lỗi.
- Doanh thu MVP là tiền sàn chuyển cho shop của đơn hoàn tất, không phải doanh thu trước phí hoặc lợi nhuận.
- Báo cáo dùng ngày hoàn tất, không dùng ngày tạo đơn.
- Sau import, người dùng được sửa dữ liệu đơn; mọi sửa tay phải lưu trường thay đổi, giá trị trước/sau và thời điểm.

## Exceptions and manual handling

- Chưa có file mẫu nên mapping cột, giá trị trạng thái hoàn tất và sự tồn tại của cột tiền sàn chuyển là điều kiện cần xác minh trước khi kích hoạt parser/báo cáo từng sàn.
- Nếu không có tiền sàn chuyển theo từng đơn cho một sàn, không tự thay thế bằng giá trị tiền khác; cần PM quyết định quy tắc mới.

## Metrics / completion criteria

- Không tạo đơn trùng khi import lặp.
- Có thể xác định rõ từng dòng bị từ chối và lý do.
- Báo cáo khớp dữ liệu kiểm thử có đơn hoàn tất, chưa hoàn tất, hủy/hoàn, nhiều sàn và nhiều SKU.

## Confirmed decisions

- Sàn MVP: Shopee và TikTok Shop.
- Nguồn dữ liệu: file Excel export gốc từ sàn.
- Người dùng MVP: một tài khoản nội bộ; không xây đăng nhập/phân quyền.
- Trạng thái hoàn tất: mapping cố định theo sàn, được xác minh từ file mẫu.

## Open questions

- Tên cột, định dạng và các giá trị trạng thái thực tế trong từng file mẫu.
- File của từng sàn có tiền sàn chuyển theo từng đơn hay không.
- Thiết kế template import chỉ được thực hiện lại khi PM mở lại phạm vi này.
