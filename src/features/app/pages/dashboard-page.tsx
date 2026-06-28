import {
  Activity,
  BarChart3,
  Database,
  Leaf,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router";
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
          <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
            <div className="relative flex size-44 items-center justify-center rounded-full border-8 border-primary/20 bg-secondary">
              <div className="text-center">
                <p className="text-2xl font-bold text-secondary-foreground">
                  {copy.emissionBySource.center}
                </p>
                <p className="text-xs text-muted-foreground">{copy.emissionBySource.centerLabel}</p>
              </div>
            </div>
            <ul className="flex-1 space-y-3">
              {copy.emissionBySource.items.map((item) => (
                <li key={item.label} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="size-3 rounded-sm bg-primary" aria-hidden />
                    {item.label}
                  </span>
                  <span className="font-semibold">{item.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </AppPanel>

        <AppPanel
          title={copy.monthlyTrend.title}
          description={copy.monthlyTrend.subtitle}
          className="lg:col-span-3"
        >
          <div className="flex h-48 items-end justify-between gap-2 px-2">
            {copy.monthlyTrend.months.map((month, index) => (
              <div key={month} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-md bg-primary/80"
                  style={{ height: `${40 + index * 12}%` }}
                />
                <span className="text-xs text-muted-foreground">{month}</span>
              </div>
            ))}
          </div>
        </AppPanel>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <AppPanel
          title={copy.scopeBreakdown.title}
          description={copy.scopeBreakdown.subtitle}
          className="lg:col-span-2"
        >
          <div className="flex h-56 items-end justify-center gap-8 px-4">
            {copy.scopeBreakdown.scopes.map((scope) => (
              <div key={scope.label} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-40 w-full items-end justify-center rounded-t-lg bg-primary/10">
                  <div className={cn("w-16 rounded-t-lg bg-primary", scope.height)} />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{scope.label}</span>
              </div>
            ))}
          </div>
        </AppPanel>

        <div className="space-y-6">
          <AppPanel title={copy.insights.title}>
            <div className="space-y-6">
              {copy.insights.alerts.map((alert) => (
                <div key={alert.title} className="space-y-2 border-b border-border pb-4 last:border-0 last:pb-0">
                  <h3 className="font-semibold text-secondary-foreground">{alert.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{alert.body}</p>
                </div>
              ))}
              <Button asChild variant="outline" className="w-full">
                <Link to={ROUTES.app.recommendations}>{copy.insights.cta}</Link>
              </Button>
            </div>
          </AppPanel>

          <div className="rounded-xl bg-secondary-foreground p-5 text-primary-foreground">
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
