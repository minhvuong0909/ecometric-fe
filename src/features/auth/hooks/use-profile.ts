import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getProfile } from "@/features/auth/api/auth.api";
import { AUTH_QUERY_KEYS } from "@/features/auth/hooks/query-keys";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { isAuthenticated } from "@/shared/lib/auth-storage";

export function useProfile(enabled = true) {
  const setUser = useAuthStore((state) => state.setUser);

  const query = useQuery({
    queryKey: AUTH_QUERY_KEYS.profile,
    queryFn: () => getProfile(),
    enabled: enabled && isAuthenticated(),
  });

  useEffect(() => {
    if (query.data?.user) {
      setUser(query.data.user);
    }
  }, [query.data, setUser]);

  return query;
}
