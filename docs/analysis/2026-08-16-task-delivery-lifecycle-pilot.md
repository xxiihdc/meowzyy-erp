# Pilot: vòng đời thực hiện một Task

> Proposal for PM review only. This note is non-authoritative and does not replace `docs/project-delivery-flow.md` until the PM approves it.

## Mục tiêu

Tạo một quy ước ngắn, nhất quán cho việc đưa một Task từ backlog đến hoàn tất, đồng thời cho phép tách các tồn đọng không chặn scope hiện tại.

## Định nghĩa

- **Task:** một phần việc có đầu ra kiểm chứng được, thuộc đúng một Story.
- **Evidence:** tài liệu, kết quả kiểm thử, ảnh UI, kết quả import hoặc bằng chứng khác chứng minh từng Acceptance Criteria.
- **Blocker:** điều kiện còn thiếu làm không thể bắt đầu hoặc xác minh Task hiện tại.
- **Deferred item:** điều còn thiếu nhưng không cần để hoàn tất scope hiện tại; phải được liên kết tới một Task kế tiếp trước khi đóng Task gốc.

## Trạng thái GitHub Project

| Trạng thái | Ý nghĩa | Điều kiện vào | Điều kiện ra |
| --- | --- | --- | --- |
| `Todo` | Task đã được tạo, chưa bắt đầu. | Có parent Story, mô tả, Acceptance Criteria, scope/exclusions, dependency/risk và link docs. | Developer hoặc PM bắt đầu công việc đã được xác nhận. |
| `In Progress` | Đang discovery, thiết kế hoặc triển khai trong scope Task. | Chỉ thay đổi một Task được bắt đầu rõ ràng. | Đủ evidence để PM xác nhận hoàn tất, hoặc phát hiện blocker cần PM quyết định. |
| `Done` | PM đã xác nhận kết quả Task. | Toàn bộ AC đạt, hoặc các phần không thuộc scope được tách thành Task kế tiếp có link rõ ràng. | Issue được đóng; với thay đổi repository, commit được push theo quy ước hiện hành. |

GitHub Project hiện chỉ có ba trạng thái trên. `Blocked` không là trạng thái riêng: giữ `In Progress`, ghi blocker ở issue và hỏi PM một câu quyết định cụ thể.

## Quy trình chuẩn

1. **Chốt scope:** PM và developer xác định outcome nhỏ nhất, in-scope/out-of-scope, AC, dependency và docs nguồn sự thật.
2. **Tạo Task:** Task là child của Story, được thêm vào Project ở `Todo`; tài liệu liên quan thêm dòng `GitHub tracking` sau khi issue tồn tại.
3. **Bắt đầu:** chuyển Task sang `In Progress` khi bắt đầu discovery, thiết kế hoặc implementation; không cần đợi code.
4. **Làm và cập nhật evidence:** thay đổi nghiệp vụ/data model cập nhật docs trong cùng Task. Evidence được ghi ở issue hoặc artefact liên kết, không thay bằng diễn giải miệng.
5. **Xử lý thay đổi scope:** PM xác nhận thay đổi trước. Cập nhật docs; sau đó cập nhật issue/AC khi PM yêu cầu.
6. **Tách tồn đọng:** nếu một phần không chặn scope, tạo một Task successor dưới đúng Story, ghi rõ điều được chuyển và exclusions. Task gốc chỉ đóng khi PM xác nhận phần còn lại không thuộc scope của nó.
7. **Xác minh và đóng:** developer đối chiếu từng AC với evidence; PM xác nhận hoàn tất. Với thay đổi repository, commit push dùng keyword `Closes #<task-number>`, `Fixes #<task-number>` hoặc `Resolves #<task-number>` theo policy hiện hành. Project chuyển `Done` và issue đóng.

## Cổng “ready to implement”

Chỉ bắt đầu code, migration, config hoặc sửa Figma khi tất cả điều kiện liên quan đều đạt:

- Business workflow và rules ảnh hưởng scope đã được PM chốt trong `docs/`.
- Data model/constraint cần thiết đã được chốt, hoặc Task chỉ có scope UI không chạm data behavior.
- Input/mapping nguồn cần thiết đã có bằng chứng; nếu không có, có manual exception được PM chấp nhận.
- Task AC có thể kiểm chứng và không mâu thuẫn docs.
- Với UI: có Figma URL và target frame/node, đồng thời đã đối chiếu với docs.
- Không còn blocker đã biết; deferred item được tách ra khỏi Task hiện tại.

## Evidence tối thiểu theo loại Task

| Loại Task | Evidence trước khi PM xác nhận Done |
| --- | --- |
| Discovery / docs | Quyết định đã chốt trong docs, link file nguồn hoặc analysis, open questions/deferred item được ghi rõ. |
| Import / data | File mẫu đã kiểm tra, mapping/validation rules, kết quả kiểm thử gồm dòng hợp lệ và lỗi. |
| Code / UI | Diff phù hợp scope, kiểm thử phù hợp rủi ro; UI có Figma target và bằng chứng kiểm tra route/state. |
| Migration / security | Docs model/rules, migration review, kiểm tra migration/RLS hoặc lý do phạm vi chưa áp dụng. |

## Quy tắc không diễn giải ngầm

- Không tự coi code diff là hoàn thành Task.
- Không đóng Task vì mọi thứ “có vẻ xong”; phải đối chiếu AC hoặc có xác nhận PM về phần được tách.
- Không để một câu hỏi chưa trả lời chặn toàn bộ Story nếu câu hỏi đó thuộc Task deferred riêng.
- Không dùng docs analysis hoặc Project status để thay thế một quyết định nghiệp vụ đã duyệt trong docs.

## Cách pilot và review

Áp dụng quy ước này cho ba Task tiếp theo. Sau mỗi Task, PM review ba điểm: AC có đủ rõ không, evidence có vừa đủ không và việc tách tồn đọng có giúp unblock scope không. Chỉ sau đó mới hợp nhất nội dung phù hợp vào `docs/project-delivery-flow.md`.
