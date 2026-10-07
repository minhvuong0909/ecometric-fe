import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBranch,
  deleteBranch,
  listBranches,
  listEmissionSources,
  listReportingPeriods,
} from "@/features/app/api/meta.api";
import type { CreateBranchInput } from "@/features/app/types/app.types";

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

export function useCreateBranch(businessId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateBranchInput) => {
      if (!businessId) throw new Error("Thiếu businessId");
      return createBranch(businessId, input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: META_QUERY_KEYS.branches(businessId) });
    },
  });
}

export function useDeleteBranch(businessId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (branchId: string) => {
      if (!businessId) throw new Error("Thiếu businessId");
      return deleteBranch(businessId, branchId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: META_QUERY_KEYS.branches(businessId) });
    },
  });
}

export function useReportingPeriods(businessId?: string | null, enabled = true) {
  return useQuery({
    queryKey: META_QUERY_KEYS.periods(businessId),
    queryFn: () => (businessId ? listReportingPeriods(businessId) : Promise.resolve({ items: [], total: 0, page: 1, limit: 50, totalPages: 0 })),
    enabled: enabled && !!businessId,
  });
}

export function useEmissionSources(enabled = true, businessId?: string) {
  return useQuery({
    queryKey: [...META_QUERY_KEYS.emissionSources, businessId],
    queryFn: () => listEmissionSources(businessId),
    enabled,
    staleTime: 1000 * 60 * 30, // 30 mins
  });
}
