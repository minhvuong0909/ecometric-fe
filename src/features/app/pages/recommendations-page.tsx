import { Link } from "react-router";
import { AppPageHeader } from "@/features/app/components/app-page-header";
import { AppPanel } from "@/features/app/components/app-panel";
import { RECOMMENDATIONS_COPY } from "@/features/app/constants/app-copy";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

const PRIORITY_STYLES: Record<string, string> = {
  "Ưu tiên cao": "bg-red-100 text-red-800",
  "Ưu tiên trung bình": "bg-amber-100 text-amber-800",
  "Ưu tiên thấp": "bg-emerald-100 text-emerald-800",
};

export function RecommendationsPage() {
  const copy = RECOMMENDATIONS_COPY;

  return (
    <div className="space-y-8">
      <AppPageHeader
        breadcrumbs={copy.breadcrumbs}
        title={copy.title}
        description={copy.description}
      />

      <div className="flex flex-wrap gap-2">
        {copy.filters.map((filter, index) => (
          <Button
            key={filter}
            variant={index === 0 ? "default" : "outline"}
            size="sm"
            className={index === 0 ? "font-bold" : undefined}
          >
            {filter}
          </Button>
        ))}
      </div>

      <AppPanel bodyClassName="bg-secondary text-secondary-foreground">
        <p className="text-xs font-bold tracking-widest text-accent uppercase">Thông tin chuyên sâu nổi bật</p>
        <h2 className="mt-2 text-xl font-bold">{copy.hero.title}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed opacity-90">{copy.hero.body}</p>
        <p className="mt-4 text-sm font-semibold text-accent">
          Nguồn trọng tâm: {copy.hero.focus}
        </p>
      </AppPanel>

      <div className="grid gap-6 lg:grid-cols-3">
        {copy.cards.map((card) => (
          <AppPanel key={card.title} interactive className="group">
            <span
              className={cn(
                "inline-flex rounded-full px-2.5 py-1 text-xs font-bold",
                PRIORITY_STYLES[card.priority],
              )}
            >
              {card.priority}
            </span>
            <h3 className="mt-4 text-lg font-semibold text-secondary-foreground transition-colors group-hover:text-primary">
              {card.title}
            </h3>
            <p className="mt-1 text-xs font-bold tracking-wide text-muted-foreground uppercase">
              {card.related}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {card.actions.map((action) => (
                <li key={action} className="flex items-start gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                  {action}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm font-semibold text-primary">{card.impact}</p>
            <Button variant="outline" size="sm" className="mt-4">
              Lập kế hoạch hành động
            </Button>
          </AppPanel>
        ))}
      </div>

      <div className="flex justify-end">
        <Button asChild className="font-bold">
          <Link to={ROUTES.app.reports}>Mở báo cáo</Link>
        </Button>
      </div>
    </div>
  );
}
