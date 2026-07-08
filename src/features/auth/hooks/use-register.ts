import { useMutation, useQueryClient } from "@tanstack/react-query";
import { register } from "@/features/auth/api/auth.api";
import { AUTH_QUERY_KEYS } from "@/features/auth/hooks/query-keys";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import type { RegisterRequest } from "@/features/auth/types/auth.types";

export function useRegister() {
  const queryClient = useQueryClient();
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
    onSuccess: (result) => {
      setSession({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user,
      });
      void queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.profile });
    },
  });
}
