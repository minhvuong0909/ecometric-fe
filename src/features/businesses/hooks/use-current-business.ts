import { useQuery } from "@tanstack/react-query";
import { getCurrentBusiness } from "@/features/businesses/api/businesses.api";
import { BUSINESS_QUERY_KEYS } from "@/features/businesses/hooks/query-keys";
import { isAuthenticated } from "@/shared/lib/auth-storage";

/** Doanh nghiệp đang chọn (gửi kèm header X-Business-Id). */
export function useCurrentBusiness(
  businessId: string | undefined,
  enabled = true,
) {
  return useQuery({
    queryKey: BUSINESS_QUERY_KEYS.current(businessId ?? ""),
    queryFn: ({ signal }) => getCurrentBusiness(businessId as string, signal),
    enabled: enabled && isAuthenticated() && Boolean(businessId),
  });
}
