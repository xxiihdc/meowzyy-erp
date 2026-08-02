# Data Model: Optional useful-life months

## Existing entity changed: Capital expense

**Purpose**: Ghi nhận một lần tiền đã thanh toán thực tế và cách xử lý báo cáo được chụp tại thời điểm ghi.

| Field | Type / shape | Required | Rules for this feature |
|---|---|---:|---|
| `treatment` | capital treatment enum | Yes | `depreciable_asset` là treatment duy nhất được phép có `useful_life_months`. |
| `useful_life_months` | positive integer or null | Conditional | Tài sản có thể là `null` khi `quantity` là số nguyên dương; giá trị được nhập phải lớn hơn 0. Treatment khác tài sản phải là `null`. |
| `quantity` | positive integer or null | No | Khi có giá trị, biểu thị vật phẩm đếm được và phải lớn hơn 0. Giá trị dương cho phép `useful_life_months` là `null` đối với tài sản. |
| `unit_label` | text or null | No | Chỉ được có khi `quantity` có giá trị; không phải điều kiện cho ngoại lệ số tháng sử dụng. |
| `amount` | positive VND amount | Yes | Không thay đổi; được tính vào tiền đã chi theo ngày đã trả. |
| `paid_on` | date | Yes | Dùng lọc tổng tiền đã chi và placeholder theo kỳ. |

## Database invariants

1. Giữ constraint số lượng: `quantity` là null hoặc số nguyên dương.
2. Giữ constraint đơn vị: `unit_label` chỉ được có khi `quantity` có giá trị dương.
3. Thay constraint treatment/số tháng hiện tại bằng named CHECK tương đương:
   - Nếu là tài sản: `useful_life_months` là số nguyên dương **hoặc** `quantity` là số nguyên dương.
   - Nếu không là tài sản: `useful_life_months` là null.
4. Không thêm cột trạng thái hoặc phương thức phân bổ. Trạng thái “chờ phân bổ” là giá trị dẫn xuất từ `treatment = depreciable_asset`, `quantity > 0`, và `useful_life_months is null`.

## Derived reporting values

| Value | Definition | Included in period expense? |
|---|---|---:|
| Depreciation | Tài sản có `useful_life_months` dương, phân bổ đều theo quy tắc hiện có | Yes |
| Pending order allocation | Tài sản có `quantity` dương và `useful_life_months` null, ngày đã trả thuộc kỳ xem | No |
| Period expense | Chi phí ngay trong kỳ + khấu hao xác định được | Yes |
| Cash spent | Mọi khoản đã trả trong kỳ, gồm cả pending order allocation | N/A |

## Relationships and audit

- `capital_expenses` thuộc một `capital_category` và có thể có nhiều `capital_expense_changes`.
- Sửa số lượng hoặc số tháng sử dụng tiếp tục kích hoạt audit snapshot trước/sau; không có thay đổi quan hệ hay lifecycle.
