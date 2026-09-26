import { useRef, type MouseEvent, type ReactNode } from "react";
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
  /** Bật hiệu ứng đèn rọi theo con trỏ chuột */
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
  const panelRef = useRef<HTMLElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (!spotlight && !interactive) return;
    const el = panelRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    el.style.setProperty("--mouse-x", `${x}px`);
    el.style.setProperty("--mouse-y", `${y}px`);
    el.style.setProperty("--spotlight-opacity", "1");
  };

  const handleMouseLeave = () => {
    if (!spotlight && !interactive) return;
    const el = panelRef.current;
    if (!el) return;
    el.style.setProperty("--spotlight-opacity", "0");
  };

  return (
    <section
      ref={panelRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={
        (spotlight || interactive)
          ? ({
              "--mouse-x": "50%",
              "--mouse-y": "50%",
              "--spotlight-opacity": "0",
            } as React.CSSProperties)
          : undefined
      }
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] transition-all duration-300 dark:shadow-[0_4px_24px_-6px_rgba(0,0,0,0.5)]",
        interactive ? "eco-card-hover hover:border-primary/40" : "eco-surface-hover",
        className,
      )}
    >
      {/* Vùng sáng spotlight theo con trỏ chuột */}
      {(spotlight || interactive) && (
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(350px circle at var(--mouse-x) var(--mouse-y), rgba(16, 185, 129, 0.08), transparent 80%)`,
            opacity: "var(--spotlight-opacity, 0)",
          }}
          aria-hidden="true"
        />
      )}

      {title ? (
        <div className="relative z-10 flex items-start justify-between gap-4 border-b border-border/60 px-6 py-5">
          <div className="space-y-1">
            <h2 className="text-base font-bold tracking-tight text-foreground">{title}</h2>
            {description ? (
              <p className="text-xs text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {badge}
        </div>
      ) : null}
      <div className={cn("relative z-10 p-6", bodyClassName)}>{children}</div>
    </section>
  );
}
