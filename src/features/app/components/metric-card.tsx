import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/shared/lib/utils";

type MetricCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  hintClassName?: string;
  live?: boolean;
  iconClassName?: string;
  className?: string;
};

export function MetricCard({
  icon: Icon,
  label,
  value,
  hint,
  hintClassName,
  live = true,
  iconClassName,
  className,
}: MetricCardProps) {
  // Detect trend (+8%, -5%, etc.)
  const isPositiveTrend = hint?.includes("+");
  const isNegativeTrend = hint?.includes("-");

  return (
    <article
      className={cn(
        "group relative flex flex-col justify-between gap-5 rounded-xl border border-border/80 bg-card p-5.5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 dark:shadow-[0_4px_24px_-6px_rgba(0,0,0,0.5)] overflow-hidden",
        className,
      )}
    >
      {/* Top subtle emerald gradient line on hover */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Header with Icon and Live status */}
      <div className="flex items-center justify-between gap-3">
        <div
          className={cn(
            "flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 transition-all duration-300 group-hover:scale-105 group-hover:bg-primary group-hover:text-white dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30",
            iconClassName,
          )}
        >
          <Icon className="size-5 transition-colors duration-300" aria-hidden />
        </div>
        {live ? (
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <span className="relative flex size-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full size-1.5 bg-emerald-500" />
            </span>
            Trực tiếp
          </div>
        ) : null}
      </div>

      {/* Metric details */}
      <div className="space-y-1.5">
        <p className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
          {label}
        </p>
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-3xl font-extrabold tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary">
            {value}
          </p>
          {isPositiveTrend || isNegativeTrend ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold",
                isPositiveTrend
                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                  : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
              )}
            >
              {isPositiveTrend ? (
                <TrendingUp className="size-3" />
              ) : (
                <TrendingDown className="size-3" />
              )}
              {hint?.split(" ")[0]}
            </span>
          ) : null}
        </div>
        {hint ? (
          <p
            className={cn(
              "text-xs text-muted-foreground transition-colors duration-200 group-hover:text-foreground",
              hintClassName,
            )}
          >
            {hint}
          </p>
        ) : null}
      </div>
    </article>
  );
}
