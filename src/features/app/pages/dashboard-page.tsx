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
import { motion } from "framer-motion";
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
            <div className="flex items-center rounded-xl border border-border/80 bg-muted/40 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setSelectedPeriod("7d")}
                className={cn(
                  "rounded-lg px-3 py-1.5 transition-all duration-200",
                  selectedPeriod === "7d"
                    ? "bg-card text-foreground shadow-sm font-bold"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                7 ngày
              </button>
              <button
                type="button"
                onClick={() => setSelectedPeriod("30d")}
                className={cn(
                  "rounded-lg px-3 py-1.5 transition-all duration-200",
                  selectedPeriod === "30d"
                    ? "bg-card text-foreground shadow-sm font-bold"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Tháng này
              </button>
              <button
                type="button"
                onClick={() => setSelectedPeriod("1y")}
                className={cn(
                  "rounded-lg px-3 py-1.5 transition-all duration-200",
                  selectedPeriod === "1y"
                    ? "bg-card text-foreground shadow-sm font-bold"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Năm 2026
              </button>
            </div>

            {isLoadingSummary && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin text-primary" />
                Đang cập nhật...
              </span>
            )}

            <Button
              asChild
              variant="outline"
              className="gap-2 border-border/80 font-bold hover:bg-muted text-foreground"
            >
              <Link to={ROUTES.app.uploadDoc}>
                <FileUp className="size-4 text-primary" />
                Tải hóa đơn mới
              </Link>
            </Button>

            <Button
              asChild
              className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 font-bold text-white shadow-md shadow-emerald-600/20 hover:from-emerald-700 hover:to-teal-700 hover:shadow-lg transition-all"
            >
              <Link to={ROUTES.app.recommendations}>
                <Sparkles className="size-4" />
                {copy.cta}
              </Link>
            </Button>
          </div>
        }
      />

      {/* KPI Cards Grid */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
      >
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
      </motion.div>

      {/* Main Charts Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="grid gap-6 lg:grid-cols-5"
      >
        {/* Source Donut Chart */}
        <AppPanel
          title={copy.emissionBySource.title}
          description={copy.emissionBySource.subtitle}
          spotlight
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
                <span className="text-2xl font-extrabold tracking-tight text-foreground">
                  {copy.emissionBySource.center}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
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
                    className="group -mx-2 flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors hover:bg-muted/60"
                  >
                    <span className="flex items-center gap-2 font-medium text-foreground">
                      <span
                        className="size-2.5 rounded-full ring-2 ring-transparent transition-all group-hover:ring-offset-1"
                        style={{ backgroundColor: item.color }}
                        aria-hidden
                      />
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-[11px] font-mono">
                        {item.absoluteValue}
                      </span>
                      <span className="font-bold text-foreground transition-colors group-hover:text-primary">
                        {item.value}%
                      </span>
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
          spotlight
          badge={
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="size-3" />
              +8% so với T5
            </div>
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
      </motion.div>

      {/* Secondary Row: Scope Breakdown & ESG Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
        className="grid gap-6 lg:grid-cols-3"
      >
        {/* Scope Breakdown */}
        <AppPanel
          title={copy.scopeBreakdown.title}
          description={copy.scopeBreakdown.subtitle}
          spotlight
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
          <AppPanel title={copy.insights.title} spotlight>
            <div className="space-y-4">
              {copy.insights.alerts.map((alert) => (
                <div
                  key={alert.title}
                  className="group -mx-2 rounded-xl border border-border/40 bg-muted/20 p-3.5 transition-all hover:bg-muted/50 hover:border-primary/30"
                >
                  <h3 className="text-xs font-bold text-foreground transition-colors group-hover:text-primary">
                    {alert.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{alert.body}</p>
                </div>
              ))}
              <Button asChild variant="outline" className="w-full font-semibold border-border/80 hover:bg-muted">
                <Link to={ROUTES.app.recommendations}>{copy.insights.cta}</Link>
              </Button>
            </div>
          </AppPanel>

          {/* System Status Banner */}
          <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 p-5 text-white shadow-lg">
            <div className="absolute -right-8 -top-8 size-28 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold tracking-widest text-emerald-400 uppercase">
                {copy.insights.systemLabel}
              </span>
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full size-2 bg-emerald-500" />
              </span>
            </div>
            <p className="mt-2.5 flex items-center gap-2.5 text-base font-bold text-emerald-50">
              <Activity className="size-4 text-emerald-400 shrink-0" aria-hidden />
              {copy.insights.systemStatus}
            </p>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Đồng bộ tự động theo thời gian thực chuẩn GHG Protocol Scope 1-3.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
