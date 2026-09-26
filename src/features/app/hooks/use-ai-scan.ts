import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  confirmInvoiceScan,
  getInvoiceScanById,
  listInvoiceScans,
  rejectInvoiceScan,
  retryInvoiceScan,
  uploadInvoiceScan,
} from "@/features/app/api/ai-scan.api";
import type { ConfirmInvoiceScanInput, ScanJobStatus } from "@/features/app/types/app.types";
import { ACTIVITY_DATA_QUERY_KEYS } from "./use-activity-data";

export const AI_SCAN_QUERY_KEYS = {
  all: ["ai-scan"] as const,
  list: (params: { businessId?: string; status?: ScanJobStatus; page?: number; limit?: number }) =>
    ["ai-scan", "list", params] as const,
  detail: (id: string) => ["ai-scan", "detail", id] as const,
};

export function useInvoiceScans(
  params: { businessId?: string; status?: ScanJobStatus; page?: number; limit?: number },
  enabled = true,
) {
  return useQuery({
    queryKey: AI_SCAN_QUERY_KEYS.list(params),
    queryFn: () => listInvoiceScans(params),
    enabled: enabled && !!params.businessId,
    refetchInterval: (query) => {
      // Poll every 3s if any job is queued or processing
      const hasProcessing = query.state.data?.items.some(
        (item) => item.status === "QUEUED" || item.status === "PROCESSING",
      );
      return hasProcessing ? 3000 : false;
    },
  });
}

export function useInvoiceScanDetail(id?: string | null, enabled = true) {
  return useQuery({
    queryKey: AI_SCAN_QUERY_KEYS.detail(id ?? ""),
    queryFn: () => (id ? getInvoiceScanById(id) : Promise.reject("No id")),
    enabled: enabled && !!id,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "QUEUED" || status === "PROCESSING" ? 2500 : false;
    },
  });
}

export function useUploadInvoiceScan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      file,
      businessId,
      documentType,
    }: {
      file: File;
      businessId: string;
      documentType?: string;
    }) => uploadInvoiceScan(file, businessId, documentType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AI_SCAN_QUERY_KEYS.all });
    },
  });
}

export function useConfirmInvoiceScan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: ConfirmInvoiceScanInput }) =>
      confirmInvoiceScan(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AI_SCAN_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ACTIVITY_DATA_QUERY_KEYS.all });
    },
  });
}

export function useRejectInvoiceScan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      rejectInvoiceScan(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AI_SCAN_QUERY_KEYS.all });
    },
  });
}

export function useRetryInvoiceScan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => retryInvoiceScan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AI_SCAN_QUERY_KEYS.all });
    },
  });
}
