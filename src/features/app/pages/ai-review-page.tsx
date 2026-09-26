import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import {
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  FileText,
  Edit3,
  RefreshCw,
  XCircle,
  Building2,
  Calendar,
  Zap,
  Loader2,
} from "lucide-react";
import { AppPageHeader } from "@/features/app/components/app-page-header";
import { AppPanel } from "@/features/app/components/app-panel";
import { AI_REVIEW_COPY } from "@/features/app/constants/app-copy";
import {
  useConfirmInvoiceScan,
  useInvoiceScanDetail,
  useRejectInvoiceScan,
  useRetryInvoiceScan,
} from "@/features/app/hooks/use-ai-scan";
import { useBranches, useEmissionSources, useReportingPeriods } from "@/features/app/hooks/use-app-meta";
import { createReportingPeriod } from "@/features/app/api/meta.api";
import { useBusinessStore } from "@/shared/stores/business-store";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/lib/utils";

export function AiReviewPage() {
  const copy = AI_REVIEW_COPY;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const docId = searchParams.get("id");
  const { activeBusinessId } = useBusinessStore();

  const { data: scanDoc, isLoading: isLoadingDoc } = useInvoiceScanDetail(docId, !!docId);
  const { data: branchesData } = useBranches(activeBusinessId);
  const { data: periodsData } = useReportingPeriods(activeBusinessId);
  const { data: sourcesData } = useEmissionSources();

  const confirmMutation = useConfirmInvoiceScan();
  const rejectMutation = useRejectInvoiceScan();
  const retryMutation = useRetryInvoiceScan();

  // State chỉnh sửa số liệu
  const [docType, setDocType] = useState("Hóa đơn tiện ích (Điện)");
  const [period, setPeriod] = useState("Tháng 6 2026");
  const [branch, setBranch] = useState("Quận 1 - Trụ sở chính");
  const [electricityKwh, setElectricityKwh] = useState("1500");
  const [totalCost, setTotalCost] = useState("13,072,500 ₫");
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isVerified, setIsVerified] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Pre-fill từ dữ liệu bóc tách của API nếu có
  useEffect(() => {
    if (scanDoc) {
      if (scanDoc.fileName) setDocType(`Hóa đơn: ${scanDoc.fileName}`);
      const extracted = scanDoc.extractedData as any;
      if (extracted) {
        if (extracted.quantity) setElectricityKwh(String(extracted.quantity));
        if (extracted.totalAmount) {
          setTotalCost(`${Number(extracted.totalAmount).toLocaleString("vi-VN")} ₫`);
        }
        if (extracted.periodStart && extracted.periodEnd) {
          const d = new Date(extracted.periodStart);
          setPeriod(`Tháng ${d.getMonth() + 1}/${d.getFullYear()}`);
        }
      }
      if (scanDoc.status === "CONFIRMED") setIsVerified(true);
    }
  }, [scanDoc]);

  const handleVerify = () => {
    setIsVerified(true);
    toast.success("Đã xác nhận dữ liệu trích xuất hợp lệ!");
  };

  const handleReject = async () => {
    if (!docId) {
      toast.info("Đã từ chối chứng từ.");
      return;
    }
    try {
      await rejectMutation.mutateAsync({ id: docId, reason: "Người dùng từ chối trích xuất" });
      toast.success("Đã từ chối tài liệu trích xuất.");
      navigate(ROUTES.app.uploadDoc);
    } catch (err: any) {
      toast.error(err?.message || "Không thể từ chối tài liệu");
    }
  };

  const handleReExtract = async () => {
    if (!docId) {
      toast.info("Chưa có ID tài liệu để gửi lại");
      return;
    }
    try {
      await retryMutation.mutateAsync(docId);
      toast.success("Đã gửi yêu cầu bóc tách lại tới mô hình AI!");
    } catch (err: any) {
      toast.error(err?.message || "Không thể gửi yêu cầu trích xuất lại");
    }
  };

  const handleProceedToCalculation = async () => {
    if (!docId) {
      toast.success("Đã ghi nhận dữ liệu vào sổ cái carbon! Đang tải bảng tính toán...");
      setTimeout(() => navigate(ROUTES.app.emissionDetail), 500);
      return;
    }

    toast.loading("Đang xác nhận hóa đơn và ghi nhận phát thải...", { id: "confirm-toast" });

    try {
      // 1. Tìm hoặc tạo kỳ báo cáo
      let periodId = periodsData?.items?.[0]?.id;
      if (!periodId && activeBusinessId) {
        const newPeriod = await createReportingPeriod({
          businessId: activeBusinessId,
          name: "Năm 2026",
          startDate: new Date("2026-01-01T00:00:00.000Z").toISOString(),
          endDate: new Date("2026-12-31T23:59:59.000Z").toISOString(),
        });
        periodId = newPeriod.id;
      }

      const branchId = branchesData?.items?.[0]?.id;
      const sources = sourcesData?.items ?? [];
      const elecSource = sources.find((s) => s.code.toLowerCase().includes("elec") || s.name.toLowerCase().includes("điện"));

      const now = new Date();
      const periodStart = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1)).toISOString();
      const periodEnd = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)).toISOString();

      await confirmMutation.mutateAsync({
        id: docId,
        body: {
          reportingPeriodId: periodId!,
          branchId,
          emissionSourceId: elecSource?.id,
          quantity: parseFloat(electricityKwh) || 1500,
          unit: "kWh",
          periodStart,
          periodEnd,
          reviewNotes: "Đã duyệt và xác nhận từ màn hình AI Review",
        },
      });

      toast.success("Xác nhận hóa đơn và ghi nhận phát thải thành công!", { id: "confirm-toast" });
      setTimeout(() => navigate(ROUTES.app.emissionDetail), 500);
    } catch (err: any) {
      toast.error(err?.message || "Không thể xác nhận hóa đơn", { id: "confirm-toast" });
    }
  };


  return (
    <div className="space-y-8">
      <AppPageHeader
        breadcrumbs={copy.breadcrumbs}
        title="Kiểm tra & Xác nhận Trích xuất AI"
        description={copy.description}
      />

      {/* Thanh tiến trình luồng xử lý */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-500 text-white font-bold text-sm shadow-md">
              <CheckCircle2 className="size-5" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Bước 1: Hoàn thành</p>
              <h2 className="text-sm font-bold text-secondary-foreground">Tải lên chứng từ hoa-don-dien-t6.pdf</h2>
            </div>
          </div>

          <div className="hidden h-px flex-1 bg-border md:block mx-4" />

          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md">
              2
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary">Bước 2 / 3</p>
              <h2 className="text-sm font-bold text-secondary-foreground">AI Trích xuất & Xác nhận</h2>
            </div>
          </div>

          <div className="hidden h-px flex-1 bg-border md:block mx-4" />

          <div className="flex items-center gap-3 opacity-60">
            <span className="flex size-9 items-center justify-center rounded-xl bg-muted text-muted-foreground font-bold text-sm">
              3
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Bước 3</p>
              <h2 className="text-sm font-bold text-muted-foreground">Tính toán lượng CO₂e</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Cột trái: Trình xem Hóa đơn Scan & OCR Highlighting */}
        <AppPanel bodyClassName="space-y-4" className="flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <FileText className="size-5 text-primary" />
              <div>
                <h3 className="text-sm font-bold text-secondary-foreground flex items-center gap-2">
                  Tài liệu scan: {scanDoc?.fileName ?? "hoa-don-dien-t6.pdf"}
                  {isLoadingDoc && <Loader2 className="size-3.5 animate-spin text-primary" />}
                </h3>
                <p className="text-[11px] text-muted-foreground">Tải lên 14/06/2026 • 2.4 MB</p>
              </div>
            </div>

            <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-1">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setZoomLevel((z) => Math.max(z - 10, 80))}
                title="Thu nhỏ"
              >
                <ZoomOut className="size-3.5" />
              </Button>
              <span className="px-2 text-xs font-bold text-muted-foreground">{zoomLevel}%</span>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setZoomLevel((z) => Math.min(z + 10, 150))}
                title="Phóng to"
              >
                <ZoomIn className="size-3.5" />
              </Button>
              <Button variant="ghost" size="icon-sm" title="Xoay">
                <RotateCw className="size-3.5" />
              </Button>
            </div>
          </div>

          {/* Bản xem trước Hóa đơn điện mô phỏng */}
          <div className="overflow-hidden rounded-xl border border-border bg-slate-900/5 p-4 transition-all">
            <div
              className="mx-auto rounded-lg border border-border bg-card p-6 shadow-md transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
            >
              {/* Header Hóa đơn EVN */}
              <div className="flex items-start justify-between border-b border-border pb-4">
                <div>
                  <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase">
                    Hóa đơn giá trị gia tăng (GTGT)
                  </span>
                  <h4 className="mt-2 text-base font-bold text-secondary-foreground">TỔNG CÔNG TY ĐIỆN LỰC TP.HCM</h4>
                  <p className="text-xs text-muted-foreground">Công ty Điện lực Quận 1 • Mã ĐL: EVN-HCM-Q1</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-muted-foreground">Kỳ: 06/2026</p>
                  <p className="text-xs text-muted-foreground">Mẫu số: 01GTKT0/001</p>
                </div>
              </div>

              {/* Thông tin khách hàng */}
              <div className="mt-4 grid gap-2 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Tên khách hàng:</span>
                  <span className="font-semibold text-foreground">Northstar Foods - Trụ sở chính</span>
                </div>
                <div className="flex justify-between">
                  <span>Mã số đồng hồ:</span>
                  <span className="font-semibold text-foreground">PE0100029381</span>
                </div>
                <div className="flex justify-between">
                  <span>Địa chỉ sử dụng:</span>
                  <span className="font-semibold text-foreground">Đường Nguyễn Thị Minh Khai, Quận 1</span>
                </div>
              </div>

              {/* Bảng số liệu - Highlighted AI Bounding Box */}
              <div className="mt-6 space-y-3">
                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                  Chi tiết điện năng tiêu thụ
                </p>

                <div className="relative rounded-lg border-2 border-amber-500 bg-amber-500/10 p-3">
                  <div className="absolute -top-3 right-3 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm flex items-center gap-1">
                    <Sparkles className="size-3" />
                    AI Bóc tách - Cần xác minh
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-secondary-foreground flex items-center gap-1.5">
                      <Zap className="size-4 text-amber-600" />
                      Sản lượng điện tiêu thụ:
                    </span>
                    <span className="text-lg font-black text-amber-700">1,500 kWh</span>
                  </div>
                  <p className="mt-1 text-[11px] text-amber-800">
                    Chỉ số cũ: 42,300 • Chỉ số mới: 43,800
                  </p>
                </div>
              </div>

              {/* Tổng tiền */}
              <div className="mt-6 space-y-1.5 border-t border-border pt-4 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Tiền điện chưa thuế:</span>
                  <span>12,450,000 ₫</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Thuế GTGT (5%):</span>
                  <span>622,500 ₫</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-foreground pt-1 border-t border-border/50">
                  <span>Tổng tiền thanh toán:</span>
                  <span className="text-emerald-600">13,072,500 ₫</span>
                </div>
              </div>
            </div>
          </div>
        </AppPanel>

        {/* Cột phải: Bảng Kiểm tra & Chỉnh sửa Dữ liệu Trích xuất */}
        <AppPanel bodyClassName="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-500/20">
                <Sparkles className="size-3.5" />
                Độ tin cậy trích xuất AI: 92% (Rất cao)
              </span>
              <h3 className="mt-2 text-base font-bold text-secondary-foreground">
                Kết quả bóc tách tự động
              </h3>
            </div>

            {isVerified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
                <CheckCircle2 className="size-3.5" />
                Đã xác nhận
              </span>
            ) : null}
          </div>

          {/* Cảnh báo biến động bất thường */}
          <div className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-500/10 p-4 text-xs text-amber-900 leading-relaxed">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" />
            <div>
              <p className="font-bold text-amber-950 flex items-center gap-1.5">
                Cảnh báo kiểm tra thủ công (Anomaly Detection)
              </p>
              <p className="mt-0.5 text-amber-900">
                {copy.warning}. Vui lòng đối chiếu với hóa đơn bên trái và xác nhận số liệu.
              </p>
            </div>
          </div>

          {/* Form Các Trường Dữ Liệu */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-1">
                <FileText className="size-3" />
                Loại tài liệu
              </Label>
              <Input
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="bg-muted/50 font-medium"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-1">
                  <Calendar className="size-3" />
                  Kỳ hóa đơn
                </Label>
                <Input
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="bg-muted/50 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-1">
                  <Building2 className="size-3" />
                  Chi nhánh áp dụng
                </Label>
                <Input
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="bg-muted/50 font-medium"
                />
              </div>
            </div>

            {/* Trường Cảnh Báo Sản Lượng */}
            <div className="space-y-1.5 rounded-xl border border-amber-400 bg-amber-50/50 p-3">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] font-bold tracking-widest text-amber-900 uppercase flex items-center gap-1">
                  <Zap className="size-3 text-amber-600" />
                  Sản lượng tiêu thụ điện (kWh) *
                </Label>
                <span className="text-[10px] font-semibold text-amber-700">Giá trị trung bình: 1,320 kWh</span>
              </div>
              <Input
                type="number"
                value={electricityKwh}
                onChange={(e) => setElectricityKwh(e.target.value)}
                className="border-amber-400 bg-white text-base font-bold text-amber-950 focus:border-amber-600"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Tổng tiền thanh toán (VNĐ)
              </Label>
              <Input
                value={totalCost}
                onChange={(e) => setTotalCost(e.target.value)}
                className="bg-muted/50 font-medium"
              />
            </div>
          </div>

          {/* Các nút thao tác trích xuất */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
            <Button
              type="button"
              onClick={handleVerify}
              className={cn(
                "font-bold shadow-sm transition-all",
                isVerified
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-primary text-primary-foreground hover:bg-primary/95",
              )}
            >
              <CheckCircle2 className="size-4" />
              {isVerified ? "Đã xác nhận dữ liệu" : "Xác nhận dữ liệu này"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
              className="gap-1.5"
            >
              <Edit3 className="size-4" />
              Chỉnh sửa
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleReExtract}
              className="gap-1.5"
            >
              <RefreshCw className="size-4" />
              Trích xuất lại AI
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={handleReject}
              disabled={rejectMutation.isPending}
              className="text-destructive hover:bg-destructive/10"
            >
              {rejectMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <XCircle className="size-4" />}
              Từ chối
            </Button>
          </div>
        </AppPanel>
      </div>

      {/* Điều hướng cuối trang */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-border">
        <Button asChild variant="outline">
          <Link to={ROUTES.app.uploadDoc} className="flex items-center gap-2">
            <ArrowLeft className="size-4" />
            Tải tài liệu khác
          </Link>
        </Button>

        <Button
          onClick={handleProceedToCalculation}
          disabled={confirmMutation.isPending}
          className="bg-accent text-accent-foreground font-bold hover:bg-accent/90 shadow-md px-6 py-5 text-base flex items-center gap-2"
        >
          {confirmMutation.isPending ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Đang xác nhận & chuyển đổi...
            </>
          ) : (
            <>
              {copy.calculateCta}
              <ArrowRight className="size-5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
