import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBusiness } from "@/features/businesses/api/businesses.api";
import { BUSINESS_QUERY_KEYS } from "@/features/businesses/hooks/query-keys";

/** Xoá (soft delete) doanh nghiệp — chỉ SYSTEM_ADMIN. */
export function useDeleteBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBusiness(id),
    onSuccess: (_result, id) => {
      queryClient.removeQueries({ queryKey: BUSINESS_QUERY_KEYS.detail(id) });
      void queryClient.invalidateQueries({
        queryKey: BUSINESS_QUERY_KEYS.lists(),
      });
    },
  });
}
