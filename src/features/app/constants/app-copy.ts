export const APP_SHARED_COPY = {
  topBar: {
    companyLabel: "Doanh nghiệp",
    companyName: "Northstar Foods",
    search: "Tìm kiếm",
    searchPlaceholder: "Tìm màn hình, báo cáo, cài đặt…",
    searchShortcut: "Ctrl K",
    searchEmpty: "Không tìm thấy kết quả cho",
    searchClose: "Đóng tìm kiếm",
    notifications: "Thông báo",
  },
  sidebarTagline: "Kiểm kê carbon cho SME",
  logout: "Đăng xuất",
  loggingOut: "Đang đăng xuất…",
  sidebar: {
    collapse: "Thu gọn thanh bên",
    expand: "Mở rộng thanh bên",
    openMenu: "Mở menu điều hướng",
    closeMenu: "Đóng menu điều hướng",
  },
  navGroups: [
    { label: "Tổng quan", ids: ["dashboard", "businesses"] },
    {
      label: "Kiểm kê phát thải",
      ids: ["company", "data-input", "emission-detail"],
    },
    {
      label: "Phân tích & Báo cáo",
      ids: ["eco-score", "recommendations", "reports"],
    },
    { label: "Hệ thống", ids: ["settings"] },
  ],
  wizardSteps: [
    "Bước 1: Hồ sơ Doanh nghiệp",
    "Bước 2: Ngành nghề & Kỳ báo cáo",
    "Bước 3: Nguồn phát thải",
    "Bước 4: Nhập dữ liệu",
  ],
} as const;

export const DASHBOARD_COPY = {
  breadcrumbs: [
    { label: "Bảng điều khiển", active: true },
    { label: "Tổng quan" },
  ],
  title: "Bảng theo dõi Phát thải",
  description:
    "Theo dõi lượng phát thải hàng tháng, hiệu quả hoạt động ESG và các cơ hội giảm carbon trong toàn doanh nghiệp với các chỉ số chính xác cao.",
  cta: "Xem khuyến nghị",
  metrics: [
    { label: "Tổng lượng CO₂E", value: "3.2 tCO₂e", hint: "Tháng hiện tại" },
    { label: "Điểm số Eco", value: "72/100", hint: "Hiệu quả tốt", hintClass: "text-primary font-medium" },
    { label: "Độ đầy đủ của dữ liệu", value: "85%", hint: "Đã liên kết 12 nguồn dữ liệu" },
    { label: "Biến động phát thải", value: "+8%", hint: "So với tháng trước" },
  ],
  emissionBySource: {
    title: "Phát thải theo Nguồn",
    subtitle: "Tỷ trọng trong tổng lượng CO₂e",
    center: "3.2t",
    centerLabel: "Tổng",
    items: [
      { label: "Điện", value: "42%" },
      { label: "Nhiên liệu", value: "28%" },
      { label: "Vận tải", value: "15%" },
      { label: "Chất thải", value: "9%" },
      { label: "Nước", value: "6%" },
    ],
  },
  monthlyTrend: {
    title: "Xu hướng Phát thải Hàng tháng",
    subtitle: "Từ tháng 1 đến tháng 6, đơn vị: tấn CO₂e",
    months: ["T1", "T2", "T3", "T4", "T5", "T6"],
  },
  scopeBreakdown: {
    title: "Phân rã theo Phạm vi",
    subtitle: "Phân bổ Phạm vi 1, Phạm vi 2, Phạm vi 3",
    scopes: [
      { label: "Phạm vi 1", height: "h-[35%]" },
      { label: "Phạm vi 2", height: "h-[85%]" },
      { label: "Phạm vi 3", height: "h-[45%]" },
    ],
  },
  insights: {
    title: "Thông tin chuyên sâu",
    alerts: [
      {
        title: "Cảnh báo hiệu suất",
        body: "Lượng điện sử dụng tại cơ sở chế biến chính đã tăng 14% so với ngưỡng mục tiêu trong quý này. Cần tiến hành kiểm tra.",
      },
      {
        title: "Cơ hội cải thiện",
        body: "Thay đổi đối tác logistics để phân phối theo vùng có thể giảm khoảng 2,4 tấn phát thải Phạm vi 3 mỗi tháng.",
      },
    ],
    cta: "Xem khuyến nghị",
    systemStatus: "Hoạt động 100%",
    systemLabel: "Trạng thái hệ thống",
  },
} as const;

