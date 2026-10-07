import type {
  DashboardQueryParams,
  EmissionScope,
} from "@/features/app/types/app.types";

export const PERIODS = [
  { id: "7d", label: "7 ngày" },
  { id: "30d", label: "Tháng này" },
  { id: "1y", label: "Năm hiện tại" },
] as const;
export type DashboardPeriod = (typeof PERIODS)[number]["id"];
export const scopeLabels: Record<
  EmissionScope,
  { label: string; description: string; color: string }
> = {
  SCOPE_1: {
    label: "Scope 1",
    description: "Phát thải trực tiếp",
    color: "#438566",
  },
  SCOPE_2: {
    label: "Scope 2",
    description: "Năng lượng mua vào",
    color: "#7096a5",
  },
  SCOPE_3: { label: "Scope 3", description: "Chuỗi giá trị", color: "#b39868" },
};
const decimalFormatter = new Intl.NumberFormat("vi-VN", {
  maximumFractionDigits: 3,
});
const precisionFormatter = new Intl.NumberFormat("vi-VN", {
  maximumSignificantDigits: 3,
});

export function formatNumber(value: number) {
  return (
    value !== 0 && Math.abs(value) < 0.001
      ? precisionFormatter
      : decimalFormatter
  ).format(value);
}
export function formatEmission(kg: number) {
  if (kg !== 0 && Math.abs(kg) < 1)
    return `${precisionFormatter.format(kg)} kgCO₂e`;
  if (kg !== 0 && Math.abs(kg) < 1000) return `${formatNumber(kg)} kgCO₂e`;
  return `${formatNumber(kg / 1000)} tCO₂e`;
}

/** Calendar periods start at midnight in the user's local timezone. */
export function getDashboardParams(
  businessId: string | null,
  period: DashboardPeriod,
  now = new Date(),
): DashboardQueryParams {
  const start = new Date(now);
  if (period === "7d") start.setDate(start.getDate() - 6);
  else if (period === "30d") start.setDate(1);
  else start.setMonth(0, 1);
  start.setHours(0, 0, 0, 0);
  return {
    businessId: businessId ?? undefined,
    periodStart: start.toISOString(),
    periodEnd: now.toISOString(),
  };
}
