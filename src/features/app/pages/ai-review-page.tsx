import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { getInvoiceScanFile } from "@/features/app/api/ai-scan.api";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  FileText,
  Loader2,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  Wand2,
  XCircle,
} from "lucide-react";
import { AppPageHeader } from "@/features/app/components/app-page-header";
import { AppPanel } from "@/features/app/components/app-panel";
import { AI_REVIEW_COPY } from "@/features/app/constants/app-copy";
import {
  useConfirmInvoiceScan,
  useInvoiceScanDetail,
  useInvoiceScans,
  useRejectInvoiceScan,
  useRetryInvoiceScan,
} from "@/features/app/hooks/use-ai-scan";
import { useBranches } from "@/features/app/hooks/use-app-meta";
import { ActivityEntryForm } from "@/features/app/components/activity-entry-form";
import { useBusinessRole } from "@/features/businesses/hooks/use-business-role";
import type { AiScanDocument, ScanJobStatus, CreateActivityDataInput } from "@/features/app/types/app.types";
import { useBusinessStore } from "@/shared/stores/business-store";
import { Badge, type badgeVariants } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { ROUTES } from "@/shared/constants/routes";
import { getApiErrorMessage } from "@/shared/lib/get-error-message";
import { cn } from "@/shared/lib/utils";
import type { VariantProps } from "class-variance-authority";

/**
 * Trang này port lại logic từ vat-extractor-tool.html (công cụ HTML độc lập) thành React,
 * dùng làm chỗ đứng tạm thời cho tới khi mô hình AI OCR thật hoàn thiện. Tài liệu/upload/
 * reject/retry đều gọi API thật; riêng phần "trích xuất" (chia dòng hàng hoá + phân Scope)
 * là nhập tay hoặc điền dữ liệu minh hoạ — chưa có OCR thật đứng sau.
 */

type ScopeLabel = "Scope 1" | "Scope 2" | "Scope Unassigned";

type LineItem = {
  id: number;
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  vatRate: number;
  scope: ScopeLabel;
  confidence: number;
  reasoning: string;
};

type InvoiceDraft = {
  serial: string;
  number: string;
  date: string;
  defaultVat: number;
  seller: { name: string; taxCode: string; address: string };
  buyer: { name: string; taxCode: string; address: string };
  subtotal: number;
  vatAmount: number;
  totalAmount: number;
  items: LineItem[];
};

const STATUS_CONFIG: Record<
  ScanJobStatus,
  { label: string; variant: VariantProps<typeof badgeVariants>["variant"]; icon: typeof CheckCircle2 }
> = {
  QUEUED: { label: "Trong hàng đợi", variant: "info", icon: Clock },
  PROCESSING: { label: "Đang xử lý", variant: "info", icon: Loader2 },
  NEED_REVIEW: { label: "Cần rà soát", variant: "warning", icon: AlertCircle },
  COMPLETED: { label: "Đã xử lý", variant: "success", icon: CheckCircle2 },
  CONFIRMED: { label: "Đã ghi nhận", variant: "success", icon: CheckCircle2 },
  REJECTED: { label: "Đã từ chối", variant: "neutral", icon: XCircle },
  FAILED: { label: "Lỗi trích xuất", variant: "danger", icon: XCircle },
};

