import { apiClient } from "@/shared/lib/api-client";
import type {
  CalculateEcoScoreInput,
  EcoScore,
  PaginatedResponse,
} from "@/features/app/types/app.types";

export function listEcoScores(businessId: string): Promise<PaginatedResponse<EcoScore>> {
  return apiClient.get<PaginatedResponse<EcoScore>>(`/eco-score?businessId=${businessId}`);
}

export function getEcoScoreById(id: string): Promise<EcoScore> {
  return apiClient.get<EcoScore>(`/eco-score/${id}`);
}

export function calculateEcoScore(body: CalculateEcoScoreInput): Promise<EcoScore> {
  return apiClient.post<EcoScore>("/eco-score/calculate", body);
}
