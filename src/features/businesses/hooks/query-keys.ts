import type { ListBusinessesParams } from "@/features/businesses/types/businesses.types";

/**
 * Query keys phân tầng cho cache React Query.
 * Cấu trúc lồng nhau cho phép invalidate chính xác (chỉ list, chỉ 1 detail…)
 * thay vì xoá toàn bộ cache — tối ưu số lần refetch.
 */
export const BUSINESS_QUERY_KEYS = {
  all: ["businesses"] as const,
  lists: () => [...BUSINESS_QUERY_KEYS.all, "list"] as const,
  list: (params: ListBusinessesParams) =>
    [...BUSINESS_QUERY_KEYS.lists(), params] as const,
  details: () => [...BUSINESS_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...BUSINESS_QUERY_KEYS.details(), id] as const,
  current: (businessId: string) =>
    [...BUSINESS_QUERY_KEYS.all, "current", businessId] as const,
};
