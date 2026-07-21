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
        "group relative flex flex-col gap-6 rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20 overflow-hidden",
        className,
      )}
    >
      {/* Top highlight glow */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-center justify-between gap-3">
        <div
          className={cn(
            "flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/15 transition-all duration-300 group-hover:scale-105 group-hover:bg-primary group-hover:text-white group-hover:border-primary",
            iconClassName,
          )}
        >
          <Icon className="size-4 transition-colors duration-300" aria-hidden />
        </div>
        {live ? (
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-600 transition-colors duration-300 group-hover:bg-emerald-500/10">
            <span className="relative flex size-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full size-1.5 bg-emerald-500"></span>
            </span>
            Trực tiếp
          </div>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
          {label}
        </p>
        <p className="text-3xl font-semibold tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
          {value}
        </p>
        {hint ? (
          <p className={cn("text-xs text-muted-foreground/80 transition-colors duration-300 group-hover:text-foreground/95", hintClassName)}>{hint}</p>
        ) : null}
      </div>
    </article>
  );
}
