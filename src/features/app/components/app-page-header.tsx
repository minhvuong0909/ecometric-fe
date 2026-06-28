import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

type Breadcrumb = {
  readonly label: string;
  readonly active?: boolean;
};

type AppPageHeaderProps = {
  breadcrumbs?: readonly Breadcrumb[];
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export function AppPageHeader({
  breadcrumbs,
  title,
  description,
  actions,
  className,
}: AppPageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="space-y-2">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2">
            {breadcrumbs.map((crumb, index) => (
              <span key={`${crumb.label}-${index}`} className="flex items-center gap-2">
                {index > 0 ? (
                  <span className="text-xs font-bold text-muted-foreground/40">/</span>
                ) : null}
                <span
                  className={cn(
                    "text-[10px] font-bold tracking-widest uppercase",
                    crumb.active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {crumb.label}
                </span>
              </span>
            ))}
          </nav>
        ) : null}
        <h1 className="text-2xl font-semibold tracking-tight text-secondary-foreground sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}
