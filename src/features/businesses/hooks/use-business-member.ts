import { useQuery } from "@tanstack/react-query";
import { getMember } from "@/features/businesses/api/members.api";
import { MEMBER_QUERY_KEYS } from "@/features/businesses/hooks/query-keys";
import { isAuthenticated } from "@/shared/lib/auth-storage";

/** Chi tiết một thành viên doanh nghiệp. */
export function useBusinessMember(
  businessId: string | undefined,
  memberId: string | undefined,
  enabled = true,
) {
  return useQuery({
    queryKey: MEMBER_QUERY_KEYS.detail(businessId ?? "", memberId ?? ""),
    queryFn: ({ signal }) =>
      getMember(businessId as string, memberId as string, signal),
    enabled:
      enabled && isAuthenticated() && Boolean(businessId) && Boolean(memberId),
  });
}
