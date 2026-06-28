export const AUTH_COPY = {
  secureBadge: "Đăng nhập không gian làm việc bảo mật",
  login: {
    title: "Chào mừng bạn quay trở lại",
    description:
      "Đăng nhập để kiểm tra sổ cái carbon, điểm số Eco và tiến độ báo cáo ESG của bạn.",
    emailLabel: "Email",
    emailPlaceholder: "you@company.com",
    passwordLabel: "Mật khẩu",
    passwordPlaceholder: "Nhập mật khẩu",
    rememberMe: "Ghi nhớ đăng nhập",
    forgotPassword: "Quên mật khẩu?",
    submit: "Đăng nhập",
    submitting: "Đang đăng nhập…",
    noAccount: "Bạn chưa có tài khoản?",
    signUp: "Đăng ký",
    showPassword: "Hiện mật khẩu",
    hidePassword: "Ẩn mật khẩu",
  },
  register: {
    secureBadge: "Thiết lập an toàn",
    title: "Tạo tài khoản của bạn",
    description:
      "Xây dựng không gian làm việc cho doanh nghiệp của bạn và bắt đầu đo lường hiệu quả hoạt động ESG ngay hôm nay.",
    cardTitle: "Bắt đầu nhanh (mock)",
    cardDescription:
      "Chưa có API. Tiếp tục vào không gian làm việc để xem luồng end-to-end.",
    continueDashboard: "Tiếp tục tới Bảng điều khiển",
    hasAccount: "Bạn đã có tài khoản?",
    signIn: "Đăng nhập",
    submit: "Tạo tài khoản",
  },
  forgotPassword: {
    title: "Đặt lại mật khẩu",
    description:
      "Nhập email công việc để nhận liên kết đặt lại mật khẩu.",
    cardTitle: "Gửi email đặt lại (đang chờ)",
    cardDescription:
      "Tích hợp API sẽ có sau. Dùng đăng nhập để truy cập không gian làm việc demo.",
    backToLogin: "Quay lại đăng nhập",
  },
  marketingPanel: {
    eyebrow: "EcoMetric Platform",
    title: "Theo dõi phát thải và tiến độ ESG trên cùng một nền tảng.",
  },
  registerMarketingPanel: {
    eyebrow: "Xác thực — Đăng ký",
    title: "Khởi đầu hành trình ESG chỉ trong vài phút",
    description:
      "Biến dữ liệu vận hành rời rạc thành thông tin carbon minh bạch, các báo cáo chuẩn chuyên nghiệp cho các bên liên quan, và một lộ trình cải thiện có thể đo lường được.",
    steps: [
      { label: "Bước 1", title: "Tải lên dữ liệu môi trường" },
      { label: "Bước 2", title: "Tự động tính toán lượng CO₂" },
      { label: "Bước 3", title: "Theo dõi điểm số Eco" },
      { label: "Bước 4", title: "Xuất báo cáo ESG" },
    ],
    progressLabel: "Tiến độ thiết lập",
    progressDuration: "08 phút",
  },
  dashboardPreview: {
    workspaceLabel: "Không gian làm việc",
    title: "Tổng quan ESG",
    synced: "Đã đồng bộ",
    totalCo2e: "Tổng lượng CO₂E",
    totalCo2eTrend: "12,4% so với quý trước",
    ecoScore: "Điểm số Eco",
    monthlyTrend: "Xu hướng theo tháng",
    monthlyTrendDetail: "Cường độ phát thải đang được cải thiện",
    chartAriaLabel: "Biểu đồ cột thể hiện xu hướng phát thải theo tháng đang cải thiện",
  },
  footer: {
    copyright: "© {year} EcoMetric Platform.",
    privacy: "Bảo mật",
    terms: "Điều khoản",
    support: "Hỗ trợ",
  },
  validation: {
    emailRequired: "Vui lòng nhập email",
    emailInvalid: "Email không hợp lệ",
    passwordRequired: "Vui lòng nhập mật khẩu",
    passwordMin: "Mật khẩu phải có ít nhất 8 ký tự",
  },
  api: {
    invalidCredentials: "Email hoặc mật khẩu không đúng. Vui lòng thử lại.",
    welcomeBack: (email: string) =>
      `Chào mừng bạn quay trở lại! Đã đăng nhập với ${email}`,
  },
} as const;
