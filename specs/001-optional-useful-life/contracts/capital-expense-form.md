# UI Contract: Capital expense form and monthly placeholder

## Scope

Hợp đồng nội bộ giữa biểu mẫu Chi vốn, Server Action và dữ liệu báo cáo. Không công bố API ngoài hệ thống.

## Create and edit form

| Input | Client affordance | Server/database rule |
|---|---|---|
| `quantity` | Trường tùy chọn, chỉ nhận số nguyên dương | Khi tài sản có `quantity > 0`, `useful_life_months` có thể để trống. |
| `unit_label` | Tùy chọn; chỉ cho nhập khi có số lượng hợp lệ | Không được có nếu không có số lượng; không được dùng để quyết định ngoại lệ số tháng. |
| `useful_life_months` | Nhãn giải thích: bắt buộc với tài sản nếu chưa nhập số lượng hợp lệ | Nếu có, phải là số nguyên dương. Với tài sản, thiếu cả số tháng lẫn số lượng hợp lệ thì từ chối lưu. Với treatment khác tài sản, không lưu giá trị này. |

Các form tạo và sửa phải có cùng điều kiện. Không tự điền `0`, không xoá số tháng đã có khi người dùng chỉ thêm số lượng, và không tự đổi treatment.

## Monthly report placeholder

Khi kỳ báo cáo có khoản chờ phân bổ, UI hiển thị tổng tiền chờ phân bổ cho các khoản có `paid_on` trong kỳ đó và mô tả: “Chờ phân bổ theo số đơn hàng”. Giá trị này:

- được tách khỏi `Khấu hao` và `Chi phí kỳ`;
- không thay đổi `Tiền đã chi`;
- không ngụ ý số đơn hàng, tỷ lệ phân bổ hay chi phí đã ghi nhận.

Nếu không có khoản chờ phân bổ trong kỳ, UI hiển thị giá trị 0 hoặc trạng thái không có khoản chờ theo quy ước màn hình hiện có.
