import { Link } from "react-router";
import { AppPageHeader } from "@/features/app/components/app-page-header";
import { AppPanel } from "@/features/app/components/app-panel";
import { ECO_SCORE_COPY } from "@/features/app/constants/app-copy";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/components/ui/button";

export function EcoScorePage() {
  const copy = ECO_SCORE_COPY;

  return (
    <div className="space-y-8">
      <AppPageHeader
        breadcrumbs={copy.breadcrumbs}
        title={copy.title}
        description={copy.description}
        actions={
          <Button className="bg-accent font-bold text-accent-foreground">{copy.improveCta}</Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <AppPanel className="flex flex-col items-center justify-center text-center lg:col-span-1">
          <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Điểm Eco</p>
          <p className="mt-4 text-6xl font-bold text-secondary-foreground">
            {copy.score}
            <span className="text-2xl text-muted-foreground">{copy.scoreMax}</span>
          </p>
          <p className="mt-2 text-sm font-medium text-primary">{copy.efficiency}</p>
        </AppPanel>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
          {copy.subMetrics.map((metric) => (
            <AppPanel key={metric.title} title={metric.title} bodyClassName="space-y-3">
              <p className="text-sm text-muted-foreground">{metric.target}</p>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${metric.progress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{metric.progress}% trên tổng số điểm tối đa</p>
            </AppPanel>
          ))}
        </div>
      </div>

      <AppPanel
        title={copy.changesTitle}
        badge={
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
            {copy.changesBadge}
          </span>
        }
      >
        <ul className="grid gap-3 sm:grid-cols-2">
          {copy.changes.map((change) => (
            <li
              key={change}
              className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-secondary-foreground"
            >
              {change}
            </li>
          ))}
        </ul>
      </AppPanel>

      <div className="flex justify-end">
        <Button asChild variant="outline">
          <Link to={ROUTES.app.recommendations}>Xem khuyến nghị</Link>
        </Button>
      </div>
    </div>
  );
}
