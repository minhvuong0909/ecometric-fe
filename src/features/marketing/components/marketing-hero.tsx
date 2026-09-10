import { Link } from "react-router";
import { DashboardPreview } from "@/features/auth/components/dashboard-preview";
import { HERO_COPY } from "@/features/marketing/constants/marketing-content";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

export function MarketingHero() {
  return (
    <section
      id="top"
      className={cn(
        "relative scroll-mt-16 overflow-hidden pb-24 pt-20 lg:pb-32 lg:pt-24",
        "bg-[radial-gradient(ellipse_at_top_right,rgba(74,222,128,0.08),transparent_55%)]",
      )}
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5">
            <span className="size-2 rounded-full bg-accent" aria-hidden />
            <span className="text-xs font-medium text-primary">{HERO_COPY.badge}</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.15]">
            {HERO_COPY.titleLead}{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              {HERO_COPY.titleHighlight}
            </span>
          </h1>

          <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
            {HERO_COPY.description}
          </p>

          <div className="flex flex-col gap-3.5 pt-2 sm:flex-row sm:items-center">
            <Button
              asChild
              size="lg"
              className="h-13 bg-gradient-to-r from-emerald-600 to-teal-600 px-8 text-sm font-bold tracking-wide text-white shadow-lg shadow-emerald-600/25 hover:from-emerald-700 hover:to-teal-700"
            >
              <Link to={ROUTES.register}>{HERO_COPY.ctaPrimary}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-13 gap-2 border border-border/80 px-8 text-sm font-bold tracking-wide text-foreground hover:bg-muted"
            >
              <a href="#workflow">Tìm hiểu quy trình 3 bước</a>
            </Button>
          </div>

          {/* Real-world trust counters */}
          <div className="pt-6 border-t border-border/60 grid grid-cols-3 gap-4">
            <div>
              <p className="text-2xl font-extrabold text-foreground">150+</p>
              <p className="text-xs text-muted-foreground">Doanh nghiệp tin dùng</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">90%</p>
              <p className="text-xs text-muted-foreground">Tiết kiệm thời gian</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-foreground">100%</p>
              <p className="text-xs text-muted-foreground">Sẵn sàng kiểm toán</p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div
            className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-accent/20 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-12 -left-12 size-48 rounded-full bg-secondary-foreground/10 blur-3xl"
            aria-hidden
          />
          <DashboardPreview className="relative" />
        </div>
      </div>
    </section>
  );
}
