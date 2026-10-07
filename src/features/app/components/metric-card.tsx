import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { CountUp } from "@/shared/components/motion/count-up";
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
  animateValue?: boolean;
};

export function MetricCard({
  icon: Icon,
  label,
  value,
  hint,
  hintClassName,
  live = false,
  iconClassName,
  className,
  animateValue = true,
}: MetricCardProps) {
  // Parse numeric part and unit suffix for CountUp
  const match = value.match(/^([^\d.-]*)([\d,]+(?:\.\d+)?)(.*)$/);
  const prefix = match ? match[1] : "";
  const rawNumStr = match ? match[2].replace(/,/g, "") : null;
  const numValue = rawNumStr ? parseFloat(rawNumStr) : null;
  const suffix = match ? match[3] : "";
  const decimals = match && match[2].includes(".") ? match[2].split(".")[1].length : 0;

  // Detect trend (+8%, -5%, etc.)
  const isPositiveTrend = hint?.includes("+");
  const isNegativeTrend = hint?.includes("-");

  return (
    <article
      className={cn(
        "flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition-colors duration-150",
        "hover:border-primary/40",
        className,
      )}
    >
      {/* Header with Icon and Live status */}
      <div className="flex items-center justify-between gap-3">
        <div
          className={cn(
            "flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary",
            iconClassName,
          )}
        >
          <Icon className="size-5" aria-hidden />
        </div>
        {live ? (
          <div className="flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Trực tiếp
          </div>
        ) : null}
      </div>

      {/* Metric details */}
      <div className="space-y-1.5">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-2xl font-bold tracking-tight text-foreground">
            {animateValue && numValue !== null && !isNaN(numValue) ? (
              <CountUp
                value={numValue}
                prefix={prefix}
                suffix={suffix}
                decimals={decimals}
                duration={700}
              />
            ) : (
              value
            )}
          </p>
          {isPositiveTrend || isNegativeTrend ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-semibold",
                isPositiveTrend
                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                  : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
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
          <p className={cn("text-xs text-muted-foreground", hintClassName)}>{hint}</p>
        ) : null}
      </div>
    </article>
  );
}
