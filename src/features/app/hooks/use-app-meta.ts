import { useQuery } from "@tanstack/react-query";
import {
  listBranches,
  listEmissionSources,
  listReportingPeriods,
} from "@/features/app/api/meta.api";

export const META_QUERY_KEYS = {
  branches: (businessId?: string | null) => ["meta", "branches", businessId] as const,
  periods: (businessId?: string | null) => ["meta", "periods", businessId] as const,
  emissionSources: ["meta", "emission-sources"] as const,
};

export function useBranches(businessId?: string | null, enabled = true) {
  return useQuery({
    queryKey: META_QUERY_KEYS.branches(businessId),
    queryFn: () => (businessId ? listBranches(businessId) : Promise.resolve({ items: [], total: 0, page: 1, limit: 100, totalPages: 0 })),
    enabled: enabled && !!businessId,
  });
}

export function useReportingPeriods(businessId?: string | null, enabled = true) {
  return useQuery({
    queryKey: META_QUERY_KEYS.periods(businessId),
    queryFn: () => (businessId ? listReportingPeriods(businessId) : Promise.resolve({ items: [], total: 0, page: 1, limit: 50, totalPages: 0 })),
    enabled: enabled && !!businessId,
  });
}

export function useEmissionSources(enabled = true) {
  return useQuery({
    queryKey: META_QUERY_KEYS.emissionSources,
    queryFn: () => listEmissionSources(),
    enabled,
    staleTime: 1000 * 60 * 30, // 30 mins
  });
}
