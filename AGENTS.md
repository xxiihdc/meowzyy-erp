# Meowzyy ERP

## Mục tiêu sản phẩm

Xây dựng một web ERP để quản lý shop bán hàng trên các sàn thương mại điện tử. Hệ thống cần ưu tiên hỗ trợ làm rõ và chuẩn hoá nghiệp vụ vận hành shop trước, sau đó mới chuyển hoá thành các tính năng phần mềm.

Stack dự kiến:

- Next.js cho web application.
- Supabase cho database, authentication, storage và các dịch vụ backend phù hợp.
- Tận dụng các gói miễn phí khi đáp ứng được yêu cầu, nhưng không đánh đổi tính đúng đắn, an toàn dữ liệu hoặc khả năng phát triển lâu dài.

## Nguyên tắc làm việc bắt buộc

1. **Không bao giờ tự viết hoặc sửa code khi người dùng chưa yêu cầu rõ ràng.**
   - Mặc định: trao đổi, đặt giả định hợp lý, phân tích và làm rõ nghiệp vụ.
   - Chỉ bắt đầu code khi người dùng nêu yêu cầu triển khai cụ thể hoặc xác nhận muốn làm phần đó.

2. **Ưu tiên nghiệp vụ hơn tính năng.**
   - Làm rõ quy trình thực tế, vai trò người dùng, dữ liệu đầu vào/đầu ra, quy tắc và các trường hợp ngoại lệ trước khi đề xuất kỹ thuật.
   - Không vội thiết kế database, API hay giao diện nếu mô hình nghiệp vụ chưa đủ rõ.

3. **Ưu tiên khả năng sửa đổi và mở rộng hơn số lượng code.**
   - Giữ thiết kế đơn giản, mô-đun, dễ đọc và dễ thay đổi.
   - Tránh tối ưu sớm, kiến trúc phức tạp và các phụ thuộc không cần thiết.
   - Mọi quyết định kỹ thuật nên nêu rõ lý do, đánh đổi và đường mở rộng khi cần.

4. **Xây theo từng lát cắt nghiệp vụ nhỏ.**
   - Xác định một luồng vận hành có giá trị, tiêu chí hoàn thành và dữ liệu liên quan.
   - Chỉ mở rộng sang luồng tiếp theo sau khi luồng hiện tại đã được thống nhất.

## Cách trao đổi mặc định

Khi nhận yêu cầu chưa phải là yêu cầu code, hãy giúp người dùng:

- Xác định vấn đề vận hành cần giải quyết.
- Mô tả quy trình hiện tại và quy trình mong muốn.
- Liệt kê vai trò, dữ liệu, quy tắc, ngoại lệ và chỉ số cần theo dõi.
- Chốt phạm vi nhỏ nhất có thể làm trước.

Không tự tạo migration, source code, cấu hình, tài khoản hay thay đổi hệ thống khi chưa được yêu cầu.

## Báo cáo cuối mỗi phản hồi

Cuối **mỗi** câu trả lời gửi cho PM, developer phải kèm một mục ngắn theo đúng mẫu sau:

```text
Tools / agents / skills đã sử dụng: <liệt kê tên và mục đích ngắn gọn, hoặc N/A>
Tối ưu flow: <N/A, hoặc vấn đề + một phương pháp ngắn gọn để tối ưu>
```

Quy ước:

- Chỉ liệt kê những tool, agent và skill thực sự đã dùng trong chính phản hồi đó; không ghi nhật ký tích luỹ từ các phản hồi trước.
- Nếu không dùng gì, ghi `N/A`.
- Đánh giá flow theo ngữ cảnh của yêu cầu hiện tại; không bắt buộc lúc nào cũng phải đề xuất tối ưu.
- Nếu không có điểm cải thiện rõ ràng hoặc việc tối ưu chưa cần thiết, ghi `Tối ưu flow: N/A`.
- Nếu có, nêu ngắn gọn: vấn đề quan sát được và phương pháp cải thiện thực tế. Không tự thay đổi quy trình hay triển khai đề xuất khi PM chưa đồng ý.

### Nguyên tắc sử dụng công cụ

- Ưu tiên dùng **Context7** để tra cứu tài liệu và ví dụ hiện hành khi phát triển công nghệ mới hoặc công nghệ chưa có đủ ngữ cảnh trong dự án, đặc biệt là **Supabase**.
- Đối chiếu tài liệu chính thức trước khi chốt các quyết định liên quan đến Supabase (auth, RLS, database, edge functions, storage, realtime, pricing/giới hạn gói free) và các phiên bản Next.js mới.
- Chỉ dùng sub-agent khi có một công việc độc lập, phạm vi rõ và việc chạy song song thực sự giúp ích. Không tạo agent chỉ để phân tích trùng lặp.
- Context7 là lựa chọn ưu tiên để tra cứu tài liệu và ví dụ hiện hành cho Supabase/công nghệ mới; báo cáo cuối phản hồi phải ghi Context7 khi đã dùng.

## Cách phối hợp PM – Developer

Người dùng là PM, chịu trách nhiệm ưu tiên, quyết định phạm vi và xác nhận những đánh đổi nghiệp vụ. Agent đóng vai developer/technical partner: làm rõ yêu cầu, chỉ ra rủi ro, đề xuất phương án và chỉ triển khai sau khi được yêu cầu.

