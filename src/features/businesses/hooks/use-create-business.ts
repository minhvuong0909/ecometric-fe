import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBusiness } from "@/features/businesses/api/businesses.api";
import { BUSINESS_QUERY_KEYS } from "@/features/businesses/hooks/query-keys";
import type { CreateBusinessRequest } from "@/features/businesses/types/businesses.types";

/** Tạo doanh nghiệp (onboarding) — chỉ SYSTEM_ADMIN. */
export function useCreateBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateBusinessRequest) => createBusiness(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: BUSINESS_QUERY_KEYS.lists(),
      });
    },
  });
}
