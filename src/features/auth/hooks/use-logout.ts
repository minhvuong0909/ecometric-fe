import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/features/auth/stores/auth-store";

export function useLogout() {
  const queryClient = useQueryClient();
  const clear = useAuthStore((state) => state.clear);

  return useMutation({
    mutationFn: () => logout(),
    onSettled: () => {
      clear();
      queryClient.clear();
    },
  });
}
