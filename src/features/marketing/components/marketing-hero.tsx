import { Link } from "react-router";
import { Globe2, ShieldCheck, Award } from "lucide-react";
import { DashboardPreview } from "@/features/auth/components/dashboard-preview";
import { HERO_COPY } from "@/features/marketing/constants/marketing-content";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

const HERO_STANDARDS = [
  { label: "Phạm vi 1, 2 & 3", icon: Globe2 },
  { label: "Chuẩn GHG Protocol", icon: ShieldCheck },
  { label: "ISO 14064-1:2018", icon: Award },
] as const;

export function MarketingHero() {
  return (
    <section id="top" className="scroll-mt-16 border-b border-border bg-background pb-20 pt-16 lg:pb-28 lg:pt-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 border border-border">
            <span className="size-2 rounded-full bg-accent" aria-hidden />
            <span className="text-xs font-semibold text-primary">{HERO_COPY.badge}</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.15]">
            {HERO_COPY.titleLead} <span className="text-primary">{HERO_COPY.titleHighlight}</span>
          </h1>

          <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
            {HERO_COPY.description}
          </p>

          <div className={cn("flex flex-col gap-3.5 pt-2 sm:flex-row sm:items-center")}>
            <Button asChild size="lg" className="px-8">
              <Link to={ROUTES.register}>{HERO_COPY.ctaPrimary}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8">
              <a href="#workflow">Tìm hiểu quy trình 3 bước</a>
            </Button>
          </div>

          {/* Phạm vi tuân thủ tiêu chuẩn — không dùng số liệu chưa xác thực */}
          <div className="pt-6 border-t border-border grid grid-cols-3 gap-4">
            {HERO_STANDARDS.map(({ label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="size-4 shrink-0 text-primary" aria-hidden />
                <p className="text-xs font-medium text-muted-foreground leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto w-full max-w-xl lg:max-w-none">
          <DashboardPreview className="shadow-lg rounded-xl border border-border" />
        </div>
      </div>
    </section>
  );
}
