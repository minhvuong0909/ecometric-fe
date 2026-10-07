import type {
  CreateActivityDataInput,
  EmissionSource,
  ReportingPeriod,
} from "@/features/app/types/app.types";

export function buildActivityInput(input: {
  businessId: string;
  period: ReportingPeriod;
  source: EmissionSource;
  branchId?: string;
  quantity: string;
  unit: string;
  startDate: string;
  endDate: string;
}): CreateActivityDataInput {
  const quantity = Number(input.quantity);
  if (!Number.isFinite(quantity) || quantity <= 0)
    throw new Error("Số lượng phải lớn hơn 0.");
  if (!input.unit.trim() || input.unit.trim().toUpperCase() === "VND")
    throw new Error(
      "Nhập đơn vị hoạt động như kWh, L, kg; không dùng tổng tiền VND.",
    );
  if (input.period.status !== "OPEN")
    throw new Error("Chỉ nhập dữ liệu vào kỳ đang mở.");
  const start = new Date(input.startDate);
  const end = new Date(input.endDate);
  if (
    !Number.isFinite(start.getTime()) ||
    !Number.isFinite(end.getTime()) ||
    start > end
  )
    throw new Error("Khoảng ngày không hợp lệ.");
  if (
    start < new Date(input.period.startDate) ||
    end > new Date(input.period.endDate)
  )
    throw new Error("Ngày hoạt động phải nằm trong kỳ báo cáo đã chọn.");
  return {
    businessId: input.businessId,
    reportingPeriodId: input.period.id,
    emissionSourceId: input.source.id,
    branchId: input.branchId || undefined,
    quantity,
    unit: input.unit.trim(),
    periodStart: start.toISOString(),
    periodEnd: end.toISOString(),
  };
}
