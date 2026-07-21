import { apiClient } from "@/shared/lib/api-client";
import type {
  AcceptInvitationRequest,
  AcceptInvitationResponse,
  BusinessInvitation,
  BusinessInvitationListResponse,
  BusinessSuccessResponse,
  InviteMemberRequest,
  ListInvitationsParams,
} from "@/features/businesses/types/businesses.types";

const invitationsPath = (businessId: string) =>
  `/businesses/${businessId}/invitations`;

function buildQueryString(params: ListInvitationsParams): string {
  const search = new URLSearchParams();
  if (params.status) search.set("status", params.status);
  if (params.email) search.set("email", params.email);
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  const query = search.toString();
  return query ? `?${query}` : "";
}

/** POST /api/v1/businesses/:businessId/invitations */
export function createInvitation(
  businessId: string,
  body: InviteMemberRequest,
): Promise<BusinessInvitation> {
  return apiClient.post<BusinessInvitation>(invitationsPath(businessId), body);
}

/** GET /api/v1/businesses/:businessId/invitations */
export function listInvitations(
  businessId: string,
  params: ListInvitationsParams = {},
  signal?: AbortSignal,
): Promise<BusinessInvitationListResponse> {
  return apiClient.get<BusinessInvitationListResponse>(
    `${invitationsPath(businessId)}${buildQueryString(params)}`,
    { signal },
  );
}

/** POST /api/v1/businesses/:businessId/invitations/:invitationId/resend */
export function resendInvitation(
  businessId: string,
  invitationId: string,
): Promise<BusinessInvitation> {
  return apiClient.post<BusinessInvitation>(
    `${invitationsPath(businessId)}/${invitationId}/resend`,
  );
}

/** DELETE /api/v1/businesses/:businessId/invitations/:invitationId */
export function revokeInvitation(
  businessId: string,
  invitationId: string,
): Promise<BusinessSuccessResponse> {
  return apiClient.delete<BusinessSuccessResponse>(
    `${invitationsPath(businessId)}/${invitationId}`,
  );
}

/**
 * POST /api/v1/invitations/accept (công khai — optionalAuth).
 * Không tự refresh token để tránh đăng xuất người dùng chưa đăng nhập.
 */
export function acceptInvitation(
  body: AcceptInvitationRequest,
): Promise<AcceptInvitationResponse> {
  return apiClient.post<AcceptInvitationResponse>("/invitations/accept", body, {
    retryOnUnauthorized: false,
  });
}
