import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

type AppPanelProps = {
  title?: string;
  description?: string;
  badge?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
};

export function AppPanel({
  title,
  description,
  badge,
  children,
  className,
  bodyClassName,
}: AppPanelProps) {
  return (
    <section className={cn("rounded-xl border border-border bg-card shadow-sm", className)}>
      {title ? (
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-secondary-foreground">{title}</h2>
            {description ? (
              <p className="text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {badge}
        </div>
      ) : null}
      <div className={cn("p-6", bodyClassName)}>{children}</div>
    </section>
  );
}
