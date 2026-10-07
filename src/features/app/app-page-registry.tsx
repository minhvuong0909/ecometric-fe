import { lazy, type ComponentType } from "react";
import type { AppRouteScreenId } from "@/features/app/app-route-config";
const AiReviewPage = lazy(() =>
  import("@/features/app/pages/ai-review-page").then((module) => ({
    default: module.AiReviewPage,
  })),
);
const CompanyPage = lazy(() =>
  import("@/features/app/pages/company-page").then((module) => ({
    default: module.CompanyPage,
  })),
);
const DashboardPage = lazy(() =>
  import("@/features/app/pages/dashboard-page").then((module) => ({
    default: module.DashboardPage,
  })),
);
const DataInputPage = lazy(() =>
  import("@/features/app/pages/data-input-page").then((module) => ({
    default: module.DataInputPage,
  })),
);
const DataInputStep1Page = lazy(() =>
  import("@/features/app/pages/data-input-steps-page").then((module) => ({
    default: module.DataInputStep1Page,
  })),
);
const DataInputStep2Page = lazy(() =>
  import("@/features/app/pages/data-input-steps-page").then((module) => ({
    default: module.DataInputStep2Page,
  })),
);
const DataInputStep3Page = lazy(() =>
  import("@/features/app/pages/data-input-steps-page").then((module) => ({
    default: module.DataInputStep3Page,
  })),
);
const EcoScorePage = lazy(() =>
  import("@/features/app/pages/eco-score-page").then((module) => ({
    default: module.EcoScorePage,
  })),
);
const EmissionDetailPage = lazy(() =>
  import("@/features/app/pages/emission-detail-page").then((module) => ({
    default: module.EmissionDetailPage,
  })),
);
const RecommendationsPage = lazy(() =>
  import("@/features/app/pages/recommendations-page").then((module) => ({
    default: module.RecommendationsPage,
  })),
);
const ReportsPage = lazy(() =>
  import("@/features/app/pages/reports-page").then((module) => ({
    default: module.ReportsPage,
  })),
);
const SettingsPage = lazy(() =>
  import("@/features/app/pages/settings-page").then((module) => ({
    default: module.SettingsPage,
  })),
);
const UploadDocPage = lazy(() =>
  import("@/features/app/pages/upload-doc-page").then((module) => ({
    default: module.UploadDocPage,
  })),
);

export const APP_PAGE_REGISTRY: Record<AppRouteScreenId, ComponentType> = {
  dashboard: DashboardPage,
  "data-input": DataInputPage,
  "input-1": DataInputStep1Page,
  "input-2": DataInputStep2Page,
  "input-3": DataInputStep3Page,
  "upload-doc": UploadDocPage,
  "ai-review": AiReviewPage,
  "emission-detail": EmissionDetailPage,
  "eco-score": EcoScorePage,
  recommendations: RecommendationsPage,
  reports: ReportsPage,
  company: CompanyPage,
  settings: SettingsPage,
};
