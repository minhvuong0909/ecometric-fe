import { apiClient } from "@/shared/lib/api-client";
import type {
  AiDocumentType,
  ActivityRecord,
  AiScanDocument,
  ConfirmInvoiceScanInput,
  InvoiceScanQueuedResponse,
  PaginatedResponse,
  ScanJobStatus,
} from "@/features/app/types/app.types";

export function uploadInvoiceScan(
  file: File,
  businessId: string,
  documentType: AiDocumentType = "OTHER",
): Promise<InvoiceScanQueuedResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("businessId", businessId);
  formData.append("documentType", documentType);

  return apiClient.post<InvoiceScanQueuedResponse>("/ai-scan/invoices", formData);
}

export function listInvoiceScans(params: {
  businessId?: string;
  status?: ScanJobStatus;
  page?: number;
  limit?: number;
} = {}): Promise<PaginatedResponse<AiScanDocument>> {
  const search = new URLSearchParams();
  if (params.businessId) search.set("businessId", params.businessId);
  if (params.status) search.set("status", params.status);
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  const query = search.toString();

  return apiClient.get<PaginatedResponse<AiScanDocument>>(`/ai-scan/invoices${query ? `?${query}` : ""}`);
}

export function getInvoiceScanById(id: string): Promise<AiScanDocument> {
  return apiClient.get<AiScanDocument>(`/ai-scan/invoices/${id}`);
}

export function confirmInvoiceScan(id: string, body: ConfirmInvoiceScanInput): Promise<{ document: AiScanDocument; activityRecord: ActivityRecord }> {
  return apiClient.post<{ document: AiScanDocument; activityRecord: ActivityRecord }>(`/ai-scan/invoices/${id}/confirm`, body);
}

export function rejectInvoiceScan(id: string, reason: string): Promise<AiScanDocument> {
  return apiClient.post<AiScanDocument>(`/ai-scan/invoices/${id}/reject`, { reason });
}

export function retryInvoiceScan(id: string): Promise<InvoiceScanQueuedResponse> {
  return apiClient.post<InvoiceScanQueuedResponse>(`/ai-scan/invoices/${id}/retry`);
}

export function getInvoiceScanFile(id: string): Promise<{ blob: Blob; fileName: string }> {
  return apiClient.download(`/ai-scan/invoices/${id}/file`);
}
