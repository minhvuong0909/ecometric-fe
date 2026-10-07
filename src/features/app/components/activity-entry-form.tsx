import { DateInput } from "@/shared/components/ui/date-input";
import { OptionSelect } from "@/shared/components/ui/option-select";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { ROUTES } from "@/shared/constants/routes";
import {
  useBranches,
  useEmissionSources,
  useReportingPeriods,
} from "@/features/app/hooks/use-app-meta";
import { buildActivityInput } from "@/features/app/lib/activity-input";
import type { CreateActivityDataInput } from "@/features/app/types/app.types";

type Props = {
  businessId: string;
  initial?: Partial<CreateActivityDataInput>;
  disabled?: boolean;
  onSave: (input: CreateActivityDataInput) => Promise<void>;
  submitLabel?: string;
};
const selectClass =
  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm";
export function ActivityEntryForm({
  businessId,
  initial,
  disabled,
  onSave,
  submitLabel = "Lưu bản nháp",
}: Props) {
  const { data: periodsData } = useReportingPeriods(businessId);
  const { data: sourcesData } = useEmissionSources(true, businessId);
  const { data: branchesData } = useBranches(businessId);
  const periods =
    periodsData?.items.filter((period) => period.status === "OPEN") ?? [];
  const sources = sourcesData?.items ?? [];
  const [periodId, setPeriodId] = useState(initial?.reportingPeriodId ?? "");
  const [sourceId, setSourceId] = useState(initial?.emissionSourceId ?? "");
  const [branchId, setBranchId] = useState(initial?.branchId ?? "");
  const [quantity, setQuantity] = useState(
    initial?.unit?.toUpperCase() === "VND"
      ? ""
      : (initial?.quantity?.toString() ?? ""),
  );
  const [unit, setUnit] = useState(
    initial?.unit === "VND" ? "" : (initial?.unit ?? ""),
  );
  const [startDate, setStartDate] = useState(
    initial?.periodStart?.slice(0, 10) ?? "",
  );
  const [endDate, setEndDate] = useState(
    initial?.periodEnd?.slice(0, 10) ?? "",
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (!periodId && periods[0]) setPeriodId(periods[0].id);
  }, [periodId, periods]);
  const period = periods.find((item) => item.id === periodId);
  useEffect(() => {
    if (!period) return;
    if (!startDate) setStartDate(period.startDate.slice(0, 10));
    if (!endDate) setEndDate(period.endDate.slice(0, 10));
  }, [period, startDate, endDate]);
  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    const source = sources.find((item) => item.id === sourceId);
    if (!period || !source) {
      setError("Chọn kỳ đang mở và nguồn phát thải.");
      return;
    }
    setSaving(true);
    try {
      await onSave(
        buildActivityInput({
          businessId,
          period,
          source,
          branchId,
          quantity,
          unit,
          startDate: startDate + "T00:00:00.000Z",
          endDate: endDate + "T23:59:59.000Z",
        }),
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Không thể lưu dữ liệu.",
      );
    } finally {
      setSaving(false);
    }
  }
  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="activity-period">Kỳ báo cáo đang mở</Label>
          <OptionSelect
            id="activity-period"
            className={selectClass}
            value={periodId}
            onChange={(e) => setPeriodId(e.target.value)}
            required
          >
            <option value="">Chọn kỳ</option>
            {periods.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </OptionSelect>
        </div>
        <div className="space-y-2">
          <Label htmlFor="activity-source">Nguồn phát thải</Label>
          <OptionSelect
            id="activity-source"
            className={selectClass}
            value={sourceId}
            onChange={(e) => {
              setSourceId(e.target.value);
              setUnit(
                sources.find((s) => s.id === e.target.value)?.defaultUnit ?? "",
              );
            }}
            required
          >
            <option value="">Chọn nguồn</option>
            {sources.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.defaultUnit})
              </option>
            ))}
          </OptionSelect>
        </div>
        <div className="space-y-2">
          <Label htmlFor="activity-quantity">Số lượng hoạt động</Label>
          <Input
            id="activity-quantity"
            type="number"
            min="0.000001"
            step="any"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="activity-unit">Đơn vị</Label>
          <Input
            id="activity-unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="kWh, L, kg…"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="activity-start">Từ ngày</Label>
          <DateInput
            id="activity-start"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="activity-end">Đến ngày</Label>
          <DateInput
            id="activity-end"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="activity-branch">Chi nhánh</Label>
          <OptionSelect
            id="activity-branch"
            className={selectClass}
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
          >
            <option value="">Toàn doanh nghiệp</option>
            {branchesData?.items.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </OptionSelect>
        </div>
      </div>
      {!periods.length && (
        <p className="text-sm text-muted-foreground">
          Chưa có kỳ đang mở.{" "}
          <Link className="text-primary underline" to={ROUTES.app.reports}>
            Tạo hoặc mở lại kỳ báo cáo
          </Link>
          .
        </p>
      )}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <p className="border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground">
        Lưu bản nháp → gửi duyệt → quản lý xác nhận và tính CO₂e bằng hệ số
        backend.
      </p>
      <Button disabled={disabled || saving || !periods.length}>
        {saving ? "Đang lưu…" : submitLabel}
      </Button>
    </form>
  );
}
