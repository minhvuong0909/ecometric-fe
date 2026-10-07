import { apiClient } from "@/shared/lib/api-client";
import type {
  PaginatedResponse,
  Recommendation,
  RecommendationStatus,
  GenerateRecommendationsInput,
} from "@/features/app/types/app.types";

export function listRecommendations(businessId: string): Promise<PaginatedResponse<Recommendation>> {
  return apiClient.get<PaginatedResponse<Recommendation>>(`/recommendations?businessId=${businessId}`);
}

export function generateRecommendations(body: GenerateRecommendationsInput): Promise<Recommendation[]> {
  return apiClient.post<Recommendation[]>("/recommendations/generate", body);
}

export function updateRecommendationStatus(
  id: string,
  status: RecommendationStatus,
): Promise<Recommendation> {
  return apiClient.patch<Recommendation>(`/recommendations/${id}/status`, { status });
}
