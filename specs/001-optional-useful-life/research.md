# Phase 0 Research: Optional useful-life months

## Decision: Blank useful-life is persisted as `null`, never `0`

**Rationale**: Giá trị trống biểu thị khoản chờ phân bổ, còn `0` là thời hạn không hợp lệ. Server Action chuẩn hoá ô trống thành `null`; nếu người dùng có nhập giá trị thì giá trị đó phải là số nguyên dương.

**Alternatives considered**:

- Dùng `0` làm sentinel: loại vì trộn lẫn trạng thái chờ với dữ liệu sai và dễ lọt vào báo cáo.
- Chỉ kiểm tra ở browser: loại vì có thể bị bỏ qua qua request trực tiếp.

## Decision: Enforce the exact cross-field invariant in PostgreSQL

**Rationale**: Migration hiện tại yêu cầu `(treatment = depreciable_asset) = (useful_life_months is not null)`, nên chặn ngoại lệ mới. Migration tiếp theo sẽ thay constraint đó bằng constraint có tên rõ ràng: tài sản phải có số tháng sử dụng dương **hoặc** số lượng dương; treatment khác tài sản không được có số tháng sử dụng. Constraint số lượng dương hiện có vẫn giữ nguyên. Ràng buộc database bảo vệ dữ liệu khi có import hoặc ghi trực tiếp ngoài form.

**Alternatives considered**:

- Bỏ ràng buộc database: loại vì dữ liệu sai có thể vượt qua UI.
- Thêm `allocation_method`/`allocation_status` ngay bây giờ: hoãn vì PM chỉ phê duyệt placeholder, không phải mô hình phân bổ hoàn chỉnh.

## Decision: Keep the placeholder outside current period expense

**Rationale**: PM xác nhận cách phân bổ tương lai dựa trên số đơn hàng, nhưng dữ liệu thống kê này chưa tồn tại. Khoản chờ phân bổ vẫn thuộc tổng tiền đã chi theo tháng đã trả, nhưng khấu hao và chi phí kỳ tiếp tục chỉ gồm các thành phần đã có quy tắc tính xác định.

**Assumption**: Placeholder trong báo cáo kỳ tổng hợp các khoản chờ phân bổ có ngày đã trả thuộc kỳ được chọn. Đây chỉ là chỉ số theo dõi, không phải chi phí hay khấu hao.

**Alternatives considered**:

- Tính toàn bộ thành chi phí ngay: loại vì trái với ý định phân bổ theo đơn hàng.
- Hiển thị tổng placeholder tất cả thời gian: loại vì không đồng nhất với báo cáo Chi vốn hiện lọc theo tháng.

## Decision: Preserve Next.js Server Action mutation pattern and invalidate after success

**Rationale**: Next.js hiện hành hướng dẫn Server Actions nhận `FormData`, xác thực ở server và gọi `revalidatePath` sau mutation để dữ liệu route mới. Luồng sửa giữ thứ tự revalidate trước redirect vì `redirect` kết thúc action. Phạm vi này không thay đổi cơ chế điều hướng hay auth.

**Alternatives considered**:

- Chỉ dùng validation HTML: loại vì không phải nguồn xác thực.
- Đổi ngay sang cơ chế form-state/inline errors mới: hoãn vì không cần để đáp ứng rule, sẽ mở rộng UI ngoài scope.

## Sources consulted

- Context7, Next.js official docs (`/vercel/next.js`): Server Action `FormData` validation, `revalidatePath`, `redirect` after mutation.
- Context7, Supabase CLI official docs (`/supabase/cli`): migration workflow (`supabase migration new`, `supabase migration up`, `supabase db push`).
- Context7, Supabase/PostgreSQL guidance: table-level `CHECK` constraints are appropriate for cross-column invariants; supplied useful-life remains positive while nullable values represent the approved exception.
