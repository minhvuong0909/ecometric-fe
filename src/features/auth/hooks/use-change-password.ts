import { useMutation } from "@tanstack/react-query";
import { changePassword } from "@/features/auth/api/auth.api";
import type { ChangePasswordRequest } from "@/features/auth/types/auth.types";

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => changePassword(data),
  });
}
