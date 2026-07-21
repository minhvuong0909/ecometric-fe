import { useMutation } from "@tanstack/react-query";
import { acceptInvitation } from "@/features/businesses/api/invitations.api";
import type { AcceptInvitationRequest } from "@/features/businesses/types/businesses.types";

/** Chấp nhận lời mời qua token (công khai — không cần đăng nhập trước). */
export function useAcceptInvitation() {
  return useMutation({
    mutationFn: (body: AcceptInvitationRequest) => acceptInvitation(body),
  });
}
