# Quickstart Validation: Optional useful-life months

## Prerequisites

- Local Supabase stack đã chạy và môi trường ứng dụng trỏ tới stack này.
- Có ít nhất một danh mục `tài sản khấu hao` và một danh mục không phải tài sản.
- Dependencies đã được cài đặt.

## Run and verify schema

1. Tạo migration theo convention hiện có, rồi áp dụng migration pending cục bộ:

   ```sh
   npx supabase migration up
   ```

2. Xác minh schema: constraint cũ bắt buộc tài sản luôn có số tháng đã được thay thế; giá trị `useful_life_months` hợp lệ vẫn phải dương.

3. Chạy kiểm tra ứng dụng:

   ```sh
   pnpm lint
   pnpm build
   ```

## End-to-end scenarios

1. **Tạo khoản chờ phân bổ**: Chọn danh mục tài sản, nhập ngày/số tiền/số lượng dương, để trống số tháng và đơn vị tính. Lưu thành công; khoản chi có số tháng chưa khai báo.
2. **Chặn dữ liệu thiếu điều kiện**: Chọn danh mục tài sản, để trống cả số lượng lẫn số tháng. Lưu bị từ chối với lý do cần một trong hai giá trị hợp lệ.
3. **Chặn số tháng sai**: Với bất kỳ khoản có số tháng, thử `0`, số âm hoặc số thập phân. Lưu bị từ chối.
4. **Giữ số tháng khi có số lượng**: Sửa khoản tài sản đã có số tháng, thêm số lượng, lưu lại. Số tháng không bị tự xoá và audit có snapshot trước/sau.
5. **Báo cáo kỳ**: Trong kỳ có khoản ở bước 1, tổng tiền đã chi bao gồm khoản này; khấu hao và chi phí kỳ không bao gồm khoản này; UI hiển thị tổng “Chờ phân bổ theo số đơn hàng”.
6. **Không ảnh hưởng treatment khác**: Tạo chi phí ngay/vốn nhập hàng có số lượng và không có số tháng. Hành vi báo cáo hiện có không đổi.

## Acceptance references

- Quy tắc nghiệp vụ: [spec.md](./spec.md)
- Fields và invariants: [data-model.md](./data-model.md)
- Hành vi biểu mẫu/báo cáo: [capital-expense-form.md](./contracts/capital-expense-form.md)
