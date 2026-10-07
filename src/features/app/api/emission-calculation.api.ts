import { apiClient } from "@/shared/lib/api-client";
import type { EmissionResult } from "@/features/app/types/app.types";
export const getEmissionResult = (id: string) => apiClient.get<EmissionResult>(`/emission-calculation/activity/${id}`);
export const recalculateEmission = (id: string) => apiClient.post<EmissionResult>(`/emission-calculation/recalculate/${id}`);
