import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listMembers } from "@/features/businesses/api/members.api";
import { MEMBER_QUERY_KEYS } from "@/features/businesses/hooks/query-keys";
import type { ListMembersParams } from "@/features/businesses/types/businesses.types";
import { isAuthenticated } from "@/shared/lib/auth-storage";

/** Danh sách thành viên của một doanh nghiệp (search/lọc/phân trang). */
export function useBusinessMembers(
  businessId: string | undefined,
  params: ListMembersParams = {},
  enabled = true,
) {
  return useQuery({
    queryKey: MEMBER_QUERY_KEYS.list(businessId ?? "", params),
    queryFn: ({ signal }) => listMembers(businessId as string, params, signal),
    enabled: enabled && isAuthenticated() && Boolean(businessId),
    placeholderData: keepPreviousData,
  });
}
