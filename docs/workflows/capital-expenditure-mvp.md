# Theo dõi vốn đã bỏ ra và khấu hao MVP

## Goal

Cho một người dùng nội bộ ghi nhận các khoản tiền đã thanh toán và xem rõ tổng vốn đã chi khác với chi phí được ghi nhận trong một kỳ.

## Scope

Bao gồm danh mục chi động, ghi/sửa khoản chi, lịch sử sửa khoản chi, báo cáo theo tháng cho tổng tiền đã chi, vốn nhập hàng, chi phí ghi nhận và khấu hao.

Không bao gồm công nợ, trả góp, tệp chứng từ, SKU, nhà cung cấp, phiếu nhập kho, tồn kho, giá vốn hoặc lợi nhuận.

## Actors and responsibilities

- Người dùng nội bộ: tạo/ngừng dùng danh mục, ghi/sửa khoản chi và xem báo cáo.
- Hệ thống: giữ cách xử lý đã chụp tại thời điểm ghi chi, tính khấu hao theo tháng và lưu lịch sử sửa.

## Current and desired flow

1. Người dùng tạo danh mục và chọn một cách xử lý bắt buộc.
2. Người dùng ghi khoản tiền đã trả, ngày trả, danh mục, mô tả và mã chứng từ nếu có; với vật phẩm đếm được, có thể ghi thêm số lượng và đơn vị tính tự do.
3. Với danh mục tài sản, người dùng nhập số tháng sử dụng, trừ khi khoản chi có số lượng dương.
4. Hệ thống hiển thị báo cáo tháng: tổng tiền thực tế đã chi, vốn nhập hàng đã chi và chi phí kỳ.
5. Người dùng có thể sửa khoản chi; hệ thống lưu giá trị trước/sau. Danh mục đã dùng chỉ có thể ngừng sử dụng.

## Inputs and outputs

- Input: ngày đã trả, số tiền VND, danh mục; mô tả/mã chứng từ, số lượng và đơn vị tính tự do của vật phẩm đếm được là tùy chọn; số tháng sử dụng bắt buộc cho tài sản, trừ khi khoản chi có số lượng dương.
- Output: danh sách khoản chi, lịch sử sửa và báo cáo theo tháng/danh mục/cách xử lý; khi có số lượng, form và danh sách/chi tiết khoản chi hiển thị đơn giá tham chiếu.

## Business rules

- Một khoản chi chỉ đại diện cho tiền đã thanh toán thực tế; không theo dõi khoản chưa trả hoặc trả góp.
- Mỗi danh mục có một cách xử lý: `chi phí ngay`, `tài sản khấu hao`, hoặc `vốn nhập hàng`.
- Cách xử lý được lưu trên khoản chi tại lúc tạo/sửa để báo cáo lịch sử không đổi khi danh mục thay đổi.
- Tổng tiền thực tế đã chi cộng mọi khoản theo ngày đã trả.
- Vốn nhập hàng chỉ xuất hiện là vốn đã chi; không được tính vào chi phí kỳ trong MVP.
- Chi phí kỳ gồm khoản `chi phí ngay` theo tháng đã trả và khấu hao của tài sản.
- Tài sản khấu hao đều theo tháng dương lịch, bắt đầu từ tháng đã trả; số tiền còn lẻ được ghi nhận ở tháng cuối để tổng phân bổ đúng bằng số tiền mua.
- Danh mục đã có khoản chi không được đổi cách xử lý hoặc xóa; chỉ được ngừng sử dụng.
- Số lượng là tùy chọn và chỉ ghi cho vật phẩm có thể đếm được; không áp dụng cho khoản chi không theo đơn vị đếm.
- Đơn vị tính là nội dung người dùng nhập tự do, tùy chọn và chỉ có cùng số lượng của vật phẩm đếm được.
- Khoản chi thuộc danh mục tài sản có số lượng dương có thể để trống số tháng sử dụng. Khoản này là placeholder chờ phân bổ theo số đơn hàng trong tháng; trong phạm vi hiện tại, không được tự động tính vào chi phí kỳ.
- Khi có số lượng, đơn giá tham chiếu được dẫn xuất bằng số tiền đã trả chia cho số lượng; chỉ hiển thị tại form và danh sách/chi tiết khoản chi, không làm thay đổi các báo cáo tháng.

## Exceptions and manual handling

- Nếu ghi nhầm, người dùng sửa khoản chi hiện hành; lịch sử trước/sau là nguồn để truy vết.
- MVP chưa có đăng nhập nên lịch sử chưa thể định danh người thay đổi.

## Metrics / completion criteria

- Tổng tiền thực tế đã chi bằng tổng các khoản đã ghi theo kỳ lọc.
- Vốn nhập hàng không xuất hiện trong chi phí kỳ.
- Tổng khấu hao của một tài sản sau đủ số tháng bằng đúng số tiền mua.
- Mọi cập nhật khoản chi có lịch sử trước/sau.

## Confirmed decisions

- Chỉ ghi tiền đã chi; không có công nợ/trả góp.
- Danh mục quyết định cố định cách xử lý.
- Không quản lý tồn kho/SKU trong MVP.
- Chứng từ chỉ là mã tham chiếu hoặc ghi chú.
- Số lượng chỉ dùng để ghi nhận khoản mua vật phẩm đếm được.
- Đơn vị tính tự do và đơn giá tham chiếu chỉ phục vụ đối chiếu từng khoản chi; không dùng cho tồn kho, giá vốn hoặc báo cáo tháng trong MVP.
- Khoản chi tài sản có số lượng nhưng không có số tháng sử dụng sẽ được phân bổ theo số đơn hàng trong tháng khi hệ thống có thống kê đơn hàng phù hợp; hiện chỉ ghi nhận placeholder và theo dõi như nợ kỹ thuật.

## Open questions

- Không có.
