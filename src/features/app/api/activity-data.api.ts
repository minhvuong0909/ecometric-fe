import { apiClient } from "@/shared/lib/api-client";
import type {
  ActivityRecord,
  CreateActivityDataInput,
  ListActivityDataParams,
  PaginatedResponse,
} from "@/features/app/types/app.types";

function buildQueryString(params: ListActivityDataParams): string {
  const search = new URLSearchParams();
  if (params.businessId) search.set("businessId", params.businessId);
  if (params.reportingPeriodId) search.set("reportingPeriodId", params.reportingPeriodId);
  if (params.branchId) search.set("branchId", params.branchId);
  if (params.emissionSourceId) search.set("emissionSourceId", params.emissionSourceId);
  if (params.status) search.set("status", params.status);
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  const query = search.toString();
  return query ? `?${query}` : "";
}

export function listActivityData(params: ListActivityDataParams = {}): Promise<PaginatedResponse<ActivityRecord>> {
  return apiClient.get<PaginatedResponse<ActivityRecord>>(`/activity-data${buildQueryString(params)}`);
}

export function createActivityData(body: CreateActivityDataInput): Promise<ActivityRecord> {
  return apiClient.post<ActivityRecord>("/activity-data", body);
}

export function getActivityDataById(id: string): Promise<ActivityRecord> {
  return apiClient.get<ActivityRecord>(`/activity-data/${id}`);
}

export function submitActivityData(id: string): Promise<ActivityRecord> {
  return apiClient.post<ActivityRecord>(`/activity-data/${id}/submit`);
}

export function confirmActivityData(id: string): Promise<ActivityRecord> {
  return apiClient.post<ActivityRecord>(`/activity-data/${id}/confirm`);
}

export function rejectActivityData(id: string, reason: string): Promise<ActivityRecord> {
  return apiClient.post<ActivityRecord>(`/activity-data/${id}/reject`, { reason });
}

export function archiveActivityData(id: string): Promise<{ success: true }> {
  return apiClient.delete<{ success: true }>(`/activity-data/${id}`);
}
