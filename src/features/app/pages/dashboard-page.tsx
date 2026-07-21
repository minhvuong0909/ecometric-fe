import {
  Activity,
  BarChart3,
  Database,
  Leaf,
  TrendingUp,
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
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

const METRIC_ICONS = [BarChart3, Leaf, Database, TrendingUp] as const;

export function DashboardPage() {
  const copy = DASHBOARD_COPY;

  // Dữ liệu Phát thải theo Nguồn
  const sourceData = [
    { name: "Điện", value: 42, color: "#10B981", absoluteValue: "1.34 t" },
    { name: "Nhiên liệu", value: 28, color: "#3B82F6", absoluteValue: "0.90 t" },
    { name: "Vận tải", value: 15, color: "#F59E0B", absoluteValue: "0.48 t" },
    { name: "Chất thải", value: 9, color: "#8B5CF6", absoluteValue: "0.29 t" },
    { name: "Nước", value: 6, color: "#EF4444", absoluteValue: "0.19 t" },
  ];

  // Dữ liệu Xu hướng Hàng tháng
  const monthlyTrendData = [
    { name: "T1", "CO₂e": 1.2 },
    { name: "T2", "CO₂e": 1.5 },
    { name: "T3", "CO₂e": 2.1 },
    { name: "T4", "CO₂e": 2.5 },
    { name: "T5", "CO₂e": 2.8 },
    { name: "T6", "CO₂e": 3.2 },
  ];

  // Dữ liệu Phân rã theo Phạm vi
  const scopeData = [
    { name: "Phạm vi 1", "Phát thải": 1.12, color: "#3B82F6" },
    { name: "Phạm vi 2", "Phát thải": 2.72, color: "#10B981" },
    { name: "Phạm vi 3", "Phát thải": 1.44, color: "#8B5CF6" },
  ];

  return (
    <div className="space-y-8">
      <AppPageHeader
        breadcrumbs={copy.breadcrumbs}
        title={copy.title}
        description={copy.description}
        actions={
          <Button asChild className="bg-accent font-bold text-accent-foreground hover:bg-accent/90">
            <Link to={ROUTES.app.recommendations}>{copy.cta}</Link>
          </Button>
        }
      />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {copy.metrics.map((metric, index) => (
          <MetricCard
            key={metric.label}
            icon={METRIC_ICONS[index]}
            label={metric.label}
            value={metric.value}
            hint={metric.hint}
            hintClassName={"hintClass" in metric ? metric.hintClass : undefined}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <AppPanel
          title={copy.emissionBySource.title}
          description={copy.emissionBySource.subtitle}
          className="lg:col-span-2"
        >
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center justify-between">
            <div className="relative flex size-44 shrink-0 items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={72}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="rounded-lg border border-border bg-white/95 p-2.5 shadow-md text-xs font-medium">
                            <p className="font-bold text-foreground">{data.name}</p>
                            <p className="font-semibold text-emerald-600 mt-0.5">
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
                <p className="text-2xl font-bold text-secondary-foreground">
                  {copy.emissionBySource.center}
                </p>
                <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                  {copy.emissionBySource.centerLabel}
                </p>
              </div>
            </div>
            <ul className="flex-1 w-full space-y-2">
              {copy.emissionBySource.items.map((item, index) => {
                const dotColors = [
                  "bg-emerald-500",
                  "bg-blue-500",
                  "bg-amber-500",
                  "bg-purple-500",
                  "bg-rose-500",
                ];
                return (
                  <li
                    key={item.label}
                    className="group -mx-2 flex items-center justify-between rounded-md px-2 py-1 text-sm transition-colors hover:bg-primary/[0.05]"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={cn("size-2.5 rounded-sm transition-transform duration-250 group-hover:scale-125", dotColors[index])}
                        aria-hidden
                      />
                      {item.label}
                    </span>
                    <span className="font-semibold transition-colors group-hover:text-primary">
                      {item.value}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </AppPanel>

        <AppPanel
          title={copy.monthlyTrend.title}
          description={copy.monthlyTrend.subtitle}
          className="lg:col-span-3"
        >
          <div className="h-56 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEmission" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#64748B", fontSize: 11 }}
                  dy={8}
                />
                <YAxis
                  domain={[0, 4]}
                  ticks={[0, 1, 2, 3, 4]}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val} t`}
                  tick={{ fill: "#64748B", fontSize: 11 }}
                  dx={-4}
                  width={36}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border border-border bg-white/95 p-2.5 shadow-md text-xs font-medium">
                          <p className="font-bold text-muted-foreground">{payload[0].payload.name}</p>
                          <p className="font-semibold text-emerald-600 mt-0.5">
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
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorEmission)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </AppPanel>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <AppPanel
          title={copy.scopeBreakdown.title}
          description={copy.scopeBreakdown.subtitle}
          className="lg:col-span-2"
        >
          <div className="h-56 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scopeData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#64748B", fontSize: 11 }}
                  dy={8}
                />
                <YAxis
                  domain={[0, 3]}
                  ticks={[0, 1, 2, 3]}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val} t`}
                  tick={{ fill: "#64748B", fontSize: 11 }}
                  dx={-4}
                  width={36}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-lg border border-border bg-white/95 p-2.5 shadow-md text-xs font-medium">
                          <p className="font-bold text-muted-foreground">{data.name}</p>
                          <p className="font-semibold text-blue-600 mt-0.5">
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
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={48}
                >
                  {scopeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AppPanel>

        <div className="space-y-6">
          <AppPanel title={copy.insights.title}>
            <div className="space-y-6">
              {copy.insights.alerts.map((alert) => (
                <div
                  key={alert.title}
                  className="group -mx-2 space-y-2 rounded-lg border-b border-border px-2 py-2 transition-colors hover:bg-primary/[0.04] last:border-0"
                >
                  <h3 className="font-semibold text-secondary-foreground transition-colors group-hover:text-primary">
                    {alert.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{alert.body}</p>
                </div>
              ))}
              <Button asChild variant="outline" className="w-full">
                <Link to={ROUTES.app.recommendations}>{copy.insights.cta}</Link>
              </Button>
            </div>
          </AppPanel>

          <div className="rounded-xl bg-secondary-foreground p-5 text-primary-foreground transition-shadow duration-200 hover:shadow-lg hover:shadow-primary/10">
            <p className="text-xs font-bold tracking-widest text-primary uppercase">
              {copy.insights.systemLabel}
            </p>
            <p className="mt-2 flex items-center gap-2 text-lg font-semibold">
              <Activity className="size-4 text-accent" aria-hidden />
              {copy.insights.systemStatus}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
