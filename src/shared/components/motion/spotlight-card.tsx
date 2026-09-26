import { useRef, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
  /** Màu của ánh sáng spotlight (mặc định emerald) */
  spotlightColor?: string;
  /** Bán kính vùng sáng theo chuột (pixel) */
  size?: number;
  /** Bật hiệu ứng nghiêng 3D nhẹ theo góc chuột */
  enableTilt?: boolean;
  /** Cường độ nghiêng tối đa (độ) */
  maxTilt?: number;
  /** Sự kiện click */
  onClick?: () => void;
};

/**
 * Thẻ tương tác cao cấp với hiệu ứng đèn rọi (Mouse Spotlight Glow)
 * và viền sáng động theo tọa độ chuột mà KHÔNG gây re-render React.
 */
export function SpotlightCard({
  children,
  className,
  spotlightColor = "rgba(16, 185, 129, 0.12)",
  size = 320,
  enableTilt = false,
  maxTilt = 5,
  onClick,
}: SpotlightCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
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
      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`;
    }
  };

  const handleMouseEnter = () => {
    const el = containerRef.current;
    if (!el) return;
    el.style.setProperty("--spotlight-opacity", "1");
  };

  const handleMouseLeave = () => {
    const el = containerRef.current;
    if (!el) return;
    el.style.setProperty("--spotlight-opacity", "0");
    if (enableTilt) {
      el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={
        {
          "--spotlight-color": spotlightColor,
          "--spotlight-size": `${size}px`,
          "--spotlight-opacity": "0",
          transition: enableTilt ? "transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)" : undefined,
        } as React.CSSProperties
      }
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-all duration-300",
        "hover:border-primary/40 hover:shadow-md",
        enableTilt && "will-change-transform",
        className,
      )}
    >
      {/* Vùng sáng tròn mềm mại đi theo chuột bên trong thẻ */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(var(--spotlight-size) circle at var(--mouse-x, 50%) var(--mouse-y, 50%), var(--spotlight-color), transparent 75%)`,
          opacity: "var(--spotlight-opacity, 0)",
        }}
        aria-hidden="true"
      />

      {/* Viền sáng vi điểm (Border Highlight) chạy theo chuột */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(calc(var(--spotlight-size) * 0.7) circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(16, 185, 129, 0.35), transparent 70%)`,
          maskImage: "linear-gradient(black, black) content-box, linear-gradient(black, black)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
        aria-hidden="true"
      />

      {/* Nội dung bên trong được nâng z-index */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
