import { apiClient } from "@/shared/lib/api-client";
import type {
  Business,
  BusinessListResponse,
  BusinessOnboardingResponse,
  BusinessSuccessResponse,
  CreateBusinessRequest,
  ListBusinessesParams,
  UpdateBusinessRequest,
} from "@/features/businesses/types/businesses.types";

const BASE_PATH = "/businesses";

/** Chuyển params thành query string, bỏ qua giá trị rỗng/undefined. */
function buildQueryString(params: ListBusinessesParams): string {
  const search = new URLSearchParams();
  if (params.search) search.set("search", params.search);
  if (params.status) search.set("status", params.status);
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  const query = search.toString();
  return query ? `?${query}` : "";
}

/** GET /api/v1/businesses */
export function listBusinesses(
  params: ListBusinessesParams = {},
  signal?: AbortSignal,
): Promise<BusinessListResponse> {
  return apiClient.get<BusinessListResponse>(
    `${BASE_PATH}${buildQueryString(params)}`,
    { signal },
  );
}

/** GET /api/v1/businesses/current (yêu cầu header X-Business-Id) */
export function getCurrentBusiness(
  businessId: string,
  signal?: AbortSignal,
): Promise<Business> {
  return apiClient.get<Business>(`${BASE_PATH}/current`, {
    headers: { "X-Business-Id": businessId },
    signal,
  });
}

/** GET /api/v1/businesses/:id */
export function getBusiness(id: string, signal?: AbortSignal): Promise<Business> {
  return apiClient.get<Business>(`${BASE_PATH}/${id}`, { signal });
}

/** POST /api/v1/businesses (chỉ SYSTEM_ADMIN) */
export function createBusiness(
  body: CreateBusinessRequest,
): Promise<BusinessOnboardingResponse> {
  return apiClient.post<BusinessOnboardingResponse>(BASE_PATH, body);
}

/** PATCH /api/v1/businesses/:id */
export function updateBusiness(
  id: string,
  body: UpdateBusinessRequest,
): Promise<Business> {
  return apiClient.patch<Business>(`${BASE_PATH}/${id}`, body);
}

/** DELETE /api/v1/businesses/:id (chỉ SYSTEM_ADMIN) */
export function deleteBusiness(id: string): Promise<BusinessSuccessResponse> {
  return apiClient.delete<BusinessSuccessResponse>(`${BASE_PATH}/${id}`);
}