export const DATA_INPUT_COPY = {
  breadcrumbs: [
    { label: "Nhập liệu", active: true },
    { label: "Nhập thủ công" },
  ],
  title: "Nhập Dữ liệu Hoạt động Hàng tháng",
  description:
    "Nhập dữ liệu hoạt động thực tế của doanh nghiệp trong kỳ báo cáo hiện tại trước khi xác thực và tính toán lượng CO₂e.",
  completeness: "Độ đầy đủ của dữ liệu: 75%",
  cards: [
    {
      title: "Điện",
      subtitle: "Dữ liệu hoạt động hàng tháng",
      fields: [
        { label: "Sản lượng tiêu thụ (kWh)", value: "1,500" },
        { label: "Chi nhánh", value: "Quận 1" },
        { label: "Kỳ hóa đơn", value: "Tháng 6 2026" },
      ],
    },
    {
      title: "Nhiên liệu",
      subtitle: "Dữ liệu hoạt động hàng tháng",
      fields: [
        { label: "Loại nhiên liệu", value: "Dầu diesel" },
        { label: "Số lượng (lít)", value: "320" },
        { label: "Chi nhánh", value: "Kho Bình Dương" },
      ],
    },
    {
      title: "Vận tải",
      subtitle: "Dữ liệu hoạt động hàng tháng",
      fields: [
        { label: "Quãng đường (km)", value: "4,200" },
        { label: "Loại phương tiện", value: "Xe tải" },
        { label: "Kỳ báo cáo", value: "Tháng 6 2026" },
      ],
    },
    {
      title: "Chất thải",
      subtitle: "Dữ liệu hoạt động hàng tháng",
      fields: [
        { label: "Khối lượng (tấn)", value: "12.5" },
        { label: "Phương thức xử lý", value: "Tái chế" },
        { label: "Chi nhánh", value: "Quận 1" },
      ],
    },
    {
      title: "Nước",
      subtitle: "Dữ liệu hoạt động hàng tháng",
      fields: [
        { label: "Lượng tiêu thụ (m³)", value: "860" },
        { label: "Chi nhánh", value: "Quận 1" },
        { label: "Kỳ hóa đơn", value: "Tháng 6 2026" },
      ],
    },
  ],
  cta: "Tính toán CO₂e",
} as const;

export const INPUT_STEP_1_COPY = {
  setupTitle: "Thiết lập doanh nghiệp",
  cardTitle: "Bước 1 / 4: Tạo hồ sơ doanh nghiệp",
  description:
    "Thông tin doanh nghiệp giúp EcoMetric tính toán và so sánh lượng phát thải chính xác hơn với các tiêu chuẩn của ngành và mức trung bình của khu vực.",
  fields: [
    { label: "Tên Công ty", value: "Northstar Foods" },
    { label: "Mã số đăng ký kinh doanh", value: "0123456789" },
    { label: "Quy mô công ty", value: "Nhỏ (11-50 nhân viên)" },
    { label: "Số lượng nhân viên", value: "145" },
    { label: "Số lượng chi nhánh", value: "3" },
    { label: "Trụ sở chính", value: "Quận 1, TP. Hồ Chí Minh" },
    { label: "Người liên hệ", value: "Alex Morgan" },
    { label: "Email liên hệ", value: "alex@company.com" },
  ],
  sidebarTitle: "Vì sao điều này quan trọng?",
  sidebarTips: [
    "Hồ sơ doanh nghiệp giúp thiết lập mức cơ sở cho các chỉ số cường độ phát thải.",
    "Thông tin liên hệ giúp điều phối quy trình phê duyệt báo cáo.",
    "Địa điểm giúp cải thiện việc đối chiếu hệ số phát thải theo vùng.",
  ],
} as const;

