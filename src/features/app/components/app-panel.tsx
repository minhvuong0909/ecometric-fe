import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

type AppPanelProps = {
  title?: string;
  description?: string;
  badge?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  /** Nhấc thẻ + viền xanh khi hover (dùng cho thẻ có thể bấm/nổi bật). */
  interactive?: boolean;
};

export function AppPanel({
  title,
  description,
  badge,
  children,
  className,
  bodyClassName,
  interactive = false,
}: AppPanelProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border/80 bg-card shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] transition-all duration-300 dark:shadow-[0_4px_24px_-6px_rgba(0,0,0,0.5)]",
        interactive ? "eco-card-hover" : "eco-surface-hover",
        className,
      )}
    >
      {title ? (
        <div className="flex items-start justify-between gap-4 border-b border-border/60 px-6 py-5">
          <div className="space-y-1">
            <h2 className="text-base font-bold tracking-tight text-foreground">{title}</h2>
            {description ? (
              <p className="text-xs text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {badge}
        </div>
      ) : null}
      <div className={cn("p-6", bodyClassName)}>{children}</div>
    </section>
  );
}
