# Data model: Order import MVP

## Scope and source of truth

Model này phục vụ workflow đã duyệt tại `docs/workflows/order-import-and-revenue-mvp.md`. Dữ liệu import là nguồn ban đầu; sửa tay là nguồn hiện hành cho các trường đã sửa, có audit trước/sau.

## Glossary

- **Đơn (order):** một giao dịch có một mã đơn do một sàn cấp.
- **Dòng đơn (order line):** một sản phẩm/SKU trong một đơn; đây là grain của báo cáo sản phẩm/SKU.
- **Lần import (import batch):** một file được một người dùng tải lên và xử lý.
- **Tiền sàn chuyển:** số tiền sàn trả cho shop cho một đơn; là doanh thu MVP khi đơn hoàn tất.
- **Trạng thái chuẩn hoá:** trạng thái nội bộ dùng để xác định đơn hoàn tất, được suy ra từ trạng thái gốc theo mapping từng sàn đã xác minh.

## Open questions

- Template import, mapping file thực tế của Shopee/TikTok và cột tiền sàn chuyển đang **pending** theo quyết định PM; schema import chưa được sử dụng bởi ứng dụng.
- Chính sách lưu trữ file nguồn chưa được PM xác nhận; MVP chỉ cần lưu metadata và kết quả import.

## Capital expenditure MVP

Workflow đã duyệt tại `docs/workflows/capital-expenditure-mvp.md`. Khoản chi là nguồn sự thật của tiền đã trả; cách xử lý được chụp trên từng khoản chi để lịch sử báo cáo không phụ thuộc thay đổi danh mục.
