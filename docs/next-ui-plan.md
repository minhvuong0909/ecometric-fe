# Kế hoạch cải thiện EcoMetric tiếp theo

1. Hoàn thiện homepage và authentication: tương phản, responsive, hai theme, trạng thái loading/lỗi và Google login.
2. Redesign dashboard: phân cấp số liệu, biểu đồ, dữ liệu trống và hành động tiếp theo.
3. Cải thiện nhập liệu/upload: lựa chọn cách nhập, tiến trình, xác thực file và thử lại.
4. Hoàn thiện AI review: phân biệt dữ liệu cần kiểm tra, chỉnh sửa và xác nhận trước khi lưu.
5. Đồng bộ Eco Score và báo cáo: giải thích điểm, khuyến nghị, kỳ báo cáo, đơn vị và xuất dữ liệu.
6. Kiểm tra toàn luồng: desktop/mobile, sáng/tối, bàn phím, lỗi, dữ liệu trống và tốc độ.

## Motion graphic được đưa vào các giai đoạn tiếp theo

- Homepage: lên concept luồng dữ liệu đầu vào → phân tích EcoMetric → kết quả; duyệt concept trước khi triển khai cảnh tương tác.
- Authentication: motion môi trường nhẹ, giữ form đứng yên.
- Dashboard: chuyển động khi đổi kỳ báo cáo hoặc cập nhật dữ liệu.
- Upload/AI review: thể hiện tiến trình xử lý thực tế, không dùng tiến độ giả.
- Eco Score: chuyển động thể hiện thay đổi điểm và tiến bộ.
- Toàn bộ motion: hỗ trợ giảm chuyển động, tối ưu mobile và dừng hiệu ứng ngoài viewport khi phù hợp.

Theo yêu cầu mới nhất, cảnh motion tương tác vừa triển khai đã được hoàn tác. Giữ bản UI trước đó cùng theme toggle và các hiệu ứng nhẹ hiện có.

## Plan đã được duyệt — tiêu chí thiết kế biểu đồ

- Hợp sản phẩm kiểm kê carbon EcoMetric: bố cục gọn, ưu tiên độ chính xác và khả năng đọc; tránh trang trí, glow, gradient và màu cầu vồng không phục vụ dữ liệu.
- Xu hướng phát thải theo thời gian: biểu đồ đường khi cần theo dõi xu hướng; cột khi so sánh tổng phát thải theo ngày/tháng. Tần suất hiển thị phải phù hợp bộ lọc kỳ báo cáo.
- Xếp hạng nguồn phát thải: cột ngang, sắp xếp giảm dần, tên nguồn và giá trị rõ. Nêu rõ khi chỉ hiển thị các nguồn lớn nhất; không trình bày tỷ trọng nhóm top như tỷ trọng toàn bộ doanh nghiệp.
- So sánh Scope 1/2/3: cột cùng thang đo; cột chồng chỉ khi cần thể hiện thành phần của tổng theo thời gian. Màu từng Scope phải nhất quán giữa các màn.
- Donut chỉ dùng cho tỷ trọng thực sự của một tổng, ít nhóm và tổng đầy đủ; không dùng để xếp hạng hoặc so sánh những giá trị gần nhau.
- Nhãn trục và tooltip có đơn vị kgCO₂e/tCO₂e nhất quán, thời gian dễ hiểu; giá trị nhỏ không bị làm tròn thành 0 gây hiểu nhầm. Trục cột bắt đầu từ 0.
- Một màu nhấn chính theo thương hiệu và các màu phụ tiết chế đủ phân biệt; không chỉ dựa vào màu để truyền đạt ý nghĩa. Chữ và đường lưới rõ ở theme sáng/tối.
- Phân biệt loading, lỗi, chưa có dữ liệu và giá trị bằng 0; không tạo dữ liệu giả để làm đẹp dashboard.
- Motion theo thay đổi dữ liệu và thao tác, không chạy biểu đồ lặp liên tục trong màn làm việc; hỗ trợ giảm chuyển động.
- Kiểm tra trên desktop/mobile: không cắt tên nguồn, nhãn không đè nhau, có cách đọc giá trị ngoài hover khi cần.

Thứ tự triển khai giữ nguyên: hoàn thiện homepage/auth → dashboard mẫu với các biểu đồ phù hợp → nhập liệu/upload → AI review → Eco Score/báo cáo → kiểm tra toàn luồng. Motion graphic là một phần trong plan đã duyệt.

## Tiến độ triển khai

- Homepage/auth: giữ hai theme và motion nhẹ; đã ẩn cả tiêu đề lẫn nút Google khi external auth chưa bật. Đã kiểm tra form trống hiển thị lỗi email/mật khẩu; chưa xác minh đăng nhập thành công hoặc Google OAuth.
- Dashboard: đã thay donut top-5 bằng cột ngang xếp hạng với giá trị tuyệt đối; biểu đồ cột theo ngày cho 7 ngày/tháng và theo tháng cho năm; Scope dùng cột cùng thang đo, màu xanh/trầm/xám xanh/ochre tiết chế. Bỏ giới hạn trục cố định và tỷ trọng top-5 gây hiểu nhầm.
- Có bảng đọc số liệu theo kỳ và số liệu Scope ngoài tooltip; tách loading/lỗi/rỗng/0, retry theo từng truy vấn. Không giả lập dữ liệu. Số liệu nhỏ giữ độ chính xác và đơn vị phù hợp.
- Bỏ trạng thái hệ thống chưa có API xác nhận, thay bằng các hành động tiếp theo. KPI không biến lỗi/chưa tải thành số 0 và không dùng count-up cho chuỗi định dạng số Việt Nam.
- Xác minh dashboard bằng dữ liệu thật đang chờ người dùng đăng nhập. Các giai đoạn nhập liệu/upload, AI review, Eco Score/báo cáo và kiểm tra toàn luồng vẫn còn trong plan.

Workspace standardization: shared public/workspace palette, consistent panels/inputs/selects/tables/progress, readable sidebar labels, responsive page headers and mobile theme toggle. Verified real server data on dashboard, input/report screens and Eco Score empty state; report mobile width 390 has no horizontal overflow. No server data written during visual QA.
