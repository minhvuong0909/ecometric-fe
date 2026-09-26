import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  generateRecommendations,
  listRecommendations,
  updateRecommendationStatus,
} from "@/features/app/api/recommendations.api";
import type { RecommendationStatus } from "@/features/app/types/app.types";

export const RECOMMENDATION_QUERY_KEYS = {
  all: ["recommendations"] as const,
  list: (businessId?: string | null) => ["recommendations", "list", businessId] as const,
};

export function useRecommendations(businessId?: string | null, enabled = true) {
  return useQuery({
    queryKey: RECOMMENDATION_QUERY_KEYS.list(businessId),
    queryFn: () => (businessId ? listRecommendations(businessId) : Promise.resolve({ items: [], total: 0, page: 1, limit: 20, totalPages: 0 })),
    enabled: enabled && !!businessId,
  });
}

export function useGenerateRecommendations() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (businessId: string) => generateRecommendations(businessId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECOMMENDATION_QUERY_KEYS.all });
    },
  });
}

export function useUpdateRecommendationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: RecommendationStatus }) =>
      updateRecommendationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECOMMENDATION_QUERY_KEYS.all });
    },
  });
}
