import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeMember } from "@/features/businesses/api/members.api";
import { MEMBER_QUERY_KEYS } from "@/features/businesses/hooks/query-keys";

/** Gỡ thành viên khỏi doanh nghiệp; xoá cache detail + làm mới danh sách. */
export function useRemoveBusinessMember(businessId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: string) => removeMember(businessId, memberId),
    onSuccess: (_result, memberId) => {
      queryClient.removeQueries({
        queryKey: MEMBER_QUERY_KEYS.detail(businessId, memberId),
      });
      void queryClient.invalidateQueries({
        queryKey: MEMBER_QUERY_KEYS.lists(businessId),
      });
    },
  });
}
