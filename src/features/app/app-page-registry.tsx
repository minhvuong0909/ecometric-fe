import type { ComponentType } from "react";
import type { AppRouteScreenId } from "@/features/app/app-route-config";
import { AiReviewPage } from "@/features/app/pages/ai-review-page";
import { CompanyPage } from "@/features/app/pages/company-page";
import { DashboardPage } from "@/features/app/pages/dashboard-page";
import { DataInputPage } from "@/features/app/pages/data-input-page";
import {
  DataInputStep1Page,
  DataInputStep2Page,
  DataInputStep3Page,
} from "@/features/app/pages/data-input-steps-page";
import { EcoScorePage } from "@/features/app/pages/eco-score-page";
import { EmissionDetailPage } from "@/features/app/pages/emission-detail-page";
import { RecommendationsPage } from "@/features/app/pages/recommendations-page";
import { ReportsPage } from "@/features/app/pages/reports-page";
import { SettingsPage } from "@/features/app/pages/settings-page";
import { UploadDocPage } from "@/features/app/pages/upload-doc-page";

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