export const INPUT_STEP_2_COPY = {
  setupTitle: "Thiết lập doanh nghiệp",
  cardTitle: "Bước 2 / 4: Chọn Ngành nghề và Kỳ báo cáo",
  description:
    "Chọn danh mục kinh doanh gần nhất với doanh nghiệp của bạn và chu kỳ báo cáo dữ liệu ESG.",
  industries: ["Bán lẻ", "Văn phòng", "Vận tải", "Sản xuất", "Giáo dục", "Khác"],
  selectedIndustry: "Vận tải",
  periods: ["Theo tháng", "Theo quý", "Theo năm"],
  selectedPeriod: "Theo tháng",
  dateRange: { start: "Tháng 1", end: "Tháng 12", year: "2024" },
  sidebarTitle: "Góc nhìn chuyên sâu về Ngành F&B",
  sidebarBody:
    "Các doanh nghiệp F&B thường theo dõi lượng điện tiêu thụ, hệ thống làm lạnh, nhiên liệu vận chuyển, bao bì, chất thải và nguyên liệu đầu vào được thu mua.",
  readiness: "Hoàn thành",
} as const;

export const INPUT_STEP_3_COPY = {
  setupTitle: "Thiết lập doanh nghiệp",
  cardTitle: "Bước 3 / 4: Chọn Nguồn Phát thải Cần Theo dõi",
  description:
    "Chọn các danh mục dữ liệu liên quan đến hoạt động kinh doanh của bạn. Bạn có thể bổ sung thêm sau.",
  sources: [
    { title: "Điện", badge: "Phạm vi 2", desc: "Điện lưới, điện mua ngoài và năng lượng tòa nhà có công tơ đo lường." },
    { title: "Nhiên liệu", badge: "Phạm vi 1", desc: "Xăng, dầu, LPG và các nhiên liệu đốt cháy tại doanh nghiệp." },
    { title: "Vận tải", badge: "Phạm vi 1 hoặc Phạm vi 3", desc: "Số dặm của đội xe sở hữu, đối tác giao hàng và dịch vụ logistics thuê ngoài." },
    { title: "Chất thải", badge: "Phạm vi 3", desc: "Chất thải chung, chất thải tái chế, chôn lấp, ủ phân hữu cơ và hồ sơ xử lý chất thải." },
    { title: "Nước", badge: "Chỉ số môi trường", desc: "Lượng nước tiêu thụ theo chi nhánh, cơ sở hoặc địa điểm vận hành." },
    { title: "Bao bì", badge: "Phạm vi 3", desc: "Vật liệu bao bì thu mua, khối lượng và sản lượng từ nhà cung cấp." },
  ],
  recommended: ["Điện", "Lượng nước tiêu thụ", "Chất thải & Tái chế", "Bao bì", "Vận tải"],
  continueCta: "Tiếp tục đến phần Nhập liệu",
} as const;

export const UPLOAD_DOC_COPY = {
  breadcrumbs: [
    { label: "Nhập liệu", active: true },
    { label: "Tải lên tài liệu" },
  ],
  description:
    "Tải lên các hóa đơn, biên lai hoặc báo cáo. EcoMetric sẽ tự động trích xuất các dữ liệu cốt lõi bằng mô hình AI độc quyền để tính toán phát thải một cách chính xác.",
  uploadTitle: "Kéo và thả tệp vào đây",
  uploadHint:
    "Định dạng hỗ trợ: JPG, PNG, PDF, Excel, CSV. Bạn có thể tải lên nhiều tài liệu cùng lúc và phân loại chúng trước khi trích xuất.",
  docTypes: ["Hóa đơn tiền điện", "Biên lai nhiên liệu", "Báo cáo vận tải", "Báo cáo chất thải", "Hóa đơn tiền nước", "Khác"],
  tableTitle: "Tệp đã tải lên",
  tableSubtitle: "4 tài liệu đã sẵn sàng xử lý",
  columns: ["Tên tệp", "Loại tài liệu", "Ngày tải lên", "Trạng thái"],
  files: [
    { name: "hoa-don-dien-t6.pdf", type: "Hóa đơn tiền điện", date: "14/06/2026", status: "Chờ kiểm tra" },
    { name: "nhien-lieu-xe-tai.xlsx", type: "Biên lai nhiên liệu", date: "13/06/2026", status: "Đã trích xuất" },
    { name: "van-tai-q2.pdf", type: "Báo cáo vận tải", date: "12/06/2026", status: "Cần xác nhận" },
    { name: "chat-thai-thang-6.csv", type: "Báo cáo chất thải", date: "11/06/2026", status: "Lỗi" },
  ],
  extractCta: "Trích xuất bằng AI",
} as const;

