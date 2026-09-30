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
  /**
   * @deprecated Không còn hiệu ứng đèn rọi theo con trỏ; giữ prop để tương thích ngược,
   * hành xử giống `interactive`.
   */
  spotlight?: boolean;
};

export function AppPanel({
  title,
  description,
  badge,
  children,
  className,
  bodyClassName,
  interactive = false,
  spotlight = false,
}: AppPanelProps) {
  const isInteractive = interactive || spotlight;

  return (
    <section
      className={cn(
        "rounded-xl border border-border bg-card shadow-sm",
        isInteractive ? "eco-card-hover hover:border-primary/40" : "eco-surface-hover",
        className,
      )}
    >
      {title ? (
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold tracking-tight text-foreground">{title}</h2>
            {description ? (
              <p className="text-xs text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {badge}
        </div>
      ) : null}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}
