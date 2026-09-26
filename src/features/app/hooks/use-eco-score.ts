import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  calculateEcoScore,
  getEcoScoreById,
  listEcoScores,
} from "@/features/app/api/eco-score.api";
import type { CalculateEcoScoreInput } from "@/features/app/types/app.types";

export const ECO_SCORE_QUERY_KEYS = {
  all: ["eco-score"] as const,
  list: (businessId?: string | null) => ["eco-score", "list", businessId] as const,
  detail: (id: string) => ["eco-score", "detail", id] as const,
};

export function useEcoScores(businessId?: string | null, enabled = true) {
  return useQuery({
    queryKey: ECO_SCORE_QUERY_KEYS.list(businessId),
    queryFn: () => (businessId ? listEcoScores(businessId) : Promise.resolve({ items: [], total: 0, page: 1, limit: 20, totalPages: 0 })),
    enabled: enabled && !!businessId,
  });
}

export function useEcoScoreDetail(id: string, enabled = true) {
  return useQuery({
    queryKey: ECO_SCORE_QUERY_KEYS.detail(id),
    queryFn: () => getEcoScoreById(id),
    enabled: enabled && !!id,
  });
}

export function useCalculateEcoScore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CalculateEcoScoreInput) => calculateEcoScore(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ECO_SCORE_QUERY_KEYS.all });
    },
  });
}