const MOCK_SAMPLES: Array<{
  serial: string;
  number: string;
  date: string;
  seller: [string, string, string];
  buyer: [string, string, string];
  items: Array<[string, string, number, number, number]>;
}> = [
  {
    serial: "1C25TAA",
    number: "0002847",
    date: new Date().toLocaleDateString("vi-VN"),
    seller: ["CÔNG TY TNHH THIẾT BỊ VÀ DỊCH VỤ KỸ THUẬT HÀ NỘI", "0106789123", "Số 12, Lê Văn Lương, Thanh Xuân, Hà Nội"],
    buyer: ["CÔNG TY CP ĐẦU TƯ XÂY DỰNG DELTA", "0102345678", "KCN Thăng Long, Đông Anh, Hà Nội"],
    items: [
      ["Thép hộp mạ kẽm 40×80×1.4mm", "cây", 285000, 10, 120],
      ["Xi măng PCB40 Vicem", "tấn", 1850000, 10, 15],
      ["Dịch vụ vận chuyển vật liệu đến công trường", "chuyến", 2500000, 8, 8],
      ["Phần mềm quản lý kho — license 1 năm", "gói", 18000000, 10, 1],
      ["Nhân công lắp đặt hệ khung thép", "ngày công", 650000, 8, 22],
    ],
  },
  {
    serial: "1C25TBB",
    number: "0002848",
    date: new Date().toLocaleDateString("vi-VN"),
    seller: ["CÔNG TY TNHH VẬT LIỆU XÂY DỰNG HÒA PHÁT", "0101122334", "KCN Phố Nối, Hưng Yên"],
    buyer: ["CÔNG TY CP ĐẦU TƯ XÂY DỰNG DELTA", "0102345678", "KCN Thăng Long, Đông Anh, Hà Nội"],
    items: [
      ["Gạch block 200×200×400mm", "viên", 4200, 10, 5000],
      ["Cát vàng sông Lô", "m³", 380000, 10, 80],
      ["Dịch vụ tư vấn giám sát thi công", "gói", 25000000, 10, 1],
      ["Thiết kế bản vẽ hoàn công", "bộ", 12000000, 8, 1],
    ],
  },
  {
    serial: "1C25TCC",
    number: "0002849",
    date: new Date().toLocaleDateString("vi-VN"),
    seller: ["CÔNG TY CP CÔNG NGHỆ PHẦN MỀM BRAVO", "0109988776", "Tòa Weekday, Cầu Giấy, Hà Nội"],
    buyer: ["CÔNG TY CP ĐẦU TƯ XÂY DỰNG DELTA", "0102345678", "KCN Thăng Long, Đông Anh, Hà Nội"],
    items: [
      ["License ERP Bravo 8R2 — 10 user", "license", 45000000, 10, 1],
      ["Dịch vụ đào tạo vận hành hệ thống", "buổi", 3500000, 8, 6],
      ["Bảo hành mở rộng 12 tháng", "gói", 8000000, 8, 1],
      ["Cáp mạng CAT6 305m", "cuộn", 1850000, 10, 10],
    ],
  },
];

const DEFAULT_KEYWORDS_1 =
  "vật liệu, nguyên liệu, thiết bị, máy, phần cứng, linh kiện, sắt, thép, xi măng, gạch, cáp, ống, van, bơm, động cơ";
const DEFAULT_KEYWORDS_2 =
  "dịch vụ, tư vấn, vận chuyển, lắp đặt, bảo hành, phần mềm, license, subscription, nhân công, thiết kế, đào tạo, bảo trì";

function classify(
  description: string,
  keywords1: string,
  keywords2: string,
): { scope: ScopeLabel; confidence: number; reasoning: string } {
  const d = description.toLowerCase();
  const k1 = keywords1.toLowerCase().split(",").map((s) => s.trim()).filter(Boolean);
  const k2 = keywords2.toLowerCase().split(",").map((s) => s.trim()).filter(Boolean);
  const hit1 = k1.some((k) => d.includes(k));
  const hit2 = k2.some((k) => d.includes(k));
  if (hit1 && !hit2) return { scope: "Scope 1", confidence: 0.92, reasoning: "Chứa từ khóa vật liệu/thiết bị" };
  if (hit2 && !hit1) return { scope: "Scope 2", confidence: 0.9, reasoning: "Chứa từ khóa dịch vụ/phần mềm/nhân công" };
  if (hit1 && hit2) return { scope: "Scope 1", confidence: 0.62, reasoning: "Khớp cả 2 nhóm — cần rà soát" };
  return { scope: "Scope Unassigned", confidence: 0.55, reasoning: "Không khớp từ khóa — cần xác nhận thủ công" };
}

function emptyDraft(): InvoiceDraft {
  return {
    serial: "",
    number: "",
    date: "",
    defaultVat: 10,
    seller: { name: "", taxCode: "", address: "" },
    buyer: { name: "", taxCode: "", address: "" },
    subtotal: 0,
    vatAmount: 0,
    totalAmount: 0,
    items: [],
  };
}

