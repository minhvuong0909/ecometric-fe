import { useQuery } from "@tanstack/react-query";
import { getBusiness } from "@/features/businesses/api/businesses.api";
import { BUSINESS_QUERY_KEYS } from "@/features/businesses/hooks/query-keys";
import { isAuthenticated } from "@/shared/lib/auth-storage";

/** Chi tiết doanh nghiệp theo id. */
export function useBusiness(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: BUSINESS_QUERY_KEYS.detail(id ?? ""),
    queryFn: ({ signal }) => getBusiness(id as string, signal),
    enabled: enabled && isAuthenticated() && Boolean(id),
  });
}
