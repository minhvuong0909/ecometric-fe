export { LoginPage } from "./pages/login-page";
export { LoginForm } from "./components/login-form";
export { RegisterPage } from "./pages/register-page";
export { RegisterForm } from "./components/register-form";
export { GuestOnly, RequireAuth } from "./components/route-guards";
export { useAuthStore } from "./stores/auth-store";

export { useLogin } from "./hooks/use-login";
export { useRegister } from "./hooks/use-register";
export { useLogout } from "./hooks/use-logout";
export { useLogoutAll } from "./hooks/use-logout-all";
export { useProfile } from "./hooks/use-profile";
export { useChangePassword } from "./hooks/use-change-password";
export { AUTH_QUERY_KEYS } from "./hooks/query-keys";

export * as authApi from "./api/auth.api";

export { loginSchema, type LoginFormValues } from "./schemas/login-schema";
export {
  registerSchema,
  type RegisterFormValues,
} from "./schemas/register-schema";
export {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "./schemas/change-password-schema";

export type {
  AuthUser,
  AuthTokens,
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  PlatformRole,
  ProfileMembership,
  ProfileResponse,
  RefreshRequest,
  RefreshResponse,
  RegisterRequest,
  SuccessResponse,
  UserRole,
} from "./types/auth.types";
