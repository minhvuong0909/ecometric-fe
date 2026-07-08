import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutAll } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/features/auth/stores/auth-store";

export function useLogoutAll() {
  const queryClient = useQueryClient();
  const clear = useAuthStore((state) => state.clear);

  return useMutation({
    mutationFn: () => logoutAll(),
    onSettled: () => {
      clear();
      queryClient.clear();
    },
  });
}
