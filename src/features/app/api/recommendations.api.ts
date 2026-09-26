import { apiClient } from "@/shared/lib/api-client";
import type {
  PaginatedResponse,
  Recommendation,
  RecommendationStatus,
} from "@/features/app/types/app.types";

export function listRecommendations(businessId: string): Promise<PaginatedResponse<Recommendation>> {
  return apiClient.get<PaginatedResponse<Recommendation>>(`/recommendations?businessId=${businessId}`);
}

export function generateRecommendations(businessId: string): Promise<Recommendation[]> {
  return apiClient.post<Recommendation[]>("/recommendations/generate", { businessId });
}

export function updateRecommendationStatus(
  id: string,
  status: RecommendationStatus,
): Promise<Recommendation> {
  return apiClient.patch<Recommendation>(`/recommendations/${id}/status`, { status });
}
