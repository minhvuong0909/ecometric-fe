import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "@/features/auth/api/auth.api";
import { AUTH_QUERY_KEYS } from "@/features/auth/hooks/query-keys";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import type { UpdateProfileRequest } from "@/features/auth/types/auth.types";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const setMemberships = useAuthStore((state) => state.setMemberships);

  return useMutation({
    mutationFn: (body: UpdateProfileRequest) => updateProfile(body),
    onSuccess: (result) => {
      setUser(result.user);
      setMemberships(result.memberships);
      void queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.profile });
    },
  });
}
