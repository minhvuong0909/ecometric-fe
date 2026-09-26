import { useQuery } from "@tanstack/react-query";
import {
  getDashboardByBranch,
  getDashboardByScope,
  getDashboardSummary,
  getDashboardTopSources,
  getDashboardTrend,
} from "@/features/app/api/dashboard.api";
import type { DashboardQueryParams } from "@/features/app/types/app.types";

export const DASHBOARD_QUERY_KEYS = {
  all: ["dashboard"] as const,
  summary: (params: DashboardQueryParams) => ["dashboard", "summary", params] as const,
  byBranch: (params: DashboardQueryParams) => ["dashboard", "byBranch", params] as const,
  byScope: (params: DashboardQueryParams) => ["dashboard", "byScope", params] as const,
  topSources: (params: DashboardQueryParams & { limit?: number }) => ["dashboard", "topSources", params] as const,
  trend: (params: DashboardQueryParams & { groupBy?: string }) => ["dashboard", "trend", params] as const,
};

export function useDashboardSummary(params: DashboardQueryParams, enabled = true) {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.summary(params),
    queryFn: () => getDashboardSummary(params),
    enabled: enabled && !!params.businessId,
  });
}

export function useDashboardByScope(params: DashboardQueryParams, enabled = true) {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.byScope(params),
    queryFn: () => getDashboardByScope(params),
    enabled: enabled && !!params.businessId,
  });
}

export function useDashboardByBranch(params: DashboardQueryParams, enabled = true) {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.byBranch(params),
    queryFn: () => getDashboardByBranch(params),
    enabled: enabled && !!params.businessId,
  });
}

export function useDashboardTopSources(
  params: DashboardQueryParams & { limit?: number },
  enabled = true,
) {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.topSources(params),
    queryFn: () => getDashboardTopSources(params),
    enabled: enabled && !!params.businessId,
  });
}

export function useDashboardTrend(
  params: DashboardQueryParams & { groupBy?: "month" | "day" },
  enabled = true,
) {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.trend(params),
    queryFn: () => getDashboardTrend(params),
    enabled: enabled && !!params.businessId,
  });
}
