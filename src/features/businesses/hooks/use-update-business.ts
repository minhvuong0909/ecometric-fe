import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBusiness } from "@/features/businesses/api/businesses.api";
import { BUSINESS_QUERY_KEYS } from "@/features/businesses/hooks/query-keys";
import type { UpdateBusinessRequest } from "@/features/businesses/types/businesses.types";

type UpdateBusinessVariables = {
  id: string;
  data: UpdateBusinessRequest;
};

/** Cập nhật doanh nghiệp; ghi thẳng cache detail + làm mới danh sách. */
export function useUpdateBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateBusinessVariables) =>
      updateBusiness(id, data),
    onSuccess: (business) => {
      queryClient.setQueryData(
        BUSINESS_QUERY_KEYS.detail(business.id),
        business,
      );
      void queryClient.invalidateQueries({
        queryKey: BUSINESS_QUERY_KEYS.lists(),
      });
    },
  });
}
