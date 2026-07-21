import { useMutation, useQueryClient } from "@tanstack/react-query";
import { revokeInvitation } from "@/features/businesses/api/invitations.api";
import { INVITATION_QUERY_KEYS } from "@/features/businesses/hooks/query-keys";

/** Thu hồi lời mời; làm mới danh sách. */
export function useRevokeInvitation(businessId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: string) =>
      revokeInvitation(businessId, invitationId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: INVITATION_QUERY_KEYS.lists(businessId),
      });
    },
  });
}
