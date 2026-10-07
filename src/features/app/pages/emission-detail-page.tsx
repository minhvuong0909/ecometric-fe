import { formatDate } from "@/shared/lib/date-format";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import { toast } from "sonner";
import { AppPageHeader } from "@/features/app/components/app-page-header";
import { AppPanel } from "@/features/app/components/app-panel";
import { ActivityEntryForm } from "@/features/app/components/activity-entry-form";
import { useActivityDataList } from "@/features/app/hooks/use-activity-data";
import { useReportingPeriods } from "@/features/app/hooks/use-app-meta";
import { useDashboardSummary } from "@/features/app/hooks/use-dashboard";
import {
  confirmActivityData,
  submitActivityData,
  rejectActivityData,
  updateActivityData,
} from "@/features/app/api/activity-data.api";
import {
  getEmissionResult,
  recalculateEmission,
} from "@/features/app/api/emission-calculation.api";
import { useBusinessRole } from "@/features/businesses/hooks/use-business-role";
import { useBusinessStore } from "@/shared/stores/business-store";
import { ApiError } from "@/shared/lib/api-client";
import { Button } from "@/shared/components/ui/button";
import { ROUTES } from "@/shared/constants/routes";
import type { ActivityRecord } from "@/features/app/types/app.types";
const STATUS_LABELS = {
  DRAFT: "Bản nháp",
  PENDING_REVIEW: "Chờ duyệt",
  CONFIRMED: "Đã duyệt",
  REJECTED: "Bị từ chối",
  ARCHIVED: "Lưu trữ",
};
function ActivityRow({
  record,
  canWrite,
  canReview,
  canEdit,
  mutable,
}: {
  record: ActivityRecord;
  canWrite: boolean;
  canReview: boolean;
  canEdit: boolean;
  mutable: boolean;
}) {
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const result = useQuery({
    queryKey: ["emission-result", record.id],
    enabled: record.status === "CONFIRMED",
    retry: false,
    queryFn: async () => {
      try {
        return await getEmissionResult(record.id);
      } catch (e) {
        if (e instanceof ApiError && e.status === 404) return null;
        throw e;
      }
    },
  });
  async function refresh() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["activity-data"] }),
      queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
      queryClient.invalidateQueries({
        queryKey: ["emission-result", record.id],
      }),
    ]);
  }
  async function action(fn: () => Promise<unknown>, message: string) {
    setBusy(true);
    try {
      await fn();
      await refresh();
      toast.success(message);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Thao tác thất bại.");
    } finally {
      setBusy(false);
    }
  }
  const editable =
    mutable &&
    canEdit &&
    (record.status === "DRAFT" || record.status === "REJECTED");
  return (
    <AppPanel
      title={record.emissionSource?.name ?? "Hoạt động chưa có nguồn phát thải"}
      description={`${record.branch?.name ?? "Toàn doanh nghiệp"} · ${formatDate(record.periodStart)} - ${formatDate(record.periodEnd)}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-semibold">
            {Number(record.quantity).toLocaleString("vi-VN")} {record.unit}
          </p>
          <p className="text-sm text-muted-foreground">
            {STATUS_LABELS[record.status]} ·{" "}
            {record.emissionSource?.defaultScope?.replace("SCOPE_", "Scope ") ??
              "Chưa phân Scope"}
          </p>
          {record.rejectReason && (
            <p className="text-sm text-destructive">{record.rejectReason}</p>
          )}
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-primary">
            {result.data
              ? `${(Number(result.data.co2eKg) / 1000).toLocaleString("vi-VN", { maximumFractionDigits: 6 })} tCO₂e`
              : record.status === "CONFIRMED"
                ? result.isLoading
                  ? "Đang tải…"
                  : "Chưa có kết quả"
                : "Chưa tính CO₂e"}
          </p>
          {result.data && (
            <p className="text-xs text-muted-foreground">
              EF: {result.data.factorUsed}{" "}
              {result.data.emissionFactor?.co2eUnit}/
              {result.data.emissionFactor?.activityUnit} ·{" "}
              {result.data.emissionFactor?.sourceName}
            </p>
          )}
          {result.error && (
            <p role="alert" className="text-sm text-destructive">
              {result.error.message}
            </p>
          )}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {editable && (
          <Button
            variant="outline"
            disabled={busy}
            onClick={() => setEditing(!editing)}
          >
            Sửa hoạt động
          </Button>
        )}
        {canWrite &&
          mutable &&
          (record.status === "DRAFT" || record.status === "REJECTED") && (
            <Button
              disabled={busy}
              onClick={() =>
                action(() => submitActivityData(record.id), "Đã gửi duyệt.")
              }
            >
              Gửi duyệt
            </Button>
          )}
        {canReview && mutable && record.status === "PENDING_REVIEW" && (
          <>
            <Button
              disabled={busy}
              onClick={() =>
                action(
                  () => confirmActivityData(record.id),
                  "Đã duyệt và tính CO₂e.",
                )
              }
            >
              Duyệt & tính CO₂e
            </Button>
            <Button
              variant="outline"
              disabled={busy}
              onClick={() => setRejecting(!rejecting)}
            >
              Từ chối
            </Button>
          </>
        )}
        {canReview && mutable && record.status === "CONFIRMED" && (
          <Button
            variant="outline"
            disabled={busy}
            onClick={() =>
              action(
                () => recalculateEmission(record.id),
                "Đã tính lại bằng hệ số backend.",
              )
            }
          >
            Tính lại CO₂e
          </Button>
        )}
      </div>
      {rejecting && (
        <form
          className="mt-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            void action(
              () => rejectActivityData(record.id, reason),
              "Đã từ chối.",
            );
          }}
        >
          <input
            className="min-w-0 flex-1 rounded border bg-background px-3"
            aria-label="Lý do từ chối"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            maxLength={500}
          />
          <Button disabled={busy || !reason.trim()}>Xác nhận từ chối</Button>
        </form>
      )}
      {editing && (
        <div className="mt-5 border-t pt-5">
          <ActivityEntryForm
            businessId={record.businessId}
            initial={{
              reportingPeriodId: record.reportingPeriodId ?? undefined,
              emissionSourceId: record.emissionSourceId ?? undefined,
              branchId: record.branchId ?? undefined,
              quantity: Number(record.quantity),
              unit: record.unit,
              periodStart: record.periodStart,
              periodEnd: record.periodEnd,
            }}
            onSave={async (input) => {
              await updateActivityData(record.id, {
                emissionSourceId: input.emissionSourceId!,
                quantity: input.quantity,
                unit: input.unit,
                branchId: input.branchId,
                periodStart: input.periodStart,
                periodEnd: input.periodEnd,
              });
              await refresh();
              setEditing(false);
              toast.success("Đã sửa hoạt động.");
            }}
          />
        </div>
      )}
    </AppPanel>
  );
}
export function EmissionDetailPage() {
  const { activeBusinessId } = useBusinessStore();
  const { role } = useBusinessRole(activeBusinessId ?? "");
  const [page, setPage] = useState(1);
  const [periodId, setPeriodId] = useState("");
  useEffect(() => {
    setPage(1);
    setPeriodId("");
  }, [activeBusinessId]);
  const periods = useReportingPeriods(activeBusinessId);
  const activity = useActivityDataList(
    {
      businessId: activeBusinessId ?? undefined,
      reportingPeriodId: periodId || undefined,
      page,
      limit: 20,
    },
    Boolean(activeBusinessId),
  );
  const summary = useDashboardSummary(
    {
      businessId: activeBusinessId ?? undefined,
      reportingPeriodId: periodId || undefined,
    },
    Boolean(activeBusinessId),
  );
  const canWrite = Boolean(role && role !== "VIEWER");
  const canReview =
    role === "SYSTEM_ADMIN" ||
    role === "COMPANY_ADMIN" ||
    role === "BRANCH_MANAGER";
  return (
    <div className="space-y-6">
      <AppPageHeader
        title="Sổ dữ liệu & Kết quả CO₂e"
        description="Bản nháp chưa được tính phát thải. Quản lý duyệt hoạt động để backend chọn hệ số và tính CO₂e."
        actions={
          <>
            <Button asChild variant="outline">
              <Link to={ROUTES.app.dataInput}>Nhập hoạt động</Link>
            </Button>
            <Button asChild>
              <Link to={ROUTES.app.reports}>Kỳ báo cáo & Xuất báo cáo</Link>
            </Button>
          </>
        }
      />
      <AppPanel title="Tổng phát thải đã tính">
        <p className="text-3xl font-bold text-primary">
          {(Number(summary.data?.totalCo2eKg ?? 0) / 1000).toLocaleString(
            "vi-VN",
            { maximumFractionDigits: 6 },
          )}{" "}
          tCO₂e
        </p>
        <p className="text-sm text-muted-foreground">
          {summary.data?.resultCount ?? 0} kết quả đã tính
        </p>
        <div className="mt-3 flex flex-wrap gap-4">
          {summary.data?.byScope.map((s) => (
            <span key={s.scope}>
              {s.scope.replace("SCOPE_", "Scope ")}:{" "}
              {(Number(s.totalCo2eKg) / 1000).toLocaleString("vi-VN")} tCO₂e
            </span>
          ))}
        </div>
        {summary.error && (
          <p role="alert" className="text-destructive">
            {summary.error.message}
          </p>
        )}
      </AppPanel>
      <label className="block space-y-2">
        <span>Kỳ báo cáo</span>
        <select
          className="h-10 w-full rounded-md border bg-background px-3"
          value={periodId}
          onChange={(e) => {
            setPeriodId(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Tất cả các kỳ</option>
          {periods.data?.items.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} · {p.status}
            </option>
          ))}
        </select>
      </label>
      {activity.isLoading && <p>Đang tải hoạt động…</p>}
      {activity.error && (
        <p role="alert" className="text-destructive">
          {activity.error.message}
        </p>
      )}
      {activity.data?.items.length === 0 && (
        <AppPanel>
          <p>Chưa có hoạt động trong kỳ này.</p>
        </AppPanel>
      )}
      {activity.data?.items.map((record) => (
        <ActivityRow
          key={record.id}
          record={record}
          canWrite={canWrite}
          canReview={canReview}
          canEdit={canReview}
          mutable={
            periods.data?.items.find((p) => p.id === record.reportingPeriodId)
              ?.status === "OPEN"
          }
        />
      ))}
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          Trang trước
        </Button>
        <span>
          Trang {page} · {activity.data?.total ?? 0} hoạt động
        </span>
        <Button
          variant="outline"
          disabled={page >= (activity.data?.totalPages ?? 1)}
          onClick={() => setPage(page + 1)}
        >
          Trang sau
        </Button>
      </div>
    </div>
  );
}