export const AI_REVIEW_COPY = {
  breadcrumbs: [
    { label: "Nhập liệu", active: true },
    { label: "Kiểm tra nhập liệu thủ công" },
  ],
  title: "Kiểm tra dữ liệu trích xuất",
  description:
    "Vui lòng kiểm tra và xác nhận các chi tiết được trích xuất bên dưới. Một giá trị (Sản lượng tiêu thụ) đã bị cảnh báo cần xác minh thủ công do có sự biến động bất thường so với hóa đơn trước.",
  warning: "+15.2% so với kỳ trước, cần xác minh sản lượng tiêu thụ điện",
  fields: [
    { label: "Loại tài liệu", value: "Hóa đơn tiện ích (Điện)" },
    { label: "Kỳ hóa đơn", value: "Tháng 6/2024" },
    { label: "Chi nhánh", value: "Quận 1" },
    { label: "Sản lượng tiêu thụ điện (kWh)", value: "1,500", warn: true },
    { label: "Độ tin cậy trích xuất", value: "Độ tin cậy cao (92%)" },
  ],
  actions: ["Xác nhận dữ liệu", "Chỉnh sửa", "Từ chối", "Tải lại tài liệu"],
  calculateCta: "Tính toán CO₂e",
} as const;

export const EMISSION_DETAIL_COPY = {
  eyebrow: "Chi tiết tính toán phát thải",
  title: "Tính toán phát thải",
  description:
    "Dữ liệu hoạt động được đối chiếu với các hệ số phát thải đã xác thực để tính toán lượng CO₂e tương đương trong toàn bộ hoạt động toàn cầu.",
  exportCta: "Xuất bảng tính toán",
  recalculateCta: "Tính toán lại",
  tableTitle: "Bảng tính toán",
  tableSubtitle: "Kết quả CO₂e theo từng nguồn và trạng thái hệ số",
  badge: "4 đã tính toán",
  columns: ["Nguồn phát thải", "Dữ liệu hoạt động", "Hệ số", "Phạm vi", "CO₂e"],
  rows: [
    { source: "Điện", activity: "1,500 kWh", factor: "0.00045", scope: "Phạm vi 2", result: "0.68 t" },
    { source: "Nhiên liệu", activity: "320 L", factor: "0.00268", scope: "Phạm vi 1", result: "0.86 t" },
    { source: "Vận tải", activity: "4,200 km", factor: "0.00012", scope: "Phạm vi 3", result: "0.50 t" },
    { source: "Chất thải", activity: "12.5 tấn", factor: "0.00089", scope: "Phạm vi 3", result: "0.11 t" },
  ],
  total: "3.2 tCO₂e",
} as const;

