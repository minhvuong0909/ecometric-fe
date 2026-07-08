import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeMemberStatus } from "@/features/businesses/api/members.api";
import { MEMBER_QUERY_KEYS } from "@/features/businesses/hooks/query-keys";
import type { ManageableMemberStatus } from "@/features/businesses/types/businesses.types";

type ChangeStatusVariables = {
  memberId: string;
  status: ManageableMemberStatus;
};

/** Đổi trạng thái thành viên; ghi cache detail + làm mới danh sách. */
export function useChangeMemberStatus(businessId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ memberId, status }: ChangeStatusVariables) =>
      changeMemberStatus(businessId, memberId, { status }),
    onSuccess: (member) => {
      queryClient.setQueryData(
        MEMBER_QUERY_KEYS.detail(businessId, member.id),
        member,
      );
      void queryClient.invalidateQueries({
        queryKey: MEMBER_QUERY_KEYS.lists(businessId),
      });
    },
  });
}
