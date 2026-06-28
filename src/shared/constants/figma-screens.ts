import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Building2,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Leaf,
  Lightbulb,
  Settings,
  Upload,
} from "lucide-react";
import { ROUTES } from "@/shared/constants/routes";

export type FigmaScreen = {
  id: string;
  title: string;
  description: string;
  figmaNodeId: string;
  path: string;
  showInNav?: boolean;
  navIcon?: LucideIcon;
  nextPath?: string;
  nextLabel?: string;
};

export const FIGMA_FILE_KEY = "BzmfxP0dmTwmf72pb7U7Mv";

export function figmaFrameUrl(nodeId: string) {
  return `https://www.figma.com/design/${FIGMA_FILE_KEY}/ecometrix?node-id=${nodeId.replace(":", "-")}`;
}

export const APP_SCREENS: FigmaScreen[] = [
  {
    id: "dashboard",
    title: "Bảng điều khiển",
    description:
      "Theo dõi lượng phát thải hàng tháng, hiệu quả hoạt động ESG và các cơ hội giảm carbon trong toàn doanh nghiệp với các chỉ số chính xác cao.",
    figmaNodeId: "76:751",
    path: ROUTES.app.dashboard,
    showInNav: true,
    navIcon: LayoutDashboard,
    nextPath: ROUTES.app.recommendations,
    nextLabel: "Xem khuyến nghị",
  },
  {
    id: "data-input",
    title: "Nhập liệu",
    description: "Thu thập dữ liệu hoạt động theo phạm vi và nguồn.",
    figmaNodeId: "74:7738",
    path: ROUTES.app.dataInput,
    showInNav: true,
    navIcon: ClipboardList,
    nextPath: ROUTES.app.dataInputStep1,
    nextLabel: "Bắt đầu luồng nhập liệu",
  },
  {
    id: "input-1",
    title: "Nhập liệu — Bước 1",
    description: "Chọn kỳ báo cáo và ranh giới tổ chức.",
    figmaNodeId: "74:8225",
    path: ROUTES.app.dataInputStep1,
    nextPath: ROUTES.app.dataInputStep2,
    nextLabel: "Tiếp tục bước 2",
  },
  {
    id: "input-2",
    title: "Nhập liệu — Bước 2",
    description: "Nhập dữ liệu hoạt động Phạm vi 1 và Phạm vi 2.",
    figmaNodeId: "74:8403",
    path: ROUTES.app.dataInputStep2,
    nextPath: ROUTES.app.dataInputStep3,
    nextLabel: "Tiếp tục bước 3",
  },
  {
    id: "input-3",
    title: "Nhập liệu — Bước 3",
    description: "Thêm Phạm vi 3 và dữ liệu chuỗi cung ứng.",
    figmaNodeId: "74:8602",
    path: ROUTES.app.dataInputStep3,
    nextPath: ROUTES.app.uploadDoc,
    nextLabel: "Tải tài liệu đính kèm",
  },
  {
    id: "upload-doc",
    title: "Tải tài liệu",
    description: "Tải hóa đơn, hóa đơn tiện ích và hồ sơ đi lại.",
    figmaNodeId: "71:6378",
    path: ROUTES.app.uploadDoc,
    showInNav: false,
    navIcon: Upload,
    nextPath: ROUTES.app.aiReview,
    nextLabel: "Xem lại trích xuất AI",
  },
  {
    id: "ai-review",
    title: "Xem lại trích xuất AI",
    description: "Xác thực các trường đã trích xuất trước khi tính toán.",
    figmaNodeId: "76:19",
    path: ROUTES.app.aiReview,
    nextPath: ROUTES.app.emissionDetail,
    nextLabel: "Xem chi tiết tính toán phát thải",
  },
  {
    id: "emission-detail",
    title: "Tính toán phát thải",
    description: "Phân tích sẵn sàng kiểm toán theo phạm vi và danh mục.",
    figmaNodeId: "73:6909",
    path: ROUTES.app.emissionDetail,
    showInNav: true,
    navIcon: BarChart3,
    nextPath: ROUTES.app.ecoScore,
    nextLabel: "Mở điểm số Eco",
  },
  {
    id: "eco-score",
    title: "Điểm số Eco",
    description: "Điểm bền vững tổng hợp và các yếu tố ảnh hưởng.",
    figmaNodeId: "73:7187",
    path: ROUTES.app.ecoScore,
    showInNav: true,
    navIcon: Leaf,
    nextPath: ROUTES.app.recommendations,
    nextLabel: "Xem khuyến nghị",
  },
  {
    id: "recommendations",
    title: "Khuyến nghị",
    description: "Hành động giảm phát thải được ưu tiên cho dấu chân của bạn.",
    figmaNodeId: "72:6661",
    path: ROUTES.app.recommendations,
    showInNav: true,
    navIcon: Lightbulb,
    nextPath: ROUTES.app.reports,
    nextLabel: "Mở báo cáo",
  },
  {
    id: "reports",
    title: "Báo cáo",
    description: "Tạo báo cáo CSRD, TCFD và xuất cho các bên liên quan.",
    figmaNodeId: "76:1142",
    path: ROUTES.app.reports,
    showInNav: true,
    navIcon: FileText,
  },
  {
    id: "company",
    title: "Hồ sơ doanh nghiệp",
    description: "Cài đặt tổ chức, cơ sở và ranh giới báo cáo.",
    figmaNodeId: "78:1479",
    path: ROUTES.app.company,
    showInNav: true,
    navIcon: Building2,
  },
  {
    id: "settings",
    title: "Cài đặt",
    description: "Tùy chọn không gian làm việc, người dùng và tích hợp.",
    figmaNodeId: "78:1820",
    path: ROUTES.app.settings,
    showInNav: true,
    navIcon: Settings,
  },
];

export const APP_NAV_ORDER = [
  "dashboard",
  "company",
  "data-input",
  "emission-detail",
  "eco-score",
  "recommendations",
  "reports",
  "settings",
] as const;

export const APP_NAV_ITEMS = APP_NAV_ORDER.map((id) => {
  const screen = APP_SCREENS.find((item) => item.id === id);
  if (!screen?.navIcon) {
    throw new Error(`Missing nav screen: ${id}`);
  }
  return screen;
});

export function getScreenByPath(path: string) {
  return APP_SCREENS.find((screen) => screen.path === path);
}

export const SCREEN_PLACEHOLDER_COPY = {
  scaffoldTitle: "Khung màn hình",
  scaffoldDescription:
    "Giao diện đang được triển khai. Điều hướng và luồng làm việc đã sẵn sàng — dùng các nút bên dưới để tiếp tục.",
  openFigma: "Mở frame Figma",
} as const;
