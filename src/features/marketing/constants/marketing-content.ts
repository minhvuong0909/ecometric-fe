import { ROUTES } from "@/shared/constants/routes";

export const NAV_LINKS = [
  { label: "Trang chủ", href: "#top", id: "home" },
  { label: "Tính năng", href: "#features", id: "features" },
  { label: "Bảng giá", href: "#pricing", id: "pricing" },
  { label: "Liên hệ", href: "#contact", id: "contact" },
] as const;

export const HERO_COPY = {
  badge: "Mới ra mắt: Phân hệ Quản lý Chuỗi giá trị Phạm vi 3",
  titleLead: "Tự động hóa Kiểm kê Carbon.",
  titleHighlight: "Bứt tốc Đạt chuẩn ESG.",
  description:
    "Dễ dàng theo dõi và báo cáo toàn diện phát thải Phạm vi 1, 2 và 3 với nền tảng phân tích dữ liệu siêu chính xác. Giải pháp chuyên biệt nâng tầm vị thế cho các đội ngũ phát triển bền vững hiện đại.",
  ctaPrimary: "Dùng thử miễn phí",
  ctaSecondary: "Xem video giới thiệu",
} as const;

export const FEATURES_SECTION = {
  title: "Hệ thống ESG Chuẩn Doanh nghiệp",
  description:
    "Được thiết kế chuyên biệt cho độ chính xác cao và khả năng mở rộng linh hoạt, nền tảng của chúng tôi giúp đơn giản hóa các quy trình kiểm kê carbon toàn cầu phức tạp dựa trên các phương pháp luận đã được kiểm chứng.",
  learnMore: "Tìm hiểu thêm",
} as const;

export const FEATURES = [
  {
    title: "Tích hợp Dữ liệu Đầu vào",
    description:
      "Kết nối mượt mà hệ thống ERP, API dịch vụ tiện ích và các bảng tính để tự động thu thập dữ liệu hoạt động với độ chính xác cao và nhất quán.",
    icon: "database" as const,
  },
  {
    title: "Tự động hóa Phạm vi 1-2-3",
    description:
      "Áp dụng các hệ số phát thải toàn cầu đã được xác thực để tính toán tổng dấu chân carbon; đảm bảo tính minh bạch sẵn sàng cho kiểm toán và chuẩn hóa theo tiêu chuẩn GHG Protocol.",
    icon: "layers" as const,
  },
  {
    title: "Bảng điều khiển Tương tác",
    description:
      "Trực quan hóa các \"điểm nóng\" phát thải, theo dõi mục tiêu giảm thiểu và lập tức xuất các báo cáo chuẩn chuyên nghiệp cho các bên liên quan theo tiêu chuẩn TCFD, CSRD, và hơn thế nữa.",
    icon: "bar-chart" as const,
  },
] as const;

export const PRICING_SECTION = {
  title: "Bảng giá Minh bạch",
  description:
    "Lựa chọn gói dịch vụ phù hợp để tăng tốc hành trình tiến tới Net-Zero của doanh nghiệp bạn.",
  monthly: "Theo tháng",
  annually: "Theo năm (-20%)",
  perMonth: "/tháng",
  billingInterval: "Chu kỳ thanh toán",
} as const;

export type PricingInterval = "monthly" | "annually";

export const PRICING_TIERS = [
  {
    id: "starter",
    name: "Starter (Gói Khởi đầu)",
    description: "Dành cho các đội ngũ mới bắt đầu hành trình ESG.",
    monthlyPrice: 49,
    features: [
      "Theo dõi Phạm vi 1 & 2",
      "Báo cáo ESG cơ bản",
      "Hỗ trợ 3 tài khoản người dùng",
    ],
    cta: "Dùng thử miễn phí",
    highlighted: false,
  },
  {
    id: "professional",
    name: "Professional (Gói Chuyên nghiệp)",
    description:
      "Công cụ toàn diện cho các đội ngũ phát triển bền vững đang trên đà tăng trưởng.",
    monthlyPrice: 199,
    features: [
      "Toàn diện Phạm vi 1, 2 & Core 3",
      "Tích hợp API & ERP",
      "Xuất dữ liệu sẵn sàng kiểm toán",
      "Hỗ trợ 10 tài khoản người dùng",
    ],
    cta: "Dùng thử miễn phí",
    highlighted: true,
    badge: "PHỔ BIẾN NHẤT",
  },
  {
    id: "enterprise",
    name: "Enterprise (Gói Doanh nghiệp)",
    description: "Giải pháp tùy chỉnh cho các hoạt động toàn cầu phức tạp.",
    priceLabel: "Tùy biến",
    features: [
      "Toàn bộ Chuỗi giá trị (Phạm vi 3)",
      "Tùy chỉnh hệ số phát thải",
      "Quản lý chuyên trách hỗ trợ đối tác",
      "Không giới hạn tài khoản người dùng",
    ],
    cta: "Liên hệ tư vấn",
    highlighted: false,
  },
] as const;

export const CTA_SECTION = {
  title: "Bạn đã sẵn sàng dẫn dắt xu hướng chuyển dịch chưa?",
  description:
    "Hãy tham gia cùng các đội ngũ phát triển bền vững đang sử dụng EcoMetric để thúc đẩy hành động vì khí hậu và minh bạch hóa báo cáo.",
  primary: "Dùng thử miễn phí",
  secondary: "Liên hệ tư vấn",
} as const;

export const FOOTER_COPY = {
  tagline:
    "Đồng hành cùng các tổ chức toàn cầu trong việc theo dõi, giảm thiểu và báo cáo dấu chân carbon với độ chính xác khoa học và tính minh bạch tuyệt đối.",
  copyright: "© {year} EcoMetric GHG Accounting. Bảo lưu mọi quyền.",
  highlightLinkId: "sustainability-report",
} as const;

export const FOOTER_COLUMNS = [
  {
    title: "Nền tảng",
    links: [
      { label: "Tính năng", href: "#features", id: "features" },
      { label: "Tích hợp", href: ROUTES.app.settings, id: "integrations" },
      { label: "Bảng giá", href: "#pricing", id: "pricing" },
      { label: "Doanh nghiệp", href: ROUTES.register, id: "enterprise" },
    ],
  },
  {
    title: "Tài nguyên",
    links: [
      { label: "Phương pháp luận GHG", href: ROUTES.app.reports, id: "ghg" },
      { label: "Blog ESG", href: ROUTES.home, id: "blog" },
      { label: "Trung tâm trợ giúp", href: "#contact", id: "help" },
      { label: "Tài liệu API", href: ROUTES.app.settings, id: "api-docs" },
    ],
  },
  {
    title: "Pháp lý & Bảo mật",
    links: [
      { label: "Chính sách bảo mật", href: "#privacy", id: "privacy" },
      { label: "Điều khoản dịch vụ", href: "#terms", id: "terms" },
      { label: "Chính sách Cookie", href: "#cookies", id: "cookies" },
      { label: "Chứng nhận bảo mật", href: ROUTES.app.settings, id: "security" },
      {
        label: "Báo cáo phát triển bền vững",
        href: ROUTES.app.reports,
        id: "sustainability-report",
      },
    ],
  },
] as const;

export const HEADER_COPY = {
  login: "Đăng nhập",
  startTrial: "Dùng thử miễn phí",
  openMenu: "Mở menu",
  closeMenu: "Đóng menu",
} as const;
