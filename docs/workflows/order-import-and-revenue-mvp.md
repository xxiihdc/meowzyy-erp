# Import đơn hàng và báo cáo doanh thu MVP

GitHub tracking: [Epic #1](https://github.com/xxiihdc/meowzyy-erp/issues/1) · [Story #2](https://github.com/xxiihdc/meowzyy-erp/issues/2) · [Task #4 (completed)](https://github.com/xxiihdc/meowzyy-erp/issues/4) · [Task #6 (deferred)](https://github.com/xxiihdc/meowzyy-erp/issues/6)

## Goal

Tập trung dữ liệu đơn hàng xuất từ Shopee và TikTok Shop để một người dùng nội bộ có thể xem đơn, chỉnh sửa khi cần và theo dõi doanh thu thực nhận theo ngày hoàn tất.

## Scope

Bao gồm import file Excel export gốc của từng sàn, danh sách đơn theo sàn/trạng thái, chỉnh sửa dữ liệu đơn có audit, và báo cáo theo khoảng ngày, sàn, ngày và sản phẩm/SKU.

Không bao gồm kết nối API sàn, đăng nhập/phân quyền, tồn kho, vận chuyển, đối soát độc lập, giá vốn hoặc lợi nhuận.

### Trạng thái triển khai

- **Đang có thể xem:** dashboard khung, số đơn hoàn tất và bảng đơn mới cập nhật; chỉ số tiền trên dashboard cần được đổi sang doanh thu thực nhận trước khi có số liệu import thật.
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
- Output báo cáo: doanh thu thực nhận, số đơn hoàn tất, phân rã theo ngày–sàn và sản phẩm/SKU.

## Business rules

- Đơn được định danh duy nhất bằng cặp `(sàn, mã đơn của sàn)`.
- Khi import trùng đơn, dữ liệu import mới nhất cập nhật đơn hiện có.
- File có thể được import một phần: chỉ dòng hợp lệ được lưu; dòng lỗi bị bỏ qua và phải hiển thị lỗi.
- Doanh thu thực nhận của một đơn hoàn tất là giá bán cuối cùng cho người bán, gồm các khoản trợ giá áp dụng cho đơn, trừ các chi phí sàn được xác định từ file nguồn.
- Với Shopee MVP, giá bán cuối cùng = tổng `Giá gốc` của tất cả dòng đơn trừ tổng `Tổng số tiền được người bán trợ giá` của tất cả dòng đơn. Đơn nhiều SKU được cộng các thành phần cấp dòng xuống toàn đơn. Doanh thu thực nhận = giá bán cuối cùng trừ ba chi phí sàn được xác nhận một lần mỗi đơn.
- Với Shopee MVP, chi phí sàn được trừ là `Phí cố định`, `Phí Dịch Vụ` và `Phí xử lý giao dịch`; đây là các khoản trừ vào người bán.
- Mỗi thành phần tiền phải ghi nhận tên cột nguồn, phạm vi/kiểu tổng hợp và phiên bản mapping. Khi mapping thay đổi, chỉ import mới dùng phiên bản mới; dữ liệu nguồn và kết quả đã tính của import cũ vẫn truy vết được.
- Giá bán, từng thành phần trợ giá, từng thành phần chi phí sàn và doanh thu thực nhận theo đơn phải được giữ đủ để có thể xác định thuế theo đơn ở một phạm vi sau này.
- Phí vận chuyển là khoản người mua trả; không cộng vào giá bán cuối cùng và không trừ khỏi doanh thu thực nhận. Giá trị nguồn có thể được lưu theo đơn chỉ để thống kê.
- Thuế chưa nằm trong công thức doanh thu MVP; không suy diễn thuế suất, thời điểm tính thuế hoặc số thuế phải nộp khi chưa có quyết định riêng.
- Báo cáo dùng ngày hoàn tất, không dùng ngày tạo đơn.
- Sau import, người dùng được sửa dữ liệu đơn; mọi sửa tay phải lưu trường thay đổi, giá trị trước/sau và thời điểm.

## Exceptions and manual handling

- Mapping cột, giá trị trạng thái hoàn tất và các thành phần tiền cần được xác minh từ file mẫu của từng sàn trước khi kích hoạt parser/báo cáo từng sàn.
- Không tự suy diễn cột đại diện cho “giá bán cuối cùng”, các khoản trợ giá hay chi phí sàn chỉ từ tên cột. Phí vận chuyển không tham gia công thức doanh thu; các khoản khác mang nhãn “dự kiến” hoặc chỉ phát sinh khi trả hàng/hoàn tiền chỉ được trừ khi quy tắc áp dụng đã được xác nhận.

## Metrics / completion criteria

- Không tạo đơn trùng khi import lặp.
- Có thể xác định rõ từng dòng bị từ chối và lý do.
- Báo cáo khớp dữ liệu kiểm thử có đơn hoàn tất, chưa hoàn tất, hủy/hoàn, nhiều sàn và nhiều SKU; với đơn hoàn tất, đối chiếu được giá bán cuối, trợ giá, từng chi phí được trừ và doanh thu thực nhận.

## Confirmed decisions

- Sàn MVP: Shopee và TikTok Shop.
- Nguồn dữ liệu: file Excel export gốc từ sàn.
- Người dùng MVP: một tài khoản nội bộ; không xây đăng nhập/phân quyền.
- Trạng thái hoàn tất: mapping cố định theo sàn, được xác minh từ file mẫu.
- Doanh thu MVP: giá bán cuối cùng gồm trợ giá, trừ các chi phí sàn áp dụng; dữ liệu theo đơn phải giữ các thành phần cần cho việc tính thuế sau này.

## Open questions

- Tên cột, định dạng và các giá trị trạng thái thực tế trong từng file mẫu.
- Mapping tương ứng cho các chi phí được trừ của TikTok Shop và các sàn bổ sung trong tương lai.
- Quy tắc thuế theo đơn trong phạm vi sau: loại thuế, thời điểm tính và trường hợp hoàn/trả.
- Thiết kế template import chỉ được thực hiện lại khi PM mở lại phạm vi này.
