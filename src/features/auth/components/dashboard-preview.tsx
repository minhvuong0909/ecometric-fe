import {
  BarChart3,
  Check,
  FileText,
  Leaf,
  TrendingDown,
} from "lucide-react";
import { AUTH_COPY } from "@/features/auth/constants/auth-content";
import { cn } from "@/shared/lib/utils";

const BAR_HEIGHT_CLASSES = [
  "h-[51%]",
  "h-[77%]",
  "h-[64%]",
  "h-full",
  "h-[90%]",
  "h-full",
  "h-[83%]",
] as const;

type DashboardPreviewProps = {
  className?: string;
};

export function DashboardPreview({ className }: DashboardPreviewProps) {
  const copy = AUTH_COPY.dashboardPreview;

  return (
    <div
      className={cn(
        "w-full rounded-3xl border border-white/10 bg-card/95 p-6 shadow-2xl backdrop-blur-md",
        className,
      )}
    >
      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            {copy.workspaceLabel}
          </p>
          <h3 className="text-2xl font-semibold text-foreground">{copy.title}</h3>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1">
          <Check className="size-3 text-primary" aria-hidden />
          <span className="text-xs font-medium text-primary">{copy.synced}</span>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-6">
        <div className="space-y-4 rounded-xl border border-border bg-card p-6">
          <div className="flex size-10 items-center justify-center rounded-lg bg-secondary">
            <BarChart3 className="size-4 text-primary" aria-hidden />
          </div>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {copy.totalCo2e}
          </p>
          <p className="text-4xl font-bold tracking-tight text-foreground">248,6t</p>
          <div className="flex items-start gap-1 text-primary">
            <TrendingDown className="mt-1 size-3 shrink-0" aria-hidden />
            <p className="text-sm leading-snug">{copy.totalCo2eTrend}</p>
          </div>
        </div>

        <div className="space-y-4 rounded-xl bg-primary p-6 text-primary-foreground">
          <div className="flex size-10 items-center justify-center rounded-lg bg-white/20">
            <Leaf className="size-4" aria-hidden />
          </div>
          <p className="text-xs font-medium tracking-wide text-primary-foreground/70 uppercase">
            {copy.ecoScore}
          </p>
          <p className="flex items-baseline gap-1">
            <span className="text-4xl font-bold tracking-tight">82</span>
            <span className="text-base text-primary-foreground/50">/ 100</span>
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-muted p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {copy.monthlyTrend}
            </p>
            <p className="text-sm font-semibold tracking-wide text-foreground">
              {copy.monthlyTrendDetail}
            </p>
          </div>
          <FileText className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        </div>
        <div
          className="flex h-32 items-end justify-center gap-3 px-2"
          role="img"
          aria-label={copy.chartAriaLabel}
        >
          {BAR_HEIGHT_CLASSES.map((heightClass, index) => (
            <div
              key={index}
              className="relative flex h-full flex-1 flex-col justify-end rounded-t-lg bg-primary/10"
            >
              <div className={cn("rounded-t-lg bg-primary", heightClass)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