function draftFromScanDoc(doc?: AiScanDocument): InvoiceDraft {
  const draft = emptyDraft();
  const extracted = doc?.extractedData;
  if (!extracted || typeof extracted !== "object") return draft;

  const text = (value: unknown): string => typeof value === "string" ? value : "";
  const number = (value: unknown): number => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };
  const party = (value: unknown): InvoiceDraft["seller"] => {
    const fields = value && typeof value === "object" ? value as Record<string, unknown> : {};
    return { name: text(fields.name), taxCode: text(fields.taxCode), address: text(fields.address) };
  };
  const seller = party(extracted.seller);
  seller.name ||= text(extracted.supplierName);
  const scope: ScopeLabel = doc?.documentType === "ELECTRICITY_BILL" ? "Scope 2"
    : doc?.documentType === "FUEL_RECEIPT" ? "Scope 1" : "Scope Unassigned";
  const quantity = number(extracted.quantity);
  const totalAmount = number(extracted.totalAmount);
  const items: LineItem[] = Array.isArray(extracted.items)
    ? extracted.items.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object").map((item, index) => ({
        id: index + 1,
        description: text(item.description),
        unit: text(item.unit),
        quantity: number(item.quantity),
        unitPrice: number(item.unitPrice),
        amount: number(item.amount),
        vatRate: number(item.vatRate),
        scope: item.scope === "Scope 1" || item.scope === "Scope 2" ? item.scope : "Scope Unassigned",
        confidence: number(item.confidence),
        reasoning: text(item.reasoning),
      }))
    : quantity > 0 ? [{
        id: 1,
        description: text(extracted.supplierName) || "Dữ liệu trích xuất từ chứng từ",
        unit: text(extracted.unit),
        quantity,
        unitPrice: totalAmount / quantity,
        amount: totalAmount,
        vatRate: 0,
        scope,
        confidence: number(doc?.confidenceScore),
        reasoning: "Gợi ý theo loại chứng từ; cần kiểm tra trước khi ghi nhận.",
      }] : [];

  return {
    ...draft,
    serial: text(extracted.serial),
    number: text(extracted.number) || text(extracted.invoiceNumber),
    date: text(extracted.date) || (text(extracted.periodEnd) ? new Date(text(extracted.periodEnd)).toLocaleDateString("vi-VN") : ""),
    defaultVat: number(extracted.defaultVat),
    seller,
    buyer: party(extracted.buyer),
    subtotal: number(extracted.subtotal) || items.reduce((sum, item) => sum + item.amount, 0),
    vatAmount: number(extracted.vatAmount),
    totalAmount,
    items,
  };
}

function fmtMoney(n: number) {
  return (Number(n) || 0).toLocaleString("vi-VN");
}

async function copyToClipboard(text: string, message: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(message);
  } catch {
    toast.error("Không thể sao chép. Vui lòng chọn và sao chép thủ công.");
  }
}

