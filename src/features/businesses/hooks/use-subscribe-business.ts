import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subscribeBusiness } from "@/features/businesses/api/businesses.api";
import { BUSINESS_QUERY_KEYS } from "@/features/businesses/hooks/query-keys";
import { AUTH_QUERY_KEYS } from "@/features/auth/hooks/query-keys";
import type { SubscribeBusinessRequest } from "@/features/businesses/types/businesses.types";
import { useBusinessStore } from "@/shared/stores/business-store";

/** Mua gói tự phục vụ: tạo Business mới và gán chính user hiện tại làm COMPANY_ADMIN. */
export function useSubscribeBusiness() {
  const queryClient = useQueryClient();
  const setActiveBusiness = useBusinessStore((state) => state.setActiveBusiness);

  return useMutation({
    mutationFn: (body: SubscribeBusinessRequest) => subscribeBusiness(body),
    onSuccess: (business) => {
      setActiveBusiness(business);
      void queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.profile });
      void queryClient.invalidateQueries({ queryKey: BUSINESS_QUERY_KEYS.lists() });
    },
  });
}
