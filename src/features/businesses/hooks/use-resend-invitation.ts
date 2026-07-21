import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resendInvitation } from "@/features/businesses/api/invitations.api";
import { INVITATION_QUERY_KEYS } from "@/features/businesses/hooks/query-keys";

/** Gửi lại lời mời (đổi token + gia hạn); làm mới danh sách. */
export function useResendInvitation(businessId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: string) =>
      resendInvitation(businessId, invitationId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: INVITATION_QUERY_KEYS.lists(businessId),
      });
    },
  });
}
