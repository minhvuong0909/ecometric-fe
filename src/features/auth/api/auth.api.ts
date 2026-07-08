import { apiClient } from "@/shared/lib/api-client";
import type {
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  ProfileResponse,
  RefreshRequest,
  RefreshResponse,
  RegisterRequest,
  SuccessResponse,
} from "@/features/auth/types/auth.types";

/** POST /api/v1/auth/register */
export function register(body: RegisterRequest): Promise<LoginResponse> {
  return apiClient.post<LoginResponse>("/auth/register", body, { auth: false });
}

/** POST /api/v1/auth/login */
export function login(body: LoginRequest): Promise<LoginResponse> {
  return apiClient.post<LoginResponse>("/auth/login", body, { auth: false });
}

/** POST /api/v1/auth/refresh */
export function refresh(body: RefreshRequest): Promise<RefreshResponse> {
  return apiClient.post<RefreshResponse>("/auth/refresh", body, { auth: false });
}

/** POST /api/v1/auth/logout */
export function logout(): Promise<SuccessResponse> {
  return apiClient.post<SuccessResponse>("/auth/logout");
}

/** POST /api/v1/auth/logout-all */
export function logoutAll(): Promise<SuccessResponse> {
  return apiClient.post<SuccessResponse>("/auth/logout-all");
}

/** GET /api/v1/auth/profile */
export function getProfile(): Promise<ProfileResponse> {
  return apiClient.get<ProfileResponse>("/auth/profile");
}

/** PATCH /api/v1/auth/change-password */
export function changePassword(
  body: ChangePasswordRequest,
): Promise<SuccessResponse> {
  return apiClient.patch<SuccessResponse>("/auth/change-password", body);
}
