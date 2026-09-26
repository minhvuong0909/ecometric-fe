import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createReport,
  deleteReport,
  downloadReportFile,
  generateReport,
  getReportById,
  listReports,
} from "@/features/app/api/reports.api";
import type { CreateReportInput } from "@/features/app/types/app.types";

export const REPORTS_QUERY_KEYS = {
  all: ["reports"] as const,
  list: (businessId?: string | null) => ["reports", "list", businessId] as const,
  detail: (id: string) => ["reports", "detail", id] as const,
};

export function useReports(businessId?: string | null, enabled = true) {
  return useQuery({
    queryKey: REPORTS_QUERY_KEYS.list(businessId),
    queryFn: () => (businessId ? listReports(businessId) : Promise.resolve({ items: [], total: 0, page: 1, limit: 20, totalPages: 0 })),
    enabled: enabled && !!businessId,
    refetchInterval: (query) => {
      const hasGenerating = query.state.data?.items.some((r) => r.status === "GENERATING");
      return hasGenerating ? 3000 : false;
    },
  });
}

export function useReportDetail(id: string, enabled = true) {
  return useQuery({
    queryKey: REPORTS_QUERY_KEYS.detail(id),
    queryFn: () => getReportById(id),
    enabled: enabled && !!id,
  });
}

export function useCreateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateReportInput) => createReport(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REPORTS_QUERY_KEYS.all });
    },
  });
}

export function useGenerateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => generateReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REPORTS_QUERY_KEYS.all });
    },
  });
}

export function useDownloadReport() {
  return useMutation({
    mutationFn: ({ id, fileName }: { id: string; fileName?: string }) =>
      downloadReportFile(id, fileName),
  });
}

export function useDeleteReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REPORTS_QUERY_KEYS.all });
    },
  });
}
