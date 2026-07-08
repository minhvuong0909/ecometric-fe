import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listBusinesses } from "@/features/businesses/api/businesses.api";
import { BUSINESS_QUERY_KEYS } from "@/features/businesses/hooks/query-keys";
import type { ListBusinessesParams } from "@/features/businesses/types/businesses.types";
import { isAuthenticated } from "@/shared/lib/auth-storage";

/**
 * Danh sách doanh nghiệp (có phân trang/tìm kiếm/lọc trạng thái).
 * `keepPreviousData` giữ dữ liệu trang cũ khi đổi trang/bộ lọc → không nhấp nháy.
 */
export function useBusinesses(
  params: ListBusinessesParams = {},
  enabled = true,
) {
  return useQuery({
    queryKey: BUSINESS_QUERY_KEYS.list(params),
    queryFn: ({ signal }) => listBusinesses(params, signal),
    enabled: enabled && isAuthenticated(),
    placeholderData: keepPreviousData,
  });
}
