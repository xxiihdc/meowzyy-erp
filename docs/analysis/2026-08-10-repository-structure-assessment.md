# Đánh giá cấu trúc repository và trạng thái MVP

> Analysis note only. It is not an approved business workflow or data-model decision. Confirm any proposed decision with the PM and update the relevant source-of-truth document separately.

## Question and scope

- **Question:** Repository hiện có những phần nào, phần nào có thể đang hoạt động, và phần nào còn chờ?
- **Inspected:** `README.md`, `package.json`, `docs/`, `specs/`, `app/`, `components/`, `lib/`, và các migration trong `supabase/migrations/`.
- **Excluded:** `.env*`, dữ liệu Supabase đang chạy, `.next/`, `node_modules/`, pnpm store, binary assets và Git history chi tiết. Vì vậy, note này không xác nhận môi trường local hoặc migration đã được áp dụng vào database.
- **Method:** Ưu tiên đọc `docs/` là nguồn sự thật nghiệp vụ; đối chiếu implementation và migration để mô tả hành vi quan sát được.

## Observed facts

| Fact | Evidence |
| --- | --- |
| Web app dùng Next.js, React và Supabase client; script hiện có là dev, build, start và lint. | `package.json` |
| Hướng dẫn local yêu cầu khởi tạo rồi chạy Supabase qua Docker; repository đã có thư mục `supabase/` và migration. | `README.md`; `supabase/config.toml`; `supabase/migrations/` |
| Dashboard gọi truy vấn đơn hàng gần đây và tóm tắt doanh thu; UI import Excel hiện bị disabled và ghi rõ đang chờ file mẫu. | `app/page.tsx` |
| Migration đã khai báo batch import, đơn, dòng đơn và audit thay đổi đơn; đơn là duy nhất theo `(marketplace, marketplace_order_id)`. | `supabase/migrations/202607280001_order_import_mvp.sql` |
| Workflow import đơn chỉ duyệt Shopee và TikTok Shop, dùng Excel export gốc; parser, mapping, upload và ghi import vẫn pending. | `docs/workflows/order-import-and-revenue-mvp.md` |
| Màn hình chi vốn có tạo/ngừng dùng danh mục, tạo khoản chi, lọc danh sách, xem báo cáo tháng và điều hướng sửa khoản chi. | `app/capital/page.tsx`; `app/capital/[id]/page.tsx`; `app/capital/actions.ts` |
| Migration chi vốn có danh mục, khoản chi, audit snapshot và các ràng buộc số lượng/số tháng sử dụng. | `supabase/migrations/202607280002_capital_expenditure_mvp.sql`; `202608020001_capital_expense_quantity.sql`; `202608020002_capital_expense_optional_useful_life.sql` |
| Khoản tài sản có số lượng nhưng không có số tháng sử dụng được báo cáo là chờ phân bổ, không được tính vào chi phí kỳ. | `docs/workflows/capital-expenditure-mvp.md`; `lib/capital/queries.ts` |
| Feature SpecKit gần nhất, `001-optional-useful-life`, có toàn bộ task đánh dấu hoàn thành. | `specs/001-optional-useful-life/tasks.md` |

## Structure map

| Area | Role observed | Evidence |
| --- | --- | --- |
| `docs/workflows/` | Nguồn sự thật cho hai workflow MVP đã được duyệt: import đơn/doanh thu và chi vốn/khấu hao. | `docs/workflows/*.md` |
| `docs/data-model/` | Định nghĩa entity, lifecycle và quan hệ cho hai workflow. | `docs/data-model/` |
| `docs/technical-debt/` | Ghi nhận hạng mục hoãn có dependency rõ ràng. | `docs/technical-debt/capital-expense-order-allocation.md` |
| `app/` | Route Next.js cho dashboard và chi vốn. | `app/page.tsx`; `app/capital/` |
| `lib/` | Truy vấn server-side cho đơn hàng, chi vốn và Supabase. | `lib/orders/`; `lib/capital/`; `lib/supabase/` |
| `supabase/migrations/` | Schema và quyền service role đã khai báo trong source. | `supabase/migrations/*.sql` |
| `specs/001-optional-useful-life/` | Artefact kế hoạch và kiểm chứng của feature đã hoàn tất. | `specs/001-optional-useful-life/` |
| `.agents/skills/` | Các workflow hướng dẫn cho agent, gồm skill phân tích file này. | `.agents/skills/*/SKILL.md` |

## Interpretations / hypotheses

| Hypothesis | Confidence | Supporting evidence | What would confirm it |
| --- | --- | --- | --- |
| Chi vốn là lát cắt nghiệp vụ đang sẵn sàng nhất để dùng nội bộ. | high | Có UI, server actions, truy vấn, migration và workflow đã duyệt. | Chạy acceptance scenario với local Supabase và dữ liệu test. |
| Dashboard đơn hàng là khung giao diện/sẵn schema, chưa là luồng vận hành hoàn chỉnh. | high | Nút import disabled; workflow ghi parser, mapping và upload pending. | File export mẫu được xác minh và một import batch chạy thành công. |
| Import đơn là dependency thực tế để quyết định phân bổ một số khoản chi theo đơn. | high | Technical-debt memo yêu cầu workflow và dữ liệu thống kê đơn hàng được duyệt. | PM chốt tập đơn hợp lệ, công thức phân bổ và cách xử lý import muộn. |
| Repository chưa có một backlog/roadmap tổng chính thức. | medium | Chỉ thấy task list hoàn tất của một feature và các tài liệu workflow/debt riêng lẻ. | PM xác nhận rằng không có tracker hoặc tài liệu ngoài repository. |

## Open questions

- File mẫu từ Shopee và TikTok Shop có những cột, định dạng ngày/tiền, trạng thái và giá trị tiền sàn chuyển nào?
- Local Supabase hiện có đang chạy và đã áp dụng toàn bộ migration không?
- Có backlog ngoài repository (GitHub Issues, Notion, Linear hoặc tương tự) không?
- Sau import đơn, PM muốn ưu tiên báo cáo doanh thu theo ngày/sàn/SKU hay phân bổ chi phí chờ theo đơn trước?

## Suggested next smallest step

PM cung cấp một file Excel export đã ẩn dữ liệu nhạy cảm cho mỗi sàn. Từ hai file đó, tạo discovery note chỉ chốt mapping và quy tắc dữ liệu cần thiết cho lát cắt import Shopee trước; không triển khai parser cho đến khi PM xác nhận.
