import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInvitation } from "@/features/businesses/api/invitations.api";
import { INVITATION_QUERY_KEYS } from "@/features/businesses/hooks/query-keys";
import type { InviteMemberRequest } from "@/features/businesses/types/businesses.types";

/** Gửi lời mời thành viên; làm mới danh sách lời mời. */
export function useCreateInvitation(businessId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: InviteMemberRequest) =>
      createInvitation(businessId, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: INVITATION_QUERY_KEYS.lists(businessId),
      });
    },
  });
}