export const ECO_SCORE_COPY = {
  breadcrumbs: [
    { label: "Điểm số Eco", active: true },
    { label: "Chi tiết" },
  ],
  title: "Điểm số Eco",
  description:
    "Bảng điểm nội bộ chính xác được thiết kế để theo dõi hiệu quả hoạt động môi trường trên bốn lĩnh vực trọng yếu.",
  score: "72",
  scoreMax: "/100",
  efficiency: "Hiệu quả tốt",
  subMetrics: [
    { title: "Cường độ phát thải", target: "Mục tiêu: 35", progress: 70 },
    { title: "Xu hướng giảm phát thải", target: "Mục tiêu: 22", progress: 72 },
    { title: "Độ đầy đủ của dữ liệu", target: "Mục tiêu: 15", progress: 87 },
    { title: "Hành động cải thiện", target: "Mục tiêu: 18", progress: 65 },
  ],
  changesTitle: "Những thay đổi trong tháng này",
  changesBadge: "Đã ghi nhận 4 cập nhật",
  changes: [
    "Phát thải từ điện năng tăng 4.2%",
    "Đã hoàn thành kiểm toán dữ liệu chất thải hàng quý",
    "Dữ liệu vận tải cần được xem xét xác thực",
    "Đã triển khai hai hành động xanh ưu tiên",
  ],
  improveCta: "Cải thiện điểm số của tôi",
} as const;

export const RECOMMENDATIONS_COPY = {
  breadcrumbs: [{ label: "Khuyến nghị", active: true }],
  title: "Khuyến nghị cải thiện",
  description:
    "Các hành động đề xuất dựa trên kết quả phát thải của doanh nghiệp trong kỳ hiện tại.",
  filters: ["Tất cả", "Tiết kiệm năng lượng", "Giảm thiểu chất thải", "Tối ưu hóa vận tải"],
  hero: {
    title: "Điện năng là nguồn phát thải cao nhất của bạn trong tháng này.",
    body: "Hãy bắt đầu từ việc thay đổi thói quen sử dụng năng lượng vận hành trước khi tiến hành thay đổi nhà cung cấp hoặc cơ sở hạ tầng.",
    focus: "lượng CO₂e hàng tháng đến từ điện năng",
  },
  cards: [
    {
      priority: "Ưu tiên cao",
      title: "Tiết kiệm năng lượng",
      related: "Liên quan đến: Điện năng",
      actions: ["Tối ưu hóa việc sử dụng điều hòa", "Thay thế đèn cũ bằng đèn LED", "Thiết lập lịch tắt nguồn tự động"],
      impact: "Giảm 8-12% lượng điện tiêu thụ",
    },
    {
      priority: "Ưu tiên trung bình",
      title: "Giảm thiểu chất thải",
      related: "Liên quan đến: Chất thải vận hành",
      actions: ["Phân loại rác tái chế", "Giảm thiểu nhựa sử dụng một lần", "Hợp tác với đơn vị tái chế"],
      impact: "Giảm 10% lượng phát thải từ chất thải",
    },
    {
      priority: "Ưu tiên thấp",
      title: "Tối ưu hóa vận tải",
      related: "Liên quan đến: Đội xe & Vận chuyển",
      actions: ["Tối ưu/kết hợp các tuyến đường giao hàng", "Giảm thiểu các chuyến xe chạy rỗng", "Theo dõi lượng tiêu thụ nhiên liệu"],
      impact: "Giảm 5-8% lượng phát thải từ nhiên liệu",
    },
  ],
} as const;

