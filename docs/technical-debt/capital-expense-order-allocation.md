# Phân bổ khoản chi vốn theo số đơn hàng

## Status

Deferred / placeholder.

## Confirmed business intent

Khoản chi thuộc danh mục tài sản có số lượng dương nhưng không có số tháng sử dụng sẽ được phân bổ theo số đơn hàng trong tháng. Đơn vị tính vẫn là tùy chọn.

## Current behavior

Hiện chưa có thống kê đơn hàng đủ để thực hiện phân bổ. Khoản chi vẫn được lưu, tính vào tổng tiền thực tế đã chi và được đánh dấu là chờ phân bổ; không tự động được tính vào chi phí kỳ.

## Deferred work

- Xác định thống kê đơn hàng nào là nguồn cho việc phân bổ và điều kiện đơn được tính.
- Chốt công thức phân bổ theo số đơn hàng, cách xử lý tháng không có đơn và làm tròn.
- Xác định việc tính lại lịch sử khi số liệu đơn hàng thay đổi hoặc được import muộn.
- Bổ sung hiển thị chi phí kỳ sau khi các quy tắc trên được PM phê duyệt.

## Dependencies

- Workflow và dữ liệu thống kê đơn hàng đã được PM phê duyệt.
- Quy tắc báo cáo có thể xác định số đơn hợp lệ theo từng tháng.

## Out of scope now

Không xây thống kê đơn hàng, công thức phân bổ hoặc tính lại báo cáo trong feature này.
