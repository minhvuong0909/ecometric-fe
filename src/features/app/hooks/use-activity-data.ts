import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  archiveActivityData,
  confirmActivityData,
  createActivityData,
  getActivityDataById,
  listActivityData,
  rejectActivityData,
  submitActivityData,
} from "@/features/app/api/activity-data.api";
import type { CreateActivityDataInput, ListActivityDataParams } from "@/features/app/types/app.types";
import { DASHBOARD_QUERY_KEYS } from "./use-dashboard";

export const ACTIVITY_DATA_QUERY_KEYS = {
  all: ["activity-data"] as const,
  list: (params: ListActivityDataParams) => ["activity-data", "list", params] as const,
  detail: (id: string) => ["activity-data", "detail", id] as const,
};

export function useActivityDataList(params: ListActivityDataParams, enabled = true) {
  return useQuery({
    queryKey: ACTIVITY_DATA_QUERY_KEYS.list(params),
    queryFn: () => listActivityData(params),
    enabled: enabled && !!params.businessId,
  });
}

export function useActivityDataDetail(id: string, enabled = true) {
  return useQuery({
    queryKey: ACTIVITY_DATA_QUERY_KEYS.detail(id),
    queryFn: () => getActivityDataById(id),
    enabled: enabled && !!id,
  });
}

export function useCreateActivityData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateActivityDataInput) => createActivityData(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITY_DATA_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEYS.all });
    },
  });
}

export function useSubmitActivityData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => submitActivityData(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITY_DATA_QUERY_KEYS.all });
    },
  });
}

export function useConfirmActivityData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => confirmActivityData(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITY_DATA_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEYS.all });
    },
  });
}

export function useRejectActivityData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => rejectActivityData(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITY_DATA_QUERY_KEYS.all });
    },
  });
}

export function useArchiveActivityData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => archiveActivityData(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITY_DATA_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEYS.all });
    },
  });
}
