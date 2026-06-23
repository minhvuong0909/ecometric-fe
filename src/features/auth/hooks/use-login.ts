import { useMutation } from "@tanstack/react-query";
import { login } from "@/features/auth/api/auth.api";
import type { LoginRequest } from "@/features/auth/types/login.types";

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
  });
}
