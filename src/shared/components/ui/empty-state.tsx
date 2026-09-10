import type { LucideIcon } from "lucide-react";
import { FolderOpen } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  icon: Icon = FolderOpen,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center",
        className,
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground border border-border shadow-xs">
        <Icon className="size-6 text-muted-foreground/80" aria-hidden />
      </div>

      <h3 className="mt-4 text-base font-bold text-foreground">{title}</h3>

      {description ? (
        <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}

      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
