import { useMemo, useState } from "react";
import {
  BarChart3,
  Building2,
  Database,
  FileUp,
  Leaf,
  ArrowRight,
} from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { Link } from "react-router";
import {
  ResponsiveContainer,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { AppPageHeader } from "@/features/app/components/app-page-header";
import { AppPanel } from "@/features/app/components/app-panel";
import { MetricCard } from "@/features/app/components/metric-card";
import { DASHBOARD_COPY } from "@/features/app/constants/app-copy";
import {
  useDashboardByScope,
  useDashboardSummary,
  useDashboardTopSources,
  useDashboardTrend,
} from "@/features/app/hooks/use-dashboard";
import { useBusinessStore } from "@/shared/stores/business-store";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

import {
  PERIODS,
  scopeLabels,
  formatNumber as number,
  formatEmission as emission,
  getDashboardParams,
  type DashboardPeriod,
} from "@/features/app/lib/dashboard-presentation";
import { ChartState } from "@/features/app/components/dashboard-chart-state";
const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  color: "var(--foreground)",
  fontSize: 12,
};

export function DashboardPage() {
  const copy = DASHBOARD_COPY;
  const reduced = useReducedMotion();
  const [period, setPeriod] = useState<DashboardPeriod>("30d");
  const activeBusinessId = useBusinessStore((state) => state.activeBusinessId);
  const params = useMemo(
    () => getDashboardParams(activeBusinessId, period),
    [activeBusinessId, period],
  );
  const summary = useDashboardSummary(params);
  const scopes = useDashboardByScope(params);
  const sources = useDashboardTopSources({ ...params, limit: 5 });
  const trend = useDashboardTrend({
    ...params,
    groupBy: period === "1y" ? "month" : "day",
  });
  const sourceRows = useMemo(
    () =>
      (sources.data ?? [])
        .map((row) => ({ ...row, kg: Number(row.totalCo2eKg) }))
        .sort((a, b) => b.kg - a.kg),
    [sources.data],
  );
  const trendRows = useMemo(
    () =>
      (trend.data ?? [])
        .map((row) => ({
          ...row,
          kg: Number(row.totalCo2eKg),
          label:
            period === "1y"
              ? `T${Number(row.period.slice(5, 7))}`
              : `${Number(row.period.slice(8, 10))}/${Number(row.period.slice(5, 7))}`,
        }))
        .sort((a, b) => a.period.localeCompare(b.period)),
    [trend.data, period],
  );
  const scopeRows = useMemo(
    () =>
      (scopes.data ?? [])
        .map((row) => ({
          ...row,
          kg: Number(row.totalCo2eKg),
          ...scopeLabels[row.scope],
        }))
        .sort((a, b) => a.scope.localeCompare(b.scope)),
    [scopes.data],
  );
  const maxKg = Math.max(
    0,
    ...trendRows.map((row) => row.kg),
    ...scopeRows.map((row) => row.kg),
  );
  const divisor = maxKg >= 1000 ? 1000 : 1;
  const unit = divisor === 1000 ? "tCO₂e" : "kgCO₂e";
  const trendChartRows = useMemo(
    () => trendRows.map((row) => ({ ...row, value: row.kg / divisor })),
    [trendRows, divisor],
  );
  const scopeChartRows = useMemo(
    () => scopeRows.map((row) => ({ ...row, value: row.kg / divisor })),
    [scopeRows, divisor],
  );
  const metrics = [
    {
      label: "Tổng phát thải",
      value: summary.data ? emission(Number(summary.data.totalCo2eKg)) : "—",
      hint: summary.data
        ? `${summary.data.resultCount} kết quả tính toán`
        : summary.isError
          ? "Không tải được dữ liệu"
          : summary.isLoading
            ? "Đang tải…"
            : "Chưa chọn doanh nghiệp",
      icon: Leaf,
    },
    {
      label: "Bản ghi hoạt động",
      value: summary.data ? String(summary.data.activityCount) : "—",
      hint: "Đã ghi nhận trong kỳ",
      icon: Database,
    },
    {
      label: "Chi nhánh / Cơ sở",
      value: summary.data ? String(summary.data.branchCount) : "—",
      hint: "Tham gia kiểm kê",
      icon: Building2,
    },
    {
      label: "Nguồn phát thải",
      value: summary.data ? String(summary.data.sourceCount) : "—",
      hint: "Được ghi nhận trong kỳ",
      icon: BarChart3,
    },
  ];
  return (
    <div className="space-y-6 pb-8">
      <AppPageHeader
        breadcrumbs={copy.breadcrumbs}
        title={copy.title}
        description="Theo dõi phát thải, nhận diện nguồn lớn nhất và chọn hành động tiếp theo."
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <div
              role="group"
              aria-label="Kỳ báo cáo"
              className="flex rounded-lg border border-border bg-muted/40 p-1"
            >
              {PERIODS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={period === item.id}
                  onClick={() => setPeriod(item.id)}
                  className={cn(
                    "rounded-md px-3 py-2 text-xs font-medium focus-ring",
                    period === item.id
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <Button asChild className="gap-2">
              <Link to={ROUTES.app.uploadDoc}>
                <FileUp className="size-4" />
                Tải hóa đơn mới
              </Link>
            </Button>
          </div>
        }
      />
      {!activeBusinessId && (
        <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm">
          Chọn doanh nghiệp để xem dữ liệu kiểm kê.{" "}
          <Link to={ROUTES.app.businesses} className="link-primary">
            Quản lý doanh nghiệp
          </Link>
        </div>
      )}
      {summary.isError && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm"
        >
          <span>Không tải được tổng quan. Số liệu chưa được xác nhận.</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              void summary.refetch();
            }}
          >
            Thử lại
          </Button>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => (
          <MetricCard
            key={metric.label}
            {...metric}
            animateValue={false}
            className={
              index === 0 ? "border-primary/30 bg-primary/5" : undefined
            }
          />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <AppPanel
          title="Phát thải theo thời gian"
          description={`${period === "1y" ? "Tổng theo tháng" : "Tổng theo ngày"} · ${unit} · trong kỳ được chọn`}
        >
          <ChartState
            loading={trend.isLoading}
            error={trend.isError}
            empty={!trendRows.length}
            retry={() => {
              void trend.refetch();
            }}
          >
            <div
              className="h-64 min-w-0"
              role="img"
              aria-label={`Biểu đồ cột phát thải ${period === "1y" ? "theo tháng" : "theo ngày"}, đơn vị ${unit}`}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={trendChartRows}
                  margin={{ top: 12, right: 8, left: 0, bottom: 8 }}
                  accessibilityLayer
                >
                  <CartesianGrid
                    vertical={false}
                    stroke="var(--border)"
                    strokeDasharray="3 4"
                  />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    minTickGap={22}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  />
                  <YAxis
                    domain={[0, "auto"]}
                    tickLine={false}
                    axisLine={false}
                    width={54}
                    tickFormatter={number}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    cursor={{ fill: "var(--muted)", opacity: 0.5 }}
                    formatter={(value) => [
                      `${number(Number(value))} ${unit}`,
                      "Phát thải",
                    ]}
                    labelFormatter={(_, payload) =>
                      payload[0]?.payload.period ?? ""
                    }
                  />
                  <Bar
                    dataKey="value"
                    fill="var(--primary)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={36}
                    isAnimationActive={!reduced}
                    animationDuration={450}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <details className="mt-4 border-t border-border pt-3">
              <summary className="cursor-pointer text-xs font-medium text-muted-foreground">
                Xem số liệu theo kỳ
              </summary>
              <div className="mt-3 max-h-48 overflow-auto">
                <table className="w-full text-xs">
                  <caption className="sr-only">
                    Số liệu phát thải theo thời gian
                  </caption>
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="py-2 text-left">Kỳ</th>
                      <th className="text-right">Phát thải</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trendRows.map((row) => (
                      <tr
                        key={row.period}
                        className="border-b border-border/50"
                      >
                        <td className="py-2">{row.period}</td>
                        <td className="text-right tabular-nums">
                          {emission(row.kg)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          </ChartState>
        </AppPanel>
        <AppPanel
          title="5 nguồn phát thải lớn nhất"
          description="Xếp giảm dần theo phát thải tuyệt đối trong kỳ; không đại diện cho toàn bộ cơ cấu."
        >
          <ChartState
            loading={sources.isLoading}
            error={sources.isError}
            empty={!sourceRows.length}
            retry={() => {
              void sources.refetch();
            }}
          >
            <ol className="space-y-5">
              {sourceRows.map((row, index) => (
                <li
                  key={
                    row.emissionSourceId ?? `${row.emissionSourceName}-${index}`
                  }
                >
                  <div className="mb-2 flex items-start justify-between gap-3 text-sm">
                    <span className="min-w-0 leading-relaxed">
                      <span className="mr-2 text-xs text-muted-foreground">
                        0{index + 1}
                      </span>
                      {row.emissionSourceName}
                    </span>
                    <span className="shrink-0 pt-1 text-xs font-semibold tabular-nums">
                      {emission(row.kg)}
                    </span>
                  </div>
                  <div
                    className="h-2 overflow-hidden rounded-full bg-muted"
                    aria-hidden="true"
                  >
                    <div
                      className="h-full rounded-full bg-primary motion-safe:transition-[width] motion-safe:duration-500"
                      style={{
                        width: `${sourceRows[0].kg > 0 ? Math.max(0, (row.kg / sourceRows[0].kg) * 100) : 0}%`,
                        opacity: index === 0 ? 1 : 0.65,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ol>
          </ChartState>
        </AppPanel>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <AppPanel
          title="So sánh phạm vi phát thải"
          description={`Scope 1, 2 & 3 · ${unit} · cùng thang đo`}
        >
          <ChartState
            loading={scopes.isLoading}
            error={scopes.isError}
            empty={!scopeRows.length}
            retry={() => {
              void scopes.refetch();
            }}
          >
            <div
              className="h-56 min-w-0"
              role="img"
              aria-label={`So sánh phát thải Scope 1, 2, 3 bằng cột, đơn vị ${unit}`}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={scopeChartRows}
                  margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
                  accessibilityLayer
                >
                  <CartesianGrid
                    vertical={false}
                    stroke="var(--border)"
                    strokeDasharray="3 4"
                  />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  />
                  <YAxis
                    domain={[0, "auto"]}
                    width={54}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={number}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    cursor={{ fill: "var(--muted)", opacity: 0.5 }}
                    formatter={(value) => [
                      `${number(Number(value))} ${unit}`,
                      "Phát thải",
                    ]}
                  />
                  <Bar
                    dataKey="value"
                    radius={[5, 5, 0, 0]}
                    maxBarSize={64}
                    isAnimationActive={!reduced}
                    animationDuration={450}
                  >
                    {scopeRows.map((row) => (
                      <Cell key={row.scope} fill={row.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-4 divide-y divide-border border-t border-border">
              {scopeRows.map((row) => (
                <li
                  key={row.scope}
                  className="flex items-center justify-between gap-3 py-3 text-xs"
                >
                  <span>
                    <strong>{row.label}</strong>
                    <span className="ml-2 text-muted-foreground">
                      {row.description}
                    </span>
                  </span>
                  <span className="shrink-0 font-medium tabular-nums">
                    {emission(row.kg)}
                  </span>
                </li>
              ))}
            </ul>
          </ChartState>
        </AppPanel>
        <AppPanel
          title="Bước tiếp theo"
          description="Từ dữ liệu kiểm kê đến hành động giảm phát thải."
        >
          <div className="divide-y divide-border">
            {[
              {
                title: "Bổ sung dữ liệu hoạt động",
                description:
                  "Ghi nhận điện, nhiên liệu và tài nguyên trong kỳ.",
                href: ROUTES.app.dataInput,
              },
              {
                title: "Xem khuyến nghị",
                description:
                  "Đánh giá cơ hội cải thiện từ dữ liệu đã ghi nhận.",
                href: ROUTES.app.recommendations,
              },
              {
                title: "Kiểm tra báo cáo",
                description: "Rà kỳ báo cáo và kết quả trước khi xuất.",
                href: ROUTES.app.reports,
              },
            ].map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="focus-ring flex items-center gap-3 py-5 group"
              >
                <div>
                  <h3 className="text-sm font-semibold group-hover:text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <ArrowRight className="ml-auto size-4 shrink-0 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </AppPanel>
      </div>
    </div>
  );
}
