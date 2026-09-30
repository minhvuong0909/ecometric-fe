import { apiClient } from "@/shared/lib/api-client";
import type {
  Branch,
  CreateBranchInput,
  EmissionSource,
  PaginatedResponse,
  ReportingPeriod,
} from "@/features/app/types/app.types";

export function listBranches(businessId: string): Promise<PaginatedResponse<Branch>> {
  return apiClient.get<PaginatedResponse<Branch>>(`/businesses/${businessId}/branches?limit=100`);
}

export function createBranch(businessId: string, body: CreateBranchInput): Promise<Branch> {
  return apiClient.post<Branch>(`/businesses/${businessId}/branches`, body);
}

export function deleteBranch(businessId: string, branchId: string): Promise<{ success: true }> {
  return apiClient.delete<{ success: true }>(`/businesses/${businessId}/branches/${branchId}`);
}

export function listReportingPeriods(businessId: string): Promise<PaginatedResponse<ReportingPeriod>> {
  return apiClient.get<PaginatedResponse<ReportingPeriod>>(`/reporting-periods?businessId=${businessId}&limit=50`);
}

export function createReportingPeriod(body: {
  businessId: string;
  name: string;
  startDate: string;
  endDate: string;
}): Promise<ReportingPeriod> {
  return apiClient.post<ReportingPeriod>("/reporting-periods", body);
}

export function listEmissionSources(): Promise<PaginatedResponse<EmissionSource>> {
  return apiClient.get<PaginatedResponse<EmissionSource>>("/emission-sources?limit=100");
}

