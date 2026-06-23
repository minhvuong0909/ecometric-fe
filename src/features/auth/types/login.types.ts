import type { LoginFormValues } from "@/features/auth/schemas/login-schema";

export type LoginRequest = LoginFormValues;

export type LoginResponse = {
  message: string;
};
