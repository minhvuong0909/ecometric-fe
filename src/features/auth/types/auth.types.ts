export type PlatformRole = "USER" | "SYSTEM_ADMIN";

export type UserRole =
  | "SYSTEM_ADMIN"
  | "COMPANY_ADMIN"
  | "BRANCH_MANAGER"
  | "STAFF"
  | "VIEWER";

export type AuthUser = {
  id: string;
  email: string;
  fullName: string | null;
  platformRole: PlatformRole;
};

export type ProfileMembership = {
  businessId: string;
  businessName: string;
  role: UserRole;
};

/** POST /auth/register */
export type RegisterRequest = {
  email: string;
  password: string;
  fullName?: string;
};

/** POST /auth/login */
export type LoginRequest = {
  email: string;
  password: string;
};

/** POST /auth/refresh */
export type RefreshRequest = {
  refreshToken: string;
};

/** PATCH /auth/change-password */
export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

/** data của /auth/register và /auth/login */
export type LoginResponse = AuthTokens & {
  user: AuthUser;
};

/** data của /auth/refresh */
export type RefreshResponse = AuthTokens;

/** data của /auth/profile */
export type ProfileResponse = {
  user: AuthUser;
  memberships: ProfileMembership[];
};

/** data của /auth/logout, /auth/logout-all, /auth/change-password */
export type SuccessResponse = {
  success: true;
};
