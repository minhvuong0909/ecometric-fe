import { useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  Database,
  FileUp,
  Flame,
  Leaf,
  Loader2,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Link } from "react-router";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
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

const METRIC_ICONS = [BarChart3, Leaf, Database, TrendingUp] as const;

const SOURCE_COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#8B5CF6", "#EC4899", "#6366F1"];

export function DashboardPage() {
  const copy = DASHBOARD_COPY;
  const [selectedPeriod, setSelectedPeriod] = useState<"7d" | "30d" | "1y">("30d");
  const { activeBusinessId } = useBusinessStore();

  const queryParams = useMemo(() => {
    return { businessId: activeBusinessId ?? undefined };
  }, [activeBusinessId]);

  const { data: summary, isLoading: isLoadingSummary } = useDashboardSummary(queryParams);
  const { data: scopeBreakdown } = useDashboardByScope(queryParams);
  const { data: topSources } = useDashboardTopSources({ ...queryParams, limit: 5 });
  const { data: trendData } = useDashboardTrend({ ...queryParams, groupBy: "month" });

  // Nguồn phát thải: Dữ liệu thực từ API hoặc fallback mẫu
  const sourceData = useMemo(() => {
    if (topSources && topSources.length > 0) {
      const totalKg = topSources.reduce((sum, item) => sum + Number(item.totalCo2eKg), 0);
      return topSources.map((item, idx) => {
        const valKg = Number(item.totalCo2eKg);
        const percent = totalKg > 0 ? Math.round((valKg / totalKg) * 100) : 0;
        return {
          name: item.emissionSourceName,
          value: percent,
          color: SOURCE_COLORS[idx % SOURCE_COLORS.length],
          absoluteValue: `${(valKg / 1000).toFixed(2)} t`,
          icon: Zap,
        };
      });
    }
    return [
      { name: "Điện", value: 42, color: "#10B981", absoluteValue: "1.34 t", icon: Zap },
      { name: "Nhiên liệu", value: 28, color: "#3B82F6", absoluteValue: "0.90 t", icon: Flame },
      { name: "Vận tải", value: 15, color: "#F59E0B", absoluteValue: "0.48 t", icon: TrendingUp },
      { name: "Chất thải", value: 9, color: "#8B5CF6", absoluteValue: "0.29 t", icon: Leaf },
      { name: "Nước", value: 6, color: "#EC4899", absoluteValue: "0.19 t", icon: Activity },
    ];
  }, [topSources]);

  // Xu hướng: Dữ liệu thực từ API hoặc fallback mẫu
  const monthlyTrendData = useMemo(() => {
    if (trendData && trendData.length > 0) {
      return trendData.map((item) => ({
        name: item.period,
        "CO₂e": Number((Number(item.totalCo2eKg) / 1000).toFixed(2)),
      }));
    }
    return [
      { name: "T1", "CO₂e": 1.2 },
      { name: "T2", "CO₂e": 1.5 },
      { name: "T3", "CO₂e": 2.1 },
      { name: "T4", "CO₂e": 2.5 },
      { name: "T5", "CO₂e": 2.8 },
      { name: "T6", "CO₂e": 3.2 },
    ];
  }, [trendData]);

  // Biến động so với kỳ trước, tính từ 2 điểm dữ liệu gần nhất (không dùng số cố định)
  const trendChangePercent = useMemo(() => {
    if (monthlyTrendData.length < 2) return null;
    const prev = monthlyTrendData[monthlyTrendData.length - 2]["CO₂e"];
    const current = monthlyTrendData[monthlyTrendData.length - 1]["CO₂e"];
    if (!prev) return null;
    return Math.round(((current - prev) / prev) * 100);
  }, [monthlyTrendData]);

  const previousPeriodLabel =
    monthlyTrendData.length >= 2 ? monthlyTrendData[monthlyTrendData.length - 2].name : null;

  // Scope: Dữ liệu thực từ API hoặc fallback mẫu
  const scopeData = useMemo(() => {
    if (scopeBreakdown && scopeBreakdown.length > 0) {
      const scopeMap: Record<string, { name: string; color: string; desc: string }> = {
        SCOPE_1: { name: "Scope 1", color: "#3B82F6", desc: "Trực tiếp (Nhiên liệu, đốt cháy)" },
        SCOPE_2: { name: "Scope 2", color: "#10B981", desc: "Gián tiếp (Điện lưới tiêu thụ)" },
        SCOPE_3: { name: "Scope 3", color: "#8B5CF6", desc: "Chuỗi cung ứng & Vận tải" },
      };
      return scopeBreakdown.map((item) => ({
        name: scopeMap[item.scope]?.name ?? item.scope,
        "Phát thải": Number((Number(item.totalCo2eKg) / 1000).toFixed(2)),
        color: scopeMap[item.scope]?.color ?? "#10B981",
        desc: scopeMap[item.scope]?.desc ?? "",
      }));
    }
    return [
      { name: "Scope 1", "Phát thải": 1.12, color: "#3B82F6", desc: "Trực tiếp (Nhiên liệu)" },
      { name: "Scope 2", "Phát thải": 2.72, color: "#10B981", desc: "Gián tiếp (Điện lưới)" },
      { name: "Scope 3", "Phát thải": 1.44, color: "#8B5CF6", desc: "Chuỗi cung ứng & Vận tải" },
    ];
  }, [scopeBreakdown]);

  // KPI Metrics tính từ summary API
  const metrics = useMemo(() => {
    if (summary) {
      const totalTons = (Number(summary.totalCo2eKg) / 1000).toFixed(2);
      return [
        {
          label: "Tổng phát thải",
          value: `${totalTons} tCO₂e`,
          hint: `${summary.resultCount} phép tính phát thải`,
        },
        {
          label: "Bản ghi hoạt động",
          value: `${summary.activityCount}`,
          hint: "Đã ghi nhận trong kỳ",
        },
        {
          label: "Chi nhánh / Cơ sở",
          value: `${summary.branchCount}`,
          hint: "Cơ sở tham gia kiểm kê",
        },
        {
          label: "Nguồn phát thải",
          value: `${summary.sourceCount}`,
          hint: "Phân loại theo GHG Protocol",
        },
      ];
    }
    return copy.metrics;
  }, [summary, copy.metrics]);


  return (
    <div className="space-y-8 pb-8">
      {/* Top Header Section */}
      <AppPageHeader
        breadcrumbs={copy.breadcrumbs}
        title={copy.title}
        description={copy.description}
        actions={
          <div className="flex items-center gap-3">
            {/* Period Selector Tabs */}
            <div className="flex items-center rounded-lg border border-border bg-muted/40 p-1 text-xs font-medium">
              <button
                type="button"
                onClick={() => setSelectedPeriod("7d")}
                className={cn(
                  "rounded-md px-3 py-1.5 transition-colors duration-150",
                  selectedPeriod === "7d"
                    ? "bg-card text-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                7 ngày
              </button>
              <button
                type="button"
                onClick={() => setSelectedPeriod("30d")}
                className={cn(
                  "rounded-md px-3 py-1.5 transition-colors duration-150",
                  selectedPeriod === "30d"
                    ? "bg-card text-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Tháng này
              </button>
              <button
                type="button"
                onClick={() => setSelectedPeriod("1y")}
                className={cn(
                  "rounded-md px-3 py-1.5 transition-colors duration-150",
                  selectedPeriod === "1y"
                    ? "bg-card text-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Năm 2026
              </button>
            </div>

            {isLoadingSummary && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin" />
                Đang cập nhật...
              </span>
            )}

            <Button asChild variant="outline" className="gap-2">
              <Link to={ROUTES.app.uploadDoc}>
                <FileUp className="size-4" />
                Tải hóa đơn mới
              </Link>
            </Button>

            <Button asChild className="gap-2">
              <Link to={ROUTES.app.recommendations}>
                <Sparkles className="size-4" />
                {copy.cta}
              </Link>
            </Button>
          </div>
        }
      />

      {/* KPI Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => (
          <MetricCard
            key={metric.label}
            icon={METRIC_ICONS[index]}
            label={metric.label}
            value={metric.value}
            hint={metric.hint}
            hintClassName={"hintClass" in metric ? (metric as any).hintClass : undefined}
          />
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Source Donut Chart */}
        <AppPanel
          title={copy.emissionBySource.title}
          description={copy.emissionBySource.subtitle}
          className="lg:col-span-2"
        >
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center justify-between">
            <div className="relative flex size-48 shrink-0 items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={62}
                    outerRadius={78}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="transparent"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        className="transition-all duration-300 hover:opacity-80"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="rounded-xl border border-border/80 bg-card/95 backdrop-blur-md p-3 shadow-xl text-xs font-medium">
                            <p className="font-bold text-foreground">{data.name}</p>
                            <p className="font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                              {data.value}% ({data.absoluteValue} CO₂e)
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold tracking-tight text-foreground">
                  {copy.emissionBySource.center}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {copy.emissionBySource.centerLabel}
                </span>
              </div>
            </div>

            {/* Legend breakdown */}
            <ul className="flex-1 w-full space-y-2">
              {sourceData.map((item) => {
                return (
                  <li
                    key={item.name}
                    className="-mx-2 flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs"
                  >
                    <span className="flex items-center gap-2 font-medium text-foreground">
                      <span
                        className="size-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                        aria-hidden
                      />
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-[11px] font-mono">
                        {item.absoluteValue}
                      </span>
                      <span className="font-semibold text-foreground">{item.value}%</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </AppPanel>

        {/* Monthly Trend Area Chart */}
        <AppPanel
          title={copy.monthlyTrend.title}
          description={copy.monthlyTrend.subtitle}
          badge={
            trendChangePercent !== null && previousPeriodLabel ? (
              <div
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold",
                  trendChangePercent >= 0
                    ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                    : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                )}
              >
                {trendChangePercent >= 0 ? (
                  <TrendingUp className="size-3" />
                ) : (
                  <TrendingDown className="size-3" />
                )}
                {trendChangePercent >= 0 ? "+" : ""}
                {trendChangePercent}% so với {previousPeriodLabel}
              </div>
            ) : null
          }
          className="lg:col-span-3"
        >
          <div className="h-60 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEmission" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/60" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "currentColor", fontSize: 12 }}
                  className="text-muted-foreground"
                  dy={8}
                />
                <YAxis
                  domain={[0, 4]}
                  ticks={[0, 1, 2, 3, 4]}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val} t`}
                  tick={{ fill: "currentColor", fontSize: 11 }}
                  className="text-muted-foreground"
                  dx={-4}
                  width={36}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-xl border border-border/80 bg-card/95 backdrop-blur-md p-3 shadow-xl text-xs font-medium">
                          <p className="font-bold text-muted-foreground">Tháng {payload[0].payload.name}</p>
                          <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-1 text-sm">
                            {payload[0].value} tCO₂e
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="CO₂e"
                  stroke="#10B981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorEmission)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </AppPanel>
      </div>

      {/* Secondary Row: Scope Breakdown & ESG Insights */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Scope Breakdown */}
        <AppPanel
          title={copy.scopeBreakdown.title}
          description={copy.scopeBreakdown.subtitle}
          className="lg:col-span-2"
        >
          <div className="h-60 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scopeData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/60" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "currentColor", fontSize: 12 }}
                  className="text-muted-foreground"
                  dy={8}
                />
                <YAxis
                  domain={[0, 3.5]}
                  ticks={[0, 1, 2, 3]}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val} t`}
                  tick={{ fill: "currentColor", fontSize: 11 }}
                  className="text-muted-foreground"
                  dx={-4}
                  width={36}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-xl border border-border/80 bg-card/95 backdrop-blur-md p-3 shadow-xl text-xs font-medium">
                          <p className="font-bold text-foreground">{data.name}</p>
                          <p className="text-[11px] text-muted-foreground">{data.desc}</p>
                          <p className="font-bold text-blue-600 dark:text-blue-400 mt-1 text-sm">
                            {payload[0].value} tCO₂e
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="Phát thải"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={56}
                >
                  {scopeData.map((entry, index) => (
                    <Cell key={`scope-cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AppPanel>

        {/* Insights & Actions */}
        <div className="space-y-6">
          <AppPanel title={copy.insights.title}>
            <div className="space-y-4">
              {copy.insights.alerts.map((alert) => (
                <div key={alert.title} className="rounded-lg border border-border bg-muted/30 p-3.5">
                  <h3 className="text-xs font-semibold text-foreground">{alert.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{alert.body}</p>
                </div>
              ))}
              <Button asChild variant="outline" className="w-full">
                <Link to={ROUTES.app.recommendations}>{copy.insights.cta}</Link>
              </Button>
            </div>
          </AppPanel>

          {/* System Status */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {copy.insights.systemLabel}
              </span>
              <span className="size-2 rounded-full bg-emerald-500" />
            </div>
            <p className="mt-2.5 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Activity className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden />
              {copy.insights.systemStatus}
            </p>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Đồng bộ tự động theo thời gian thực chuẩn GHG Protocol Scope 1-3.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
