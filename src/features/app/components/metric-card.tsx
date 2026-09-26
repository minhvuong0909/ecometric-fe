import { useRef, type MouseEvent } from "react";
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
  enableTilt?: boolean;
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
  enableTilt = true,
}: MetricCardProps) {
  const cardRef = useRef<HTMLElement>(null);

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

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const el = cardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    el.style.setProperty("--mouse-x", `${x}px`);
    el.style.setProperty("--mouse-y", `${y}px`);
    el.style.setProperty("--spotlight-opacity", "1");

    if (enableTilt) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;
      el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
    }
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--spotlight-opacity", "0");
    if (enableTilt) {
      el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    }
  };

  return (
    <article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={
        {
          "--mouse-x": "50%",
          "--mouse-y": "50%",
          "--spotlight-opacity": "0",
          transition: "transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.25s ease-out, border-color 0.25s ease-out",
        } as React.CSSProperties
      }
      className={cn(
        "group relative flex flex-col justify-between gap-5 rounded-2xl border border-border/80 bg-card p-5.5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] overflow-hidden",
        "hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 dark:shadow-[0_4px_24px_-6px_rgba(0,0,0,0.5)]",
        "eco-tactile will-change-transform",
        className,
      )}
    >
      {/* Dynamic Cursor Spotlight Radial Glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(280px circle at var(--mouse-x) var(--mouse-y), rgba(16, 185, 129, 0.14), transparent 75%)`,
          opacity: "var(--spotlight-opacity, 0)",
        }}
        aria-hidden="true"
      />

      {/* Top subtle emerald gradient line on hover */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Header with Icon and Live status */}
      <div className="relative z-10 flex items-center justify-between gap-3">
        <div
          className={cn(
            "flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30 shadow-sm",
            iconClassName,
          )}
        >
          <Icon className="size-5 transition-colors duration-300" aria-hidden />
        </div>
        {live ? (
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 backdrop-blur-xs">
            <span className="relative flex size-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full size-1.5 bg-emerald-500" />
            </span>
            Trực tiếp
          </div>
        ) : null}
      </div>

      {/* Metric details */}
      <div className="relative z-10 space-y-1.5">
        <p className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
          {label}
        </p>
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-3xl font-black tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary">
            {numValue !== null && !isNaN(numValue) ? (
              <CountUp
                value={numValue}
                prefix={prefix}
                suffix={suffix}
                decimals={decimals}
              />
            ) : (
              value
            )}
          </p>
          {isPositiveTrend || isNegativeTrend ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold transition-transform duration-200 group-hover:scale-105",
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
