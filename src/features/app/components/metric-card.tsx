import type { LucideIcon } from "lucide-react";
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
  return (
    <article
      className={cn(
        "group flex flex-col gap-6 rounded-xl border border-border bg-card p-6 shadow-sm eco-card-hover",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex size-10 items-center justify-center rounded-lg bg-secondary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground",
            iconClassName,
          )}
        >
          <Icon className="size-4 text-primary transition-colors duration-200 group-hover:text-primary-foreground" aria-hidden />
        </div>
        {live ? (
          <span className="text-[10px] font-bold tracking-wide text-muted-foreground uppercase">
            Trực tiếp
          </span>
        ) : null}
      </div>
      <div className="space-y-1">
        <p className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        <p className="text-3xl font-normal tracking-tight text-secondary-foreground">{value}</p>
        {hint ? (
          <p className={cn("text-xs text-muted-foreground", hintClassName)}>{hint}</p>
        ) : null}
      </div>
    </article>
  );
}
