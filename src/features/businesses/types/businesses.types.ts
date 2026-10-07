import type { UserRole } from "@/features/auth/types/auth.types";

/** Mirror `ecometric-be` businesses/branches/invitations DTOs. */

export type BusinessStatus = "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export type InvitationStatus = "PENDING" | "ACCEPTED" | "EXPIRED" | "REVOKED";

export type MemberStatus = "INVITED" | "ACTIVE" | "DISABLED" | "REMOVED";

export type Business = {
  id: string;
  name: string;
  slug: string;
  taxCode: string | null;
  industry: string | null;
  country: string;
  timezone: string;
  website: string | null;
  status: BusinessStatus;
  subscriptionTier?: "STARTER" | "PROFESSIONAL" | "ENTERPRISE";
  subscriptionStatus?: "TRIALING" | "ACTIVE" | "EXPIRED";
  trialEndsAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

/** data của GET /businesses */
export type BusinessListResponse = {
  items: Business[];
  pagination: Pagination;
};

export type Branch = {
  id: string;
  businessId: string;
  code: string | null;
  name: string;
  address: string | null;
  country: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type BusinessInvitation = {
  id: string;
  businessId: string;
  email: string;
  role: UserRole;
  status: InvitationStatus;
  expiresAt: string;
  acceptedAt: string | null;
  createdAt: string;
};

/** data của POST /businesses (chỉ SYSTEM_ADMIN) */
export type BusinessOnboardingResponse = {
  business: Business;
  defaultBranch: Branch;
  companyAdminInvitation: BusinessInvitation;
};

/** data của DELETE /businesses/:id */
export type BusinessSuccessResponse = {
  success: true;
};

export type ListBusinessesParams = {
  search?: string;
  status?: BusinessStatus;
  page?: number;
  limit?: number;
};

export type CreateBusinessDefaultBranch = {
  name?: string;
  code?: string;
  address?: string;
  country?: string;
};

export type CreateBusinessRequest = {
  name: string;
  slug: string;
  taxCode?: string;
  industry?: string;
  country?: string;
  timezone?: string;
  website?: string;
  companyAdminEmail: string;
  companyAdminFullName?: string;
  defaultBranch?: CreateBusinessDefaultBranch;
};

/** POST /businesses/subscribe — tự phục vụ, user đăng nhập tự tạo Business của chính mình. */
export type SubscribeBusinessRequest = {
  name: string;
  taxCode?: string;
  industry?: string;
  country?: string;
  planTier: "STARTER" | "PROFESSIONAL" | "ENTERPRISE";
};

export type UpdateBusinessRequest = {
  name?: string;
  slug?: string;
  taxCode?: string;
  industry?: string;
  country?: string;
  timezone?: string;
  website?: string;
  status?: BusinessStatus;
};

/* ── Business members ── */

/** Vai trò có thể gán cho thành viên doanh nghiệp (không gồm SYSTEM_ADMIN). */
export type ManageableRole =
  | "COMPANY_ADMIN"
  | "BRANCH_MANAGER"
  | "STAFF"
  | "VIEWER";

/** Trạng thái có thể đặt cho thành viên (không gồm INVITED). */
export type ManageableMemberStatus = "ACTIVE" | "DISABLED" | "REMOVED";

export type BusinessMemberUser = {
  id: string;
  email: string;
  fullName: string | null;
};

export type BusinessMember = {
  id: string;
  businessId: string;
  user: BusinessMemberUser;
  role: UserRole;
  status: MemberStatus;
  joinedAt: string | null;
  createdAt: string;
};

/** data của GET /businesses/:businessId/members */
export type BusinessMemberListResponse = {
  items: BusinessMember[];
  pagination: Pagination;
};

export type ListMembersParams = {
  role?: ManageableRole;
  status?: MemberStatus;
  search?: string;
  page?: number;
  limit?: number;
};

export type ChangeMemberRoleRequest = {
  role: ManageableRole;
};

export type ChangeMemberStatusRequest = {
  status: ManageableMemberStatus;
};

/* ── Business invitations ── */

/** POST /businesses/:businessId/invitations */
export type InviteMemberRequest = {
  email: string;
  role: ManageableRole;
};

export type ListInvitationsParams = {
  status?: InvitationStatus;
  email?: string;
  page?: number;
  limit?: number;
};

/** data của GET /businesses/:businessId/invitations */
export type BusinessInvitationListResponse = {
  items: BusinessInvitation[];
  pagination: Pagination;
};

/** POST /invitations/accept */
export type AcceptInvitationRequest = {
  token: string;
  fullName?: string;
  password?: string;
};

export type AcceptInvitationResponse = {
  success: true;
  business: {
    id: string;
    name: string;
  };
  member: {
    id: string;
    role: UserRole;
    status: MemberStatus;
  };
};

export type SubscriptionCheckout = { orderCode: number; checkoutUrl: string; qrCode: string; amount: number; planTier: "STARTER" | "PROFESSIONAL" | "ENTERPRISE" };
export type SubscriptionOrder = { orderCode: number; status: "PENDING" | "PAID" | "CANCELLED" | "EXPIRED" | "FAILED"; amount: number; planTier: string; businessId: string | null; checkoutUrl: string | null };
