import { DateInput } from "@/shared/components/ui/date-input";
import { formatDate } from "@/shared/lib/date-format";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AppPageHeader } from "@/features/app/components/app-page-header";
import { AppPanel } from "@/features/app/components/app-panel";
import { useReportingPeriods } from "@/features/app/hooks/use-app-meta";
import {
  useReports,
  useCreateReport,
  useDownloadReport,
  useGenerateReport,
} from "@/features/app/hooks/use-reports";
import {
  createReportingPeriod,
  closeReportingPeriod,
  reopenReportingPeriod,
} from "@/features/app/api/meta.api";
import { useBusinessRole } from "@/features/businesses/hooks/use-business-role";
import { useBusinessStore } from "@/shared/stores/business-store";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import type { ReportFormat, ReportType } from "@/features/app/types/app.types";
const reportTypes: Record<ReportType, string> = {
  MONTHLY_EMISSION: "Phát thải tháng",
  QUARTERLY_EMISSION: "Phát thải quý",
  YEARLY_EMISSION: "Phát thải năm",
  ESG_BASIC: "ESG cơ bản",
  BRANCH_COMPARISON: "So sánh chi nhánh",
  ECO_SCORE: "Eco Score",
  TARGET_PROGRESS: "Tiến độ mục tiêu",
};
const statusLabels = {
  QUEUED: "Trong hàng đợi",
  GENERATING: "Đang tạo",
  COMPLETED: "Sẵn sàng tải",
  FAILED: "Tạo thất bại",
};
const selectClass = "h-10 w-full rounded-md border bg-background px-3";
export function ReportsPage() {
  const { activeBusinessId } = useBusinessStore();
  const { role } = useBusinessRole(activeBusinessId ?? "");
  const canManage = role === "COMPANY_ADMIN" || role === "SYSTEM_ADMIN";
  const periods = useReportingPeriods(activeBusinessId);
  const reports = useReports(activeBusinessId);
  const create = useCreateReport();
  const download = useDownloadReport();
  const regenerate = useGenerateReport();
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [periodId, setPeriodId] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState<ReportType>("MONTHLY_EMISSION");
  const [format, setFormat] = useState<ReportFormat>("PDF");
  const [busy, setBusy] = useState(false);
  const [closingId, setClosingId] = useState<string | null>(null);
  useEffect(() => {
    setPeriodId("");
    setClosingId(null);
  }, [activeBusinessId]);
  async function run(fn: () => Promise<unknown>, message: string) {
    setBusy(true);
    try {
      await fn();
      await qc.invalidateQueries({
        queryKey: ["meta", "periods", activeBusinessId],
      });
      toast.success(message);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Thao tác thất bại.");
    } finally {
      setBusy(false);
    }
  }
  async function newPeriod(e: FormEvent) {
    e.preventDefault();
    if (!activeBusinessId) return;
    await run(async () => {
      await createReportingPeriod({
        businessId: activeBusinessId,
        name,
        startDate: start + "T00:00:00.000Z",
        endDate: end + "T23:59:59.000Z",
      });
      setName("");
    }, "Đã tạo kỳ báo cáo đang mở.");
  }
  async function newReport(e: FormEvent) {
    e.preventDefault();
    if (!activeBusinessId) return;
    try {
      await create.mutateAsync({
        businessId: activeBusinessId,
        reportingPeriodId: periodId,
        title,
        type,
        format,
      });
      toast.success(
        "Báo cáo đã vào hàng đợi. Danh sách tự cập nhật khi hoàn tất.",
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Không thể tạo báo cáo.");
    }
  }
  return (
    <div className="space-y-6">
      <AppPageHeader
        title="Kỳ báo cáo & Báo cáo"
        description="Kiểm tra dữ liệu, hoàn tất kỳ kiểm kê và xuất báo cáo phát thải."
      />
      {periods.error && (
        <p role="alert" className="text-destructive">
          {periods.error.message}
        </p>
      )}
      <AppPanel title="Kỳ báo cáo">
        <div className="space-y-4">
          {periods.data?.items.map((p) => (
            <div
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/80 bg-muted/20 p-4"
            >
              <div>
                <p className="font-semibold">{p.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(p.startDate)} - {formatDate(p.endDate)} ·{" "}
                  {p.status === "OPEN"
                    ? "Đang mở"
                    : p.status === "CLOSED"
                      ? "Đã đóng"
                      : "Đã khóa"}
                </p>
              </div>
              {canManage && p.status === "OPEN" && (
                <Button
                  variant="outline"
                  disabled={busy}
                  onClick={() => setClosingId(p.id)}
                >
                  Đóng kỳ
                </Button>
              )}
              {canManage && p.status === "CLOSED" && (
                <Button
                  variant="outline"
                  disabled={busy}
                  onClick={() =>
                    run(
                      () => reopenReportingPeriod(p.id),
                      "Đã mở lại kỳ báo cáo.",
                    )
                  }
                >
                  Mở lại kỳ
                </Button>
              )}
            </div>
          ))}
          {periods.data?.items.length === 0 && <p>Chưa có kỳ báo cáo.</p>}
          {closingId && (
            <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
              <p>
                Đóng kỳ sẽ chặn sửa dữ liệu hoạt động trong kỳ. Chỉ đóng khi các
                bản ghi đã được xử lý đầy đủ; quản trị doanh nghiệp có thể mở
                lại kỳ.
              </p>
              <div className="flex gap-2">
                <Button
                  disabled={busy}
                  onClick={() =>
                    run(async () => {
                      await closeReportingPeriod(closingId);
                      setClosingId(null);
                    }, "Đã đóng kỳ; có thể tính Eco Score và tạo báo cáo.")
                  }
                >
                  Xác nhận đóng kỳ
                </Button>
                <Button variant="outline" onClick={() => setClosingId(null)}>
                  Hủy
                </Button>
              </div>
            </div>
          )}
        </div>
        {canManage && (
          <form
            className="mt-6 grid gap-4 rounded-xl border border-border bg-muted/20 p-5 sm:grid-cols-2 lg:grid-cols-4"
            onSubmit={newPeriod}
          >
            <div>
              <Label htmlFor="period-name">Tên kỳ</Label>
              <Input
                id="period-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Tháng 10/2026"
              />
            </div>
            <div>
              <Label htmlFor="period-start">Từ ngày</Label>
              <DateInput
                id="period-start"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="period-end">Đến ngày</Label>
              <DateInput
                id="period-end"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                required
              />
            </div>
            <Button className="self-end" disabled={busy}>
              Tạo kỳ
            </Button>
          </form>
        )}
      </AppPanel>
      {canManage && (
        <AppPanel title="Tạo báo cáo">
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={newReport}>
            <div>
              <Label htmlFor="report-period">Kỳ đã đóng</Label>
              <select
                id="report-period"
                className={selectClass}
                value={periodId}
                onChange={(e) => setPeriodId(e.target.value)}
                required
              >
                <option value="">Chọn kỳ đã đóng</option>
                {periods.data?.items
                  .filter((p) => p.status === "CLOSED")
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <Label htmlFor="report-title">Tên báo cáo</Label>
              <Input
                id="report-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={200}
              />
            </div>
            <div>
              <Label htmlFor="report-type">Loại báo cáo</Label>
              <select
                id="report-type"
                className={selectClass}
                value={type}
                onChange={(e) => setType(e.target.value as ReportType)}
              >
                {Object.entries(reportTypes).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="report-format">Định dạng</Label>
              <select
                id="report-format"
                className={selectClass}
                value={format}
                onChange={(e) => setFormat(e.target.value as ReportFormat)}
              >
                {["PDF", "XLSX", "CSV", "JSON"].map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </div>
            <Button disabled={create.isPending || !periodId}>
              {create.isPending ? "Đang gửi…" : "Tạo báo cáo"}
            </Button>
          </form>
        </AppPanel>
      )}
      <AppPanel title="Báo cáo đã tạo">
        {reports.isLoading && <p>Đang tải…</p>}
        {reports.error && (
          <p role="alert" className="text-destructive">
            {reports.error.message}
          </p>
        )}
        {reports.data?.items.length === 0 && <p>Chưa có báo cáo.</p>}
        <div className="space-y-4">
          {reports.data?.items.map((r) => (
            <div
              key={r.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/80 bg-muted/20 p-4"
            >
              <div>
                <p className="font-semibold">{r.title}</p>
                <p className="text-sm text-muted-foreground">
                  {reportTypes[r.type] ?? r.type} ·{" "}
                  {statusLabels[r.status] ?? r.status}
                </p>
                {r.errorMessage && (
                  <p className="text-sm text-destructive">{r.errorMessage}</p>
                )}
              </div>
              <div className="flex gap-2">
                {r.status === "COMPLETED" && (
                  <Button
                    disabled={download.isPending}
                    onClick={() =>
                      download.mutate(
                        { id: r.id },
                        { onError: (e) => toast.error(e.message) },
                      )
                    }
                  >
                    Tải báo cáo
                  </Button>
                )}
                {canManage && r.status === "FAILED" && (
                  <Button
                    variant="outline"
                    disabled={regenerate.isPending}
                    onClick={() =>
                      regenerate.mutate(r.id, {
                        onError: (e) => toast.error(e.message),
                      })
                    }
                  >
                    Tạo lại
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </AppPanel>
    </div>
  );
}
