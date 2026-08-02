# Feature Specification: Cho phép bỏ trống số tháng sử dụng khi có số lượng

**Feature Branch**: `001-optional-useful-life`
**Created**: 2026-08-02
**Status**: Draft
**Input**: User description: "ở màn hình chi vốn, khi nhập số lượng thì có thể không cần nhập số tháng sử dụng"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Lưu khoản chi có số lượng nhưng không có số tháng sử dụng (Priority: P1)

Người dùng nội bộ ghi hoặc sửa một khoản chi vốn. Khi đã nhập số lượng dương cho vật phẩm đếm được, họ có thể để trống số tháng sử dụng và vẫn lưu được khoản chi.

**Why this priority**: Loại bỏ yêu cầu nhập liệu không cần thiết đối với khoản chi đã được mô tả bằng số lượng.

**Independent Test**: Nhập khoản chi hợp lệ có số lượng, để trống số tháng sử dụng, rồi lưu thành công và kiểm tra lại thông tin đã lưu.

**Acceptance Scenarios**:

1. **Given** người dùng đang tạo khoản chi thuộc danh mục tài sản, **When** nhập số tiền hợp lệ và số lượng dương rồi để trống số tháng sử dụng, **Then** hệ thống cho phép lưu khoản chi.
2. **Given** người dùng đang sửa một khoản chi thuộc danh mục tài sản, **When** nhập số lượng dương và xoá số tháng sử dụng, **Then** hệ thống cho phép lưu thay đổi và ghi lịch sử trước/sau.
3. **Given** người dùng đã nhập số lượng dương, **When** xem lại khoản chi đã lưu, **Then** số tháng sử dụng được hiển thị là chưa khai báo và số lượng/đơn vị tính vẫn được giữ nguyên.
4. **Given** khoản chi tài sản có số lượng dương nhưng không có số tháng sử dụng, **When** người dùng xem báo cáo chi phí kỳ, **Then** khoản chi được thể hiện là đang chờ phân bổ theo số đơn hàng và không được tự động đưa vào chi phí kỳ hiện tại.

---

### User Story 2 - Giữ kiểm tra dữ liệu số lượng (Priority: P2)

Người dùng nội bộ chỉ có thể dùng ngoại lệ này khi khoản chi thực sự có số lượng hợp lệ cho vật phẩm đếm được.

**Why this priority**: Ngăn việc bỏ qua số tháng sử dụng bằng dữ liệu số lượng không hợp lệ.

**Independent Test**: Thử lưu khoản chi với số lượng trống, bằng không hoặc âm và số tháng sử dụng trống.

**Acceptance Scenarios**:

1. **Given** số tháng sử dụng đang để trống, **When** số lượng trống, bằng không hoặc âm, **Then** hệ thống không cho phép lưu vì không đáp ứng điều kiện ngoại lệ.
2. **Given** số tháng sử dụng đang để trống, **When** số lượng dương và đơn vị tính để trống, **Then** hệ thống vẫn cho phép lưu vì đơn vị tính là tùy chọn.

### Edge Cases

- Khoản chi không có số lượng và không có số tháng sử dụng không được lưu nếu thuộc danh mục tài sản.
- Khi người dùng xoá số lượng khỏi khoản chi đang không có số tháng sử dụng, hệ thống yêu cầu nhập số tháng sử dụng trước khi cho lưu.
- Khi người dùng sửa một khoản chi đã có số tháng sử dụng để bổ sung số lượng, giá trị số tháng sử dụng hiện có không bị tự động thay đổi.
- Khoản chi chờ phân bổ vẫn được tính vào tổng tiền thực tế đã chi nhưng không được suy diễn chi phí kỳ khi chưa có thống kê đơn hàng.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Hệ thống PHẢI cho phép khoản chi thuộc danh mục tài sản được lưu khi có số lượng dương và không có số tháng sử dụng.
- **FR-002**: Hệ thống PHẢI tiếp tục yêu cầu số tháng sử dụng đối với khoản chi thuộc danh mục tài sản khi không có số lượng hợp lệ.
- **FR-003**: Hệ thống PHẢI chỉ áp dụng ngoại lệ tại FR-001 khi số lượng là số dương theo quy tắc hiện hành; đơn vị tính vẫn là tùy chọn.
- **FR-004**: Hệ thống PHẢI giữ nguyên quy tắc số lượng chỉ dùng cho vật phẩm đếm được và không dùng số lượng để thay đổi tổng tiền đã chi hoặc đơn giá tham chiếu.
- **FR-005**: Khi sửa khoản chi theo ngoại lệ này, hệ thống PHẢI lưu lịch sử giá trị trước/sau như các lần sửa khoản chi khác.
- **FR-006**: Hệ thống PHẢI coi khoản chi tài sản có số lượng dương và không có số tháng sử dụng là khoản chờ phân bổ theo số đơn hàng trong tháng.
- **FR-007**: Trong phạm vi hiện tại, hệ thống KHÔNG ĐƯỢC tự động đưa khoản chờ phân bổ vào chi phí kỳ khi chưa có thống kê đơn hàng; khoản này phải được thể hiện là placeholder đang chờ xử lý.

### Key Entities *(include if feature involves data)*

- **Khoản chi vốn**: Một lần tiền đã thanh toán thực tế; với danh mục tài sản, số tháng sử dụng có thể trống khi có số lượng dương; đơn vị tính vẫn là tùy chọn.
- **Lịch sử thay đổi khoản chi**: Bản ghi trước/sau của mỗi lần cập nhật khoản chi, bao gồm thay đổi số lượng hoặc số tháng sử dụng.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Người dùng hoàn thành việc lưu khoản chi có số lượng hợp lệ và không có số tháng sử dụng trong một lần gửi biểu mẫu.
- **SC-002**: 100% trường hợp có số lượng trống, bằng không hoặc âm và không có số tháng sử dụng bị chặn trước khi lưu.
- **SC-003**: 100% thay đổi giữa trạng thái có/không có số tháng sử dụng được truy vết bằng giá trị trước/sau.
- **SC-004**: Tổng tiền đã chi và vốn nhập hàng trong báo cáo không thay đổi chỉ vì khoản chi có số lượng.
- **SC-005**: 100% khoản chi không có số tháng sử dụng được nhận diện là đang chờ phân bổ, thay vì bị tính nhầm vào chi phí kỳ.

## Assumptions

- Phạm vi chỉ thay đổi điều kiện bắt buộc của số tháng sử dụng trên luồng tạo và sửa khoản chi vốn.
- Các danh mục, cách xử lý, số tiền đã trả, số lượng, đơn vị tính và lịch sử sửa hiện có vẫn tuân theo workflow Chi vốn MVP đã phê duyệt.
- Không mở rộng sang quản lý tồn kho, SKU, giá vốn, công nợ hoặc trả góp.
- Phân bổ khoản chờ phân bổ theo số đơn hàng trong tháng là nợ kỹ thuật được ghi nhận riêng; phạm vi hiện tại chỉ giữ placeholder, không xây thống kê hoặc công thức phân bổ.
