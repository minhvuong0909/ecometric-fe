import { apiClient } from "@/shared/lib/api-client";
import type {
  BusinessMember,
  BusinessMemberListResponse,
  BusinessSuccessResponse,
  ChangeMemberRoleRequest,
  ChangeMemberStatusRequest,
  ListMembersParams,
} from "@/features/businesses/types/businesses.types";

const membersPath = (businessId: string) => `/businesses/${businessId}/members`;

function buildQueryString(params: ListMembersParams): string {
  const search = new URLSearchParams();
  if (params.role) search.set("role", params.role);
  if (params.status) search.set("status", params.status);
  if (params.search) search.set("search", params.search);
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  const query = search.toString();
  return query ? `?${query}` : "";
}

/** GET /api/v1/businesses/:businessId/members */
export function listMembers(
  businessId: string,
  params: ListMembersParams = {},
  signal?: AbortSignal,
): Promise<BusinessMemberListResponse> {
  return apiClient.get<BusinessMemberListResponse>(
    `${membersPath(businessId)}${buildQueryString(params)}`,
    { signal },
  );
}

/** GET /api/v1/businesses/:businessId/members/:memberId */
export function getMember(
  businessId: string,
  memberId: string,
  signal?: AbortSignal,
): Promise<BusinessMember> {
  return apiClient.get<BusinessMember>(
    `${membersPath(businessId)}/${memberId}`,
    { signal },
  );
}

/** PATCH /api/v1/businesses/:businessId/members/:memberId/role */
export function changeMemberRole(
  businessId: string,
  memberId: string,
  body: ChangeMemberRoleRequest,
): Promise<BusinessMember> {
  return apiClient.patch<BusinessMember>(
    `${membersPath(businessId)}/${memberId}/role`,
    body,
  );
}

/** PATCH /api/v1/businesses/:businessId/members/:memberId/status */
export function changeMemberStatus(
  businessId: string,
  memberId: string,
  body: ChangeMemberStatusRequest,
): Promise<BusinessMember> {
  return apiClient.patch<BusinessMember>(
    `${membersPath(businessId)}/${memberId}/status`,
    body,
  );
}

/** DELETE /api/v1/businesses/:businessId/members/:memberId */
export function removeMember(
  businessId: string,
  memberId: string,
): Promise<BusinessSuccessResponse> {
  return apiClient.delete<BusinessSuccessResponse>(
    `${membersPath(businessId)}/${memberId}`,
  );
}
