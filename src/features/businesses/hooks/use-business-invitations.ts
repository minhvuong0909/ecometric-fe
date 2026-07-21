import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listInvitations } from "@/features/businesses/api/invitations.api";
import { INVITATION_QUERY_KEYS } from "@/features/businesses/hooks/query-keys";
import type { ListInvitationsParams } from "@/features/businesses/types/businesses.types";
import { isAuthenticated } from "@/shared/lib/auth-storage";

/** Danh sách lời mời của một doanh nghiệp (lọc/phân trang). */
export function useBusinessInvitations(
  businessId: string | undefined,
  params: ListInvitationsParams = {},
  enabled = true,
) {
  return useQuery({
    queryKey: INVITATION_QUERY_KEYS.list(businessId ?? "", params),
    queryFn: ({ signal }) =>
      listInvitations(businessId as string, params, signal),
    enabled: enabled && isAuthenticated() && Boolean(businessId),
    placeholderData: keepPreviousData,
  });
}