export const REPORTS_COPY = {
  breadcrumbs: [
    { label: "Báo cáo", active: true },
    { label: "Nhập liệu thủ công" },
  ],
  title: "Báo cáo Môi trường ESG",
  description:
    "Khởi tạo và xuất các báo cáo phát thải để kiểm duyệt nội bộ hoặc gửi cho các bên liên quan.",
  reportTypes: [
    { title: "Báo cáo hàng tháng", desc: "Phân rã chi tiết lượng phát thải của tháng hoạt động hiện tại." },
    { title: "Báo cáo hàng quý", desc: "Phân tích hiệu quả hoạt động trong quý và so sánh xu hướng." },
    { title: "Tóm tắt ESG hàng năm", desc: "Báo cáo tổng hợp cuối năm, sẵn sàng cho việc công bố thông tin." },
    { title: "Phụ lục tính toán", desc: "Bảng dữ liệu thô và thuyết minh phương pháp luận khi kiểm toán." },
  ],
  tableColumns: ["Tên báo cáo", "Kỳ báo cáo", "Ngày tạo", "Trạng thái"],
  reports: [
    { name: "Báo cáo tháng 6/2026", period: "Tháng 6 2026", date: "15/06/2026", status: "Sẵn sàng" },
    { name: "Báo cáo Q2/2026", period: "Q2 2026", date: "01/06/2026", status: "Đã xuất" },
    { name: "Tóm tắt ESG 2025", period: "Năm 2025", date: "20/01/2026", status: "Bản nháp" },
    { name: "Phụ lục tính toán Q1", period: "Q1 2026", date: "10/04/2026", status: "Sẵn sàng" },
  ],
  previewSections: [
    "Tóm tắt tổng lượng CO₂e",
    "Phân tích phát thải theo nguồn",
    "Phân rã theo Phạm vi 1, 2 & 3",
    "Các chỉ số cường độ năng lượng",
    "Tác động từ chất thải & nước",
    "So sánh với định mức ngành",
  ],
} as const;

export const COMPANY_COPY = {
  breadcrumbs: [
    { label: "Thông tin chung", active: true },
    { label: "Bối cảnh vận hành" },
    { label: "Cơ sở vận hành" },
  ],
  generalInfo: {
    title: "Thông tin chung",
    syncBadge: "Đồng bộ lần cuối: 2 giờ trước",
    fields: [
      { label: "Tên công ty", value: "Northstar Foods" },
      { label: "Mã số thuế (TIN)", value: "0123456789" },
      { label: "Địa chỉ email chính thức", value: "contact@northstarfoods.com" },
      { label: "Số điện thoại", value: "+84 28 1234 5678" },
      { label: "Địa chỉ trụ sở chính", value: "Quận 1, TP. Hồ Chí Minh" },
    ],
  },
  operational: {
    title: "Bối cảnh vận hành",
    fields: [
      { label: "Ngành kinh doanh chính", value: "Vận tải & Logistics" },
      { label: "Số lượng nhân viên (FTE)", value: "145" },
      { label: "Các khung báo cáo phát triển bền vững", value: "GHG Protocol, CSRD" },
    ],
  },
  facilities: {
    title: "Cơ sở & Chi nhánh",
    columns: ["Tên cơ sở", "Loại hình", "Địa điểm", "Mức độ ảnh hưởng carbon"],
    rows: [
      { name: "Trụ sở Quận 1", type: "Văn phòng", location: "TP. Hồ Chí Minh", impact: "Cao" },
      { name: "Kho Bình Dương", type: "Kho hàng", location: "Bình Dương", impact: "Thấp" },
    ],
  },
  integrity: {
    title: "Độ hoàn thiện hồ sơ",
    status: "Hoàn thành",
    checks: [
      { title: "Thông tin doanh nghiệp đã xác thực", note: "Mã số thuế đã được xác minh thành công." },
      { title: "Hồ sơ cơ sở chưa hoàn thiện", note: "Thiếu mã định danh công tơ điện tại 2 địa điểm." },
    ],
  },
} as const;

export const SETTINGS_COPY = {
  breadcrumbs: [{ label: "Quản lý không gian làm việc", active: true }],
  title: "Không gian làm việc & Cài đặt",
  description:
    "Quản lý hồ sơ cá nhân, cộng tác với các thành viên trong nhóm và cấu hình các tùy chọn cảnh báo trên nền tảng.",
  tabs: ["Tài khoản", "Thành viên nhóm", "Thông báo"],
  profileFields: [
    { label: "Họ và tên", value: "Alex Morgan" },
    { label: "Email công việc", value: "alex@company.com" },
    { label: "Chức vụ", value: "Trưởng phòng ESG" },
  ],
  workspaceProgress: "Đội ngũ của bạn đã hoàn thành 84% báo cáo GHG của quý này.",
  supportPlan: "Gói hỗ trợ Doanh nghiệp Cao cấp đang hoạt động",
  saveCta: "Lưu cài đặt",
} as const;