export function AiReviewPage() {
  const copy = AI_REVIEW_COPY;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { activeBusinessId } = useBusinessStore();

  const { data: scansData, isLoading: isLoadingList } = useInvoiceScans(
    { businessId: activeBusinessId ?? undefined, limit: 50 },
    Boolean(activeBusinessId),
  );
  const queue = useMemo(
    () => (scansData?.items ?? []).filter((doc) => doc.status !== "COMPLETED" && doc.status !== "CONFIRMED" && doc.status !== "REJECTED"),
    [scansData],
  );

  const [activeId, setActiveId] = useState<string | null>(searchParams.get("id"));
  useEffect(() => {
    setActiveId(searchParams.get("id"));
  }, [searchParams]);
  useEffect(() => {
    if (!activeId && queue.length > 0) setActiveId(queue[0].id);
  }, [queue, activeId]);

  const { data: scanDoc, isLoading: isLoadingDoc, error: scanError } = useInvoiceScanDetail(activeId, Boolean(activeId));

  const { data: originalFile, error: originalFileError } = useQuery({
    queryKey: ["ai-scan", "file", activeId],
    queryFn: () => getInvoiceScanFile(activeId!),
    enabled: Boolean(activeId && scanDoc),
  });
  const [originalFileUrl, setOriginalFileUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!originalFile) { setOriginalFileUrl(null); return; }
    const url = URL.createObjectURL(originalFile.blob);
    setOriginalFileUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [originalFile]);

  const [drafts, setDrafts] = useState<Record<string, InvoiceDraft>>({});
  useEffect(() => {
    if (activeId && scanDoc?.id === activeId && !drafts[activeId] && scanDoc.status !== "QUEUED" && scanDoc.status !== "PROCESSING") {
      setDrafts((prev) => ({ ...prev, [activeId]: draftFromScanDoc(scanDoc) }));
    }
  }, [activeId, scanDoc, drafts]);

  const draft = activeId ? drafts[activeId] : undefined;
  const setDraft = (updater: (prev: InvoiceDraft) => InvoiceDraft) => {
    if (!activeId) return;
    setDrafts((prev) => ({ ...prev, [activeId]: updater(prev[activeId] ?? emptyDraft()) }));
  };

  const [kw1, setKw1] = useState(DEFAULT_KEYWORDS_1);
  const [kw2, setKw2] = useState(DEFAULT_KEYWORDS_2);
  const [jsonTab, setJsonTab] = useState<"active" | "all">("active");

  const { data: branchesData } = useBranches(activeBusinessId);
  const branches = branchesData?.items ?? [];
  const [branchId, setBranchId] = useState<string>("");
  useEffect(() => {
    if (!branchId && branches[0]) setBranchId(branches[0].id);
  }, [branches, branchId]);
  const { role } = useBusinessRole(activeBusinessId ?? "");

  const confirmMutation = useConfirmInvoiceScan();
  const rejectMutation = useRejectInvoiceScan();
  const retryMutation = useRetryInvoiceScan();

  const handleMockExtract = () => {
    if (!activeId) return;
    const queueIdx = queue.findIndex((d) => d.id === activeId);
    const sample = MOCK_SAMPLES[(queueIdx >= 0 ? queueIdx : 0) % MOCK_SAMPLES.length];
    const items: LineItem[] = sample.items.map(([description, unit, unitPrice, vatRate, quantity], idx) => {
      const amount = unitPrice * quantity;
      const c = classify(description, kw1, kw2);
      return { id: idx + 1, description, unit, quantity, unitPrice, amount, vatRate, ...c };
    });
    const subtotal = items.reduce((s, it) => s + it.amount, 0);
    const vatAmount = Math.round(items.reduce((s, it) => s + (it.amount * it.vatRate) / 100, 0));
    setDraft(() => ({
      serial: sample.serial,
      number: sample.number,
      date: sample.date,
      defaultVat: 10,
      seller: { name: sample.seller[0], taxCode: sample.seller[1], address: sample.seller[2] },
      buyer: { name: sample.buyer[0], taxCode: sample.buyer[1], address: sample.buyer[2] },
      subtotal,
      vatAmount,
      totalAmount: subtotal + vatAmount,
      items,
    }));
    toast.success("Đã điền dữ liệu minh hoạ — chỉnh sửa lại cho khớp hóa đơn thật trước khi ghi nhận.");
  };

  const updateItem = (idx: number, patch: Partial<LineItem>) => {
    setDraft((prev) => {
      const items = prev.items.map((it, i) => (i === idx ? { ...it, ...patch } : it));
      return { ...prev, items };
    });
  };

  const handleDescriptionChange = (idx: number, description: string) => {
    const c = classify(description, kw1, kw2);
    updateItem(idx, { description, ...c });
  };

  const handleQtyOrPrice = (idx: number, patch: Partial<Pick<LineItem, "quantity" | "unitPrice">>) => {
    setDraft((prev) => {
      const items = prev.items.map((it, i) => {
        if (i !== idx) return it;
        const next = { ...it, ...patch };
        next.amount = (Number(next.quantity) || 0) * (Number(next.unitPrice) || 0);
        return next;
      });
      return { ...prev, items };
    });
  };

  const addRow = () => {
    setDraft((prev) => {
      const c = classify("", kw1, kw2);
      const nextId = (prev.items.at(-1)?.id ?? 0) + 1;
      return {
        ...prev,
        items: [
          ...prev.items,
          { id: nextId, description: "", unit: "", quantity: 1, unitPrice: 0, amount: 0, vatRate: prev.defaultVat, ...c },
        ],
      };
    });
  };

  const removeRow = (idx: number) => {
    setDraft((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== idx).map((it, i) => ({ ...it, id: i + 1 })) }));
  };

  const reclassifyAll = () => {
    setDraft((prev) => ({ ...prev, items: prev.items.map((it) => ({ ...it, ...classify(it.description, kw1, kw2) })) }));
  };

  const recalcTotals = () => {
    setDraft((prev) => {
      const subtotal = prev.items.reduce((s, it) => s + (Number(it.amount) || 0), 0);
      const vatAmount = Math.round(prev.items.reduce((s, it) => s + ((Number(it.amount) || 0) * (Number(it.vatRate) || 0)) / 100, 0));
      return { ...prev, subtotal, vatAmount, totalAmount: subtotal + vatAmount };
    });
  };

  const scopeSummary = useMemo(() => {
    const sums: Record<ScopeLabel, { amount: number; count: number }> = {
      "Scope 1": { amount: 0, count: 0 },
      "Scope 2": { amount: 0, count: 0 },
      "Scope Unassigned": { amount: 0, count: 0 },
    };
    (draft?.items ?? []).forEach((it) => {
      sums[it.scope].amount += Number(it.amount) || 0;
      sums[it.scope].count += 1;
    });
    return sums;
  }, [draft]);

  const jsonOutput = useMemo(() => {
    if (jsonTab === "all") {
      return queue.map((doc) => ({ fileName: doc.fileName, ...(drafts[doc.id] ?? emptyDraft()) }));
    }
    return draft ? { fileName: scanDoc?.fileName, ...draft } : { message: "Chưa chọn hóa đơn" };
  }, [jsonTab, queue, drafts, draft, scanDoc]);

  const handleReject = async () => {
    if (!activeId) return;
    try {
      await rejectMutation.mutateAsync({ id: activeId, reason: "Người dùng từ chối trích xuất" });
      toast.success("Đã từ chối tài liệu.");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const handleRetry = async () => {
    if (!activeId) return;
    try {
      await retryMutation.mutateAsync(activeId);
      toast.success("Đã gửi yêu cầu trích xuất lại tới mô hình AI.");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const handleConfirm = async (input: CreateActivityDataInput) => {
    if (!activeId || scanDoc?.status !== "NEED_REVIEW") throw new Error("Tài liệu chưa sẵn sàng để ghi nhận.");
    await confirmMutation.mutateAsync({ id: activeId, body: {
      reportingPeriodId: input.reportingPeriodId, branchId: input.branchId,
      emissionSourceId: input.emissionSourceId, quantity: input.quantity, unit: input.unit,
      periodStart: input.periodStart, periodEnd: input.periodEnd,
      metadata: { invoice: draft, scopeSummary }, reviewNotes: "Đã rà soát dữ liệu hoạt động từ chứng từ.",
    }});
    toast.success("Đã lưu hoạt động từ hóa đơn. Gửi duyệt để tính CO₂e.");
    navigate(ROUTES.app.emissionDetail);
  };

  return (
    <div className="space-y-8">
      <AppPageHeader breadcrumbs={copy.breadcrumbs} title="Kiểm tra & Xác nhận Trích xuất" description={copy.description} />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Cột trái: hàng đợi + xem trước + từ khoá Scope */}
        <div className="space-y-6">
          <AppPanel title="Hàng đợi chờ rà soát" bodyClassName="p-0">
            {isLoadingList ? (
              <div className="p-6 text-sm text-muted-foreground">Đang tải…</div>
            ) : queue.length === 0 ? (
              <div className="p-6">
                <EmptyState icon={FileText} title={copy.noQueue} />
              </div>
            ) : (
              <div className="max-h-[360px] space-y-1.5 overflow-y-auto p-3">
                {queue.map((doc) => {
                  const status = STATUS_CONFIG[doc.status] ?? STATUS_CONFIG.FAILED;
                  const StatusIcon = status.icon;
                  const isActive = doc.id === activeId;
                  return (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => setActiveId(doc.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg border p-2.5 text-left transition-all",
                        isActive ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/40",
                      )}
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FileText className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-foreground">{doc.fileName ?? "Tài liệu"}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {(drafts[doc.id]?.items.length ?? 0)} dòng
                        </p>
                      </div>
                      <Badge variant={status.variant} className="gap-1 text-[11px]">
                        <StatusIcon className="size-3" />
                        {status.label}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            )}
          </AppPanel>

          {scanDoc ? (
            <AppPanel title="Tài liệu gốc">
              {originalFileError ? (
                <p className="text-sm text-destructive">{getApiErrorMessage(originalFileError)}</p>
              ) : !originalFileUrl ? (
                <p className="text-sm text-muted-foreground">Đang tải tài liệu gốc…</p>
              ) : scanDoc.mimeType?.startsWith("image/") ? (
                <img src={originalFileUrl ?? undefined} alt={scanDoc.fileName ?? ""} className="w-full rounded-lg border border-border" />
              ) : (
                <a
                  href={originalFileUrl ?? undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 p-4 text-sm font-semibold text-primary hover:underline"
                >
                  <FileText className="size-4" />
                  Mở tệp gốc trong tab mới
                </a>
              )}
            </AppPanel>
          ) : null}

          <AppPanel title="Từ khóa phân Scope">
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-[11px] text-muted-foreground">Từ khóa Scope 1</Label>
                <Input value={kw1} onChange={(e) => setKw1(e.target.value)} className="text-xs" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] text-muted-foreground">Từ khóa Scope 2</Label>
                <Input value={kw2} onChange={(e) => setKw2(e.target.value)} className="text-xs" />
              </div>
              <Button variant="outline" size="sm" onClick={reclassifyAll} className="w-full" disabled={!draft}>
                Áp dụng lại cho hóa đơn này
              </Button>
            </div>
          </AppPanel>
        </div>

        {/* Cột phải: editor */}
        <div className="space-y-6 lg:col-span-2">
          {!activeId || !draft ? (
            <AppPanel>
              <EmptyState icon={Sparkles}
                title={scanError ? "Không thể mở tài liệu" : isLoadingDoc ? "Đang tải dữ liệu trích xuất…" : scanDoc?.status === "QUEUED" || scanDoc?.status === "PROCESSING" ? "Tài liệu đang được xử lý" : "Chưa chọn hóa đơn"}
                description={scanError ? getApiErrorMessage(scanError) : "Chọn hóa đơn trong hàng đợi để rà soát; kết quả sẽ xuất hiện sau khi xử lý xong."}
              />
            </AppPanel>
          ) : (
            <>
              {scanDoc?.status === "NEED_REVIEW" && activeBusinessId && role && role !== "VIEWER" && <div id="invoice-activity"><AppPanel title="Ghi nhận dữ liệu hoạt động" description="Kiểm tra số lượng, đơn vị và nguồn phát thải. Tổng tiền hóa đơn chỉ lưu làm thông tin tham chiếu."><ActivityEntryForm key={activeId} businessId={activeBusinessId} disabled={confirmMutation.isPending} submitLabel="Xác nhận & lưu bản nháp" initial={{quantity: Number(scanDoc.extractedData?.quantity) || undefined, unit: String(scanDoc.extractedData?.unit ?? ""), emissionSourceId: scanDoc.extractedData?._processing?.suggestedEmissionSourceId, periodStart: scanDoc.extractedData?.periodStart, periodEnd: scanDoc.extractedData?.periodEnd, branchId: branchId || undefined}} onSave={handleConfirm} /></AppPanel></div>}
              <AppPanel
                title="Thông tin chung"
                badge={
                  <Button size="sm" variant="outline" onClick={handleMockExtract} className="gap-1.5 text-xs">
                    <Wand2 className="size-3.5" />
                    {copy.mockExtractCta}
                  </Button>
                }
              >
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] text-muted-foreground">Ký hiệu</Label>
                      <Input value={draft.serial} onChange={(e) => setDraft((p) => ({ ...p, serial: e.target.value }))} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] text-muted-foreground">Số hóa đơn</Label>
                      <Input value={draft.number} onChange={(e) => setDraft((p) => ({ ...p, number: e.target.value }))} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] text-muted-foreground">Ngày lập</Label>
                      <Input value={draft.date} onChange={(e) => setDraft((p) => ({ ...p, date: e.target.value }))} placeholder="DD/MM/YYYY" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Building2 className="size-3.5" />
                        Chi nhánh áp dụng
                      </Label>
                      <select
                        value={branchId}
                        onChange={(e) => setBranchId(e.target.value)}
                        className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="">— Chọn chi nhánh —</option>
                        {branches.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-border bg-muted/10 p-3 space-y-2">
                      <h4 className="text-[11px] font-bold uppercase tracking-wide text-primary">Bên bán</h4>
                      <Input
                        value={draft.seller.name}
                        onChange={(e) => setDraft((p) => ({ ...p, seller: { ...p.seller, name: e.target.value } }))}
                        placeholder="Tên công ty"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={draft.seller.taxCode}
                          onChange={(e) => setDraft((p) => ({ ...p, seller: { ...p.seller, taxCode: e.target.value } }))}
                          placeholder="MST"
                        />
                        <Input
                          value={draft.seller.address}
                          onChange={(e) => setDraft((p) => ({ ...p, seller: { ...p.seller, address: e.target.value } }))}
                          placeholder="Địa chỉ"
                        />
                      </div>
                    </div>
                    <div className="rounded-lg border border-border bg-muted/10 p-3 space-y-2">
                      <h4 className="text-[11px] font-bold uppercase tracking-wide text-primary">Bên mua</h4>
                      <Input
                        value={draft.buyer.name}
                        onChange={(e) => setDraft((p) => ({ ...p, buyer: { ...p.buyer, name: e.target.value } }))}
                        placeholder="Tên công ty"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={draft.buyer.taxCode}
                          onChange={(e) => setDraft((p) => ({ ...p, buyer: { ...p.buyer, taxCode: e.target.value } }))}
                          placeholder="MST"
                        />
                        <Input
                          value={draft.buyer.address}
                          onChange={(e) => setDraft((p) => ({ ...p, buyer: { ...p.buyer, address: e.target.value } }))}
                          placeholder="Địa chỉ"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] text-muted-foreground">Tổng tiền hàng</Label>
                      <Input value={fmtMoney(draft.subtotal)} disabled />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] text-muted-foreground">Tiền thuế GTGT</Label>
                      <Input value={fmtMoney(draft.vatAmount)} disabled />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] text-muted-foreground">Tổng thanh toán</Label>
                      <Input value={fmtMoney(draft.totalAmount)} disabled className="font-bold" />
                    </div>
                  </div>
                </div>
              </AppPanel>

              <AppPanel
                title="Hàng hóa / dịch vụ"
                badge={
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={addRow} className="gap-1 text-xs">
                      <Plus className="size-3.5" />
                      Thêm dòng
                    </Button>
                    <Button size="sm" variant="outline" onClick={recalcTotals} className="gap-1 text-xs">
                      Tính lại tổng
                    </Button>
                  </div>
                }
                bodyClassName="p-0"
              >
                {draft.items.length === 0 ? (
                  <div className="p-6">
                    <EmptyState title="Chưa có dòng nào" description={`Bấm "${copy.mockExtractCta}" hoặc "Thêm dòng".`} />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[860px] text-left text-xs">
                      <thead className="border-b border-border bg-muted/50">
                        <tr>
                          <th className="px-3 py-2.5 font-bold uppercase tracking-wide text-muted-foreground">#</th>
                          <th className="px-3 py-2.5 font-bold uppercase tracking-wide text-muted-foreground">Tên hàng / dịch vụ</th>
                          <th className="px-3 py-2.5 font-bold uppercase tracking-wide text-muted-foreground">ĐVT</th>
                          <th className="px-3 py-2.5 font-bold uppercase tracking-wide text-muted-foreground">SL</th>
                          <th className="px-3 py-2.5 font-bold uppercase tracking-wide text-muted-foreground">Đơn giá</th>
                          <th className="px-3 py-2.5 font-bold uppercase tracking-wide text-muted-foreground">VAT%</th>
                          <th className="px-3 py-2.5 font-bold uppercase tracking-wide text-muted-foreground">Scope</th>
                          <th className="px-3 py-2.5" />
                        </tr>
                      </thead>
                      <tbody>
                        {draft.items.map((it, idx) => (
                          <tr key={it.id} className="border-b border-border last:border-0">
                            <td className="px-3 py-2 text-center font-semibold text-muted-foreground">{it.id}</td>
                            <td className="px-3 py-2 min-w-[220px]">
                              <Input
                                value={it.description}
                                onChange={(e) => handleDescriptionChange(idx, e.target.value)}
                                placeholder="Tên hàng / dịch vụ"
                                className="h-8 text-xs"
                              />
                              <p className="mt-1 text-[11px] text-muted-foreground">
                                {it.reasoning} · tin cậy {it.confidence.toFixed(2)}
                              </p>
                            </td>
                            <td className="px-3 py-2">
                              <Input
                                value={it.unit}
                                onChange={(e) => updateItem(idx, { unit: e.target.value })}
                                className="h-8 w-20 text-xs"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <Input
                                type="number"
                                value={it.quantity}
                                onChange={(e) => handleQtyOrPrice(idx, { quantity: Number(e.target.value) || 0 })}
                                className="h-8 w-20 text-xs"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <Input
                                type="number"
                                value={it.unitPrice}
                                onChange={(e) => handleQtyOrPrice(idx, { unitPrice: Number(e.target.value) || 0 })}
                                className="h-8 w-28 text-xs"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <Input
                                type="number"
                                value={it.vatRate}
                                onChange={(e) => updateItem(idx, { vatRate: Number(e.target.value) || 0 })}
                                className="h-8 w-16 text-xs"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <select
                                value={it.scope}
                                onChange={(e) =>
                                  updateItem(idx, {
                                    scope: e.target.value as ScopeLabel,
                                    confidence: 1,
                                    reasoning: "Điều chỉnh thủ công",
                                  })
                                }
                                className="h-8 w-full rounded-md border border-input bg-transparent px-2 text-xs outline-none"
                              >
                                <option>Scope 1</option>
                                <option>Scope 2</option>
                                <option>Scope Unassigned</option>
                              </select>
                            </td>
                            <td className="px-3 py-2 text-right">
                              <Button variant="ghost" size="icon-sm" onClick={() => removeRow(idx)}>
                                <Trash2 className="size-3.5 text-muted-foreground" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </AppPanel>

              <div className="grid gap-3 sm:grid-cols-3">
                {(["Scope 1", "Scope 2", "Scope Unassigned"] as const).map((scope) => (
                  <div key={scope} className="rounded-xl border border-border bg-card p-3">
                    <h4 className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{scope}</h4>
                    <p className="mt-1 text-lg font-bold text-foreground">{fmtMoney(scopeSummary[scope].amount)} ₫</p>
                    <p className="text-[11px] text-muted-foreground">{scopeSummary[scope].count} mục</p>
                  </div>
                ))}
              </div>

              <AppPanel
                title="JSON xuất ra"
                badge={
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setJsonTab("active")}
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[11px] font-bold",
                        jsonTab === "active" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                      )}
                    >
                      Hóa đơn này
                    </button>
                    <button
                      type="button"
                      onClick={() => setJsonTab("all")}
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[11px] font-bold",
                        jsonTab === "all" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                      )}
                    >
                      Cả hàng đợi
                    </button>
                  </div>
                }
              >
                <div className="space-y-3">
                  <pre className="max-h-64 overflow-auto rounded-lg bg-[#0F1F3C] p-4 text-[11px] leading-relaxed text-[#C8D6F0]">
                    {JSON.stringify(jsonOutput, null, 2)}
                  </pre>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(JSON.stringify(jsonOutput, null, 2), "Đã sao chép JSON")}
                      className="gap-1.5"
                    >
                      <Copy className="size-3.5" />
                      Copy JSON
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const blob = new Blob([JSON.stringify(jsonOutput, null, 2)], { type: "application/json" });
                        const a = document.createElement("a");
                        a.href = URL.createObjectURL(blob);
                        a.download = `hoa-don_${draft.number || "export"}.json`;
                        a.click();
                        URL.revokeObjectURL(a.href);
                      }}
                      className="gap-1.5"
                    >
                      <Download className="size-3.5" />
                      Tải .json
                    </Button>
                  </div>
                </div>
              </AppPanel>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                <div className="flex gap-2">
                  <Button asChild variant="outline" className="gap-1.5">
                    <Link to={ROUTES.app.uploadDoc}>
                      <ArrowLeft className="size-4" />
                      Tải tài liệu khác
                    </Link>
                  </Button>
                  <Button variant="outline" onClick={handleRetry} disabled={retryMutation.isPending} className="gap-1.5">
                    {retryMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
                    Trích xuất lại AI
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleReject}
                    disabled={rejectMutation.isPending}
                    className="gap-1.5 text-destructive hover:bg-destructive/10"
                  >
                    {rejectMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <XCircle className="size-4" />}
                    Từ chối
                  </Button>
                </div>

                <Button
                  onClick={() => document.getElementById("invoice-activity")?.scrollIntoView({ behavior: "smooth" })}
                  disabled={confirmMutation.isPending || isLoadingDoc || scanDoc?.status !== "NEED_REVIEW" || role === "VIEWER"}
                  className="gap-1.5 bg-accent text-accent-foreground font-bold hover:bg-accent/90 shadow-md px-6"
                >
                  {confirmMutation.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Check className="size-4" />
                  )}
                  {copy.confirmCta}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
