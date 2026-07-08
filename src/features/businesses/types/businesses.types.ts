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
