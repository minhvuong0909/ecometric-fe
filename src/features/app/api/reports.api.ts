import { apiClient } from "@/shared/lib/api-client";
import type {
  CreateReportInput,
  PaginatedResponse,
  Report,
} from "@/features/app/types/app.types";

export function listReports(businessId: string): Promise<PaginatedResponse<Report>> {
  return apiClient.get<PaginatedResponse<Report>>(`/reports?businessId=${businessId}`);
}

export function getReportById(id: string): Promise<Report> {
  return apiClient.get<Report>(`/reports/${id}`);
}

export function createReport(body: CreateReportInput): Promise<Report> {
  return apiClient.post<Report>("/reports", body);
}

export function generateReport(id: string): Promise<{ success: boolean; message: string }> {
  return apiClient.post<{ success: boolean; message: string }>(`/reports/${id}/generate`);
}

export async function downloadReportFile(id: string, defaultName = "report.pdf"): Promise<void> {
  const { blob, fileName } = await apiClient.download(`/reports/${id}/download`);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName || defaultName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

export function deleteReport(id: string): Promise<{ success: true }> {
  return apiClient.delete<{ success: true }>(`/reports/${id}`);
}
