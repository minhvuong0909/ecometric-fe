import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeMemberRole } from "@/features/businesses/api/members.api";
import { MEMBER_QUERY_KEYS } from "@/features/businesses/hooks/query-keys";
import type { ManageableRole } from "@/features/businesses/types/businesses.types";

type ChangeRoleVariables = {
  memberId: string;
  role: ManageableRole;
};

/** Đổi vai trò thành viên; ghi cache detail + làm mới danh sách. */
export function useChangeMemberRole(businessId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ memberId, role }: ChangeRoleVariables) =>
      changeMemberRole(businessId, memberId, { role }),
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
