// ==========================================
// Dashboard Types
// ==========================================
export type EmissionScope = "SCOPE_1" | "SCOPE_2" | "SCOPE_3";

export interface DashboardSummary {
  totalCo2eKg: string;
  resultCount: number;
  activityCount: number;
  branchCount: number;
  sourceCount: number;
  byScope: DashboardScopeItem[];
}

export interface DashboardScopeItem {
  scope: EmissionScope;
  totalCo2eKg: string;
  resultCount: number;
}

export interface DashboardBranchItem {
  branchId: string | null;
  branchName: string;
  branchCode: string | null;
  totalCo2eKg: string;
  resultCount: number;
}

export interface DashboardSourceItem {
  emissionSourceId: string | null;
  emissionSourceName: string;
  emissionSourceCode: string | null;
  totalCo2eKg: string;
  resultCount: number;
}

export interface DashboardTrendItem {
  period: string;
  totalCo2eKg: string;
  resultCount: number;
}

export interface DashboardQueryParams {
  businessId?: string;
  reportingPeriodId?: string;
  branchId?: string;
  emissionSourceId?: string;
  scope?: EmissionScope;
  periodStart?: string;
  periodEnd?: string;
}

// ==========================================
// Reporting Period Types
// ==========================================
export type ReportingPeriodStatus = "OPEN" | "CLOSED" | "LOCKED";

export interface ReportingPeriod {
  id: string;
  businessId: string;
  name: string;
  startDate: string;
  endDate: string;
  status: ReportingPeriodStatus;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// Branch Types
// ==========================================
export interface Branch {
  id: string;
  businessId: string;
  name: string;
  code?: string | null;
  address?: string | null;
  isHeadquarters: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// Emission Source Types
// ==========================================
export interface EmissionSource {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  defaultScope: EmissionScope;
  defaultUnit: string;
  categoryId?: string | null;
}

// ==========================================
// Activity Data Types
// ==========================================
export type ActivityStatus = "DRAFT" | "PENDING_REVIEW" | "CONFIRMED" | "REJECTED" | "ARCHIVED";
export type ActivityInputMethod = "MANUAL" | "AI_SCAN" | "API_IMPORT" | "BULK_IMPORT";

export interface ActivityRecord {
  id: string;
  businessId: string;
  reportingPeriodId: string | null;
  branchId: string | null;
  emissionSourceId: string | null;
  sourceDocumentId: string | null;
  inputMethod: string;
  quantity: string;
  unit: string;
  periodStart: string;
  periodEnd: string;
  status: ActivityStatus;
  metadata: unknown;
  submittedById: string | null;
  confirmedById: string | null;
  confirmedAt: string | null;
  rejectedById: string | null;
  rejectedAt: string | null;
  rejectReason: string | null;
  createdAt: string;
  updatedAt: string;
  branch?: { id: string; name: string; code: string | null } | null;
  emissionSource?: { id: string; code: string; name: string; defaultScope: string; defaultUnit: string } | null;
  sourceDocument?: { id: string; fileName: string; documentType: string; status: string } | null;
}

export interface CreateActivityDataInput {
  businessId: string;
  reportingPeriodId: string;
  branchId?: string;
  emissionSourceId?: string;
  quantity: number;
  unit: string;
  periodStart: string;
  periodEnd: string;
  inputMethod?: ActivityInputMethod;
  metadata?: Record<string, unknown>;
}

export interface ListActivityDataParams {
  businessId?: string;
  reportingPeriodId?: string;
  branchId?: string;
  emissionSourceId?: string;
  status?: ActivityStatus;
  page?: number;
  limit?: number;
}

// ==========================================
// AI Scan Types
// ==========================================
export type ScanJobStatus = "QUEUED" | "PROCESSING" | "NEED_REVIEW" | "CONFIRMED" | "REJECTED" | "FAILED";

export interface AiScanDocument {
  id: string;
  businessId: string;
  uploadedById: string | null;
  fileUrl: string;
  storageKey: string | null;
  fileName: string | null;
  mimeType: string | null;
  fileSize: number | null;
  checksum: string | null;
  documentType: string | null;
  status: ScanJobStatus;
  rawText: string | null;
  extractedData: Record<string, any> | null;
  confidenceScore: string | null;
  reviewNotes: string | null;
  reviewedById: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
  latestJob: {
    id: string;
    queueJobId: string | null;
    status: string;
    attempts: number;
    errorMessage: string | null;
    startedAt: string | null;
    finishedAt: string | null;
    createdAt: string;
  } | null;
}

export interface ConfirmInvoiceScanInput {
  reportingPeriodId: string;
  branchId?: string;
  emissionSourceId?: string;
  quantity: number;
  unit: string;
  periodStart: string;
  periodEnd: string;
  metadata?: Record<string, unknown>;
  reviewNotes?: string;
}

// ==========================================
// Eco Score Types
// ==========================================
export interface EcoScore {
  id: string;
  businessId: string;
  reportingPeriodId: string | null;
  branchId: string | null;
  emissionScore: number;
  trendScore: number;
  dataCompletenessScore: number;
  actionScore: number;
  score: number;
  level: string;
  totalCo2eKg: string | null;
  methodologyVersion: string;
  periodStart: string;
  periodEnd: string;
  createdAt: string;
  updatedAt: string;
  branch?: { id: string; name: string; code: string | null } | null;
}

export interface CalculateEcoScoreInput {
  businessId: string;
  reportingPeriodId: string;
  branchId?: string;
}

// ==========================================
// Recommendations Types
// ==========================================
export type RecommendationStatus = "OPEN" | "IN_PROGRESS" | "COMPLETED" | "DISMISSED";
export type RecommendationPriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export interface Recommendation {
  id: string;
  businessId: string;
  branchId: string | null;
  createdById: string | null;
  title: string;
  description: string;
  ruleCode: string | null;
  periodStart: string | null;
  periodEnd: string | null;
  sourceCategory: string | null;
  priority: RecommendationPriority;
  status: RecommendationStatus;
  impactEstimateKgCo2e: string | null;
  dueDate: string | null;
  completedAt: string | null;
  evidenceUrl: string | null;
  createdAt: string;
  updatedAt: string;
  branch?: { id: string; name: string; code: string | null } | null;
}

// ==========================================
// Reports Types
// ==========================================
export type ReportStatus = "DRAFT" | "GENERATING" | "COMPLETED" | "FAILED";
export type ReportType = "GHG_PROTOCOL" | "CSRD_ESRS_E1" | "ISO_14064" | "INTERNAL_SUMMARY";

export interface Report {
  id: string;
  businessId: string;
  reportingPeriodId: string | null;
  branchId: string | null;
  createdById: string | null;
  title: string;
  type: ReportType;
  periodStart: string;
  periodEnd: string;
  fileUrl: string | null;
  storageKey: string | null;
  status: ReportStatus;
  errorMessage: string | null;
  metadata: unknown;
  createdAt: string;
  updatedAt: string;
  business: { id: string; name: string; country: string };
  branch?: { id: string; name: string; code: string | null } | null;
}

export interface CreateReportInput {
  businessId: string;
  reportingPeriodId: string;
  branchId?: string;
  title: string;
  type: ReportType;
  periodStart?: string;
  periodEnd?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