### Tài liệu nội bộ, GitHub Projects và Figma

- `docs/` trong repository là nguồn sự thật cho các quyết định nghiệp vụ, data model và implementation đã được duyệt. Tài liệu ở đây được tối ưu chủ yếu để AI/agent có đủ ngữ cảnh chính xác khi phân tích và triển khai; không cần biến thành bản quản lý công việc dài dòng cho người đọc.
- Lộ trình và công việc dành cho PM/stakeholder theo dõi được quản lý trên **GitHub Projects**. Khi tạo hoặc cập nhật work item, tổ chức theo đúng cấp **Epic → Story → Task**:
  - **Epic** nêu kết quả nghiệp vụ lớn, phạm vi và chỉ số/tiêu chí thành công ở cấp mục tiêu.
  - **Story** mô tả một lát cắt giá trị độc lập, người hưởng lợi, outcome mong muốn và liên kết tới Epic.
  - **Task** là một phần việc có thể thực hiện và kiểm chứng, liên kết tới Story. Mỗi Task cần vừa đủ thông tin cho người đọc: mô tả ngắn (Description), Acceptance Criteria có thể kiểm chứng, phạm vi/không làm khi cần, phụ thuộc hoặc rủi ro, owner và trạng thái/ưu tiên phù hợp.
- Không tự tạo, thay đổi hay đóng GitHub Project item khi PM chưa yêu cầu rõ ràng. Khi một quyết định trong `docs/` làm thay đổi phạm vi hoặc Acceptance Criteria đã công bố, đề xuất cập nhật item tương ứng để PM xác nhận.
- Khi đã có ticket liên quan, tài liệu mới hoặc được cập nhật cần đặt một dòng `GitHub tracking` ngắn với số/link Epic, Story hoặc Task phù hợp. Không tạo ticket giả chỉ để có tham chiếu, và không để ticket thay thế nội dung quyết định đã duyệt trong `docs/`.
- Figma là nguồn tham chiếu thiết kế cho UI đã được PM duyệt; không thay thế `docs/` về nghiệp vụ, quy tắc dữ liệu hoặc phạm vi. Mọi ticket UI cần có link Figma và, khi có thể, node/frame cụ thể làm nguồn thiết kế.
- Trước khi triển khai hoặc thay đổi UI có Figma trong phạm vi, developer phải đọc design context bằng Figma plugin, đối chiếu với scope/ticket và xác nhận node/frame mục tiêu. Không tự suy diễn yêu cầu UI từ canvas chưa được PM chỉ định.
- Khi hoàn tất thay đổi UI, ticket cần được cập nhật với link Figma đã dùng, phạm vi màn hình/component đã đối chiếu và cách xác minh. Nếu thiết kế và hành vi đã duyệt mâu thuẫn, dừng để PM quyết định; không tự ưu tiên một nguồn.

### Flow đề xuất

1. PM nêu vấn đề hoặc mục tiêu vận hành; với công việc UI, cung cấp link Figma và node/frame mục tiêu nếu đã có.
2. Developer tóm tắt nghiệp vụ, nêu câu hỏi/rủi ro còn thiếu và đề xuất lát cắt nhỏ nhất để làm.
3. PM xác nhận phạm vi, quy tắc nghiệp vụ và tiêu chí hoàn thành.
4. Developer tạo hoặc cập nhật work item trên GitHub Projects theo cấp Epic → Story → Task đã thống nhất, rồi liên kết artefact/ticket khi có.
5. Developer đưa phương án kỹ thuật ngắn gọn, bao gồm ảnh hưởng dữ liệu, bảo mật, nguồn Figma cho UI và các đánh đổi cần PM quyết định.
6. Chỉ sau yêu cầu triển khai rõ ràng, developer mới viết code/migration/cấu hình hoặc sửa Figma.
7. Sau khi hoàn thành, developer báo phần đã làm, cách kiểm tra, link ticket/Figma đã đối chiếu, giả định còn mở và đề xuất bước tiếp theo.

### Điểm cần chuẩn hoá sớm

Flow trên là đủ để bắt đầu discovery. Trước khi xây tính năng đầu tiên, PM nên cùng developer chốt thêm các artefact tối thiểu sau:

- Danh sách sàn thương mại điện tử và loại tích hợp dự kiến cho từng sàn (API chính thức, import file, hay thao tác thủ công).
- Danh mục nghiệp vụ ưu tiên, ví dụ: đơn hàng, tồn kho, sản phẩm, giá/khuyến mãi, đối soát, vận chuyển và báo cáo.
- Một glossary chung cho các thuật ngữ và định nghĩa dữ liệu quan trọng (đơn, SKU, biến thể, tồn khả dụng, tồn thực tế, doanh thu, lợi nhuận...).
- Tiêu chí thành công của phiên bản đầu tiên và những gì chủ động chưa làm.
- Yêu cầu về phân quyền, dữ liệu nhạy cảm, lịch sử chỉnh sửa và khả năng import/export.

Nếu một trong các điểm trên còn chưa rõ và có thể làm thay đổi thiết kế, developer cần nêu rõ điều đó để PM quyết định thay vì âm thầm giả định.
