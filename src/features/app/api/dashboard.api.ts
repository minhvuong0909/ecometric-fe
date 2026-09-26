import { apiClient } from "@/shared/lib/api-client";
import type {
  DashboardBranchItem,
  DashboardQueryParams,
  DashboardScopeItem,
  DashboardSourceItem,
  DashboardSummary,
  DashboardTrendItem,
} from "@/features/app/types/app.types";

function buildQueryString(params: DashboardQueryParams & { groupBy?: string; limit?: number }): string {
  const search = new URLSearchParams();
  if (params.businessId) search.set("businessId", params.businessId);
  if (params.reportingPeriodId) search.set("reportingPeriodId", params.reportingPeriodId);
  if (params.branchId) search.set("branchId", params.branchId);
  if (params.emissionSourceId) search.set("emissionSourceId", params.emissionSourceId);
  if (params.scope) search.set("scope", params.scope);
  if (params.periodStart) search.set("periodStart", params.periodStart);
  if (params.periodEnd) search.set("periodEnd", params.periodEnd);
  if (params.groupBy) search.set("groupBy", params.groupBy);
  if (params.limit) search.set("limit", String(params.limit));
  const query = search.toString();
  return query ? `?${query}` : "";
}

export function getDashboardSummary(params: DashboardQueryParams = {}): Promise<DashboardSummary> {
  return apiClient.get<DashboardSummary>(`/dashboard/summary${buildQueryString(params)}`);
}

export function getDashboardByBranch(params: DashboardQueryParams = {}): Promise<DashboardBranchItem[]> {
  return apiClient.get<DashboardBranchItem[]>(`/dashboard/by-branch${buildQueryString(params)}`);
}

export function getDashboardByScope(params: DashboardQueryParams = {}): Promise<DashboardScopeItem[]> {
  return apiClient.get<DashboardScopeItem[]>(`/dashboard/by-scope${buildQueryString(params)}`);
}

export function getDashboardTopSources(
  params: DashboardQueryParams & { limit?: number } = {},
): Promise<DashboardSourceItem[]> {
  return apiClient.get<DashboardSourceItem[]>(`/dashboard/top-sources${buildQueryString(params)}`);
}

export function getDashboardTrend(
  params: DashboardQueryParams & { groupBy?: "month" | "day" } = {},
): Promise<DashboardTrendItem[]> {
  return apiClient.get<DashboardTrendItem[]>(`/dashboard/trend${buildQueryString(params)}`);
}
