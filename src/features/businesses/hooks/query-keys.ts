import type {
  ListBusinessesParams,
  ListInvitationsParams,
  ListMembersParams,
} from "@/features/businesses/types/businesses.types";

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

/** Query keys cho thành viên, gom theo từng businessId để invalidate độc lập. */
export const MEMBER_QUERY_KEYS = {
  all: (businessId: string) => ["businesses", businessId, "members"] as const,
  lists: (businessId: string) =>
    [...MEMBER_QUERY_KEYS.all(businessId), "list"] as const,
  list: (businessId: string, params: ListMembersParams) =>
    [...MEMBER_QUERY_KEYS.lists(businessId), params] as const,
  details: (businessId: string) =>
    [...MEMBER_QUERY_KEYS.all(businessId), "detail"] as const,
  detail: (businessId: string, memberId: string) =>
    [...MEMBER_QUERY_KEYS.details(businessId), memberId] as const,
};

/** Query keys cho lời mời, gom theo từng businessId. */
export const INVITATION_QUERY_KEYS = {
  all: (businessId: string) =>
    ["businesses", businessId, "invitations"] as const,
  lists: (businessId: string) =>
    [...INVITATION_QUERY_KEYS.all(businessId), "list"] as const,
  list: (businessId: string, params: ListInvitationsParams) =>
    [...INVITATION_QUERY_KEYS.lists(businessId), params] as const,
};
