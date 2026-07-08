import { cn } from "@/shared/lib/utils";

type LogoProps = {
  className?: string;
  variant?: "default" | "onDark";
  iconOnly?: boolean;
};

/**
 * EcoMetric mark: một đường tăng trưởng (metric) vươn lên và kết thúc bằng
 * chiếc lá (eco) — thể hiện "đo lường phát thải + phát triển bền vững".
 */
function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
      focusable="false"
    >
      <path
        d="M3.5 16.5 L9 11.5 L13 14 L18.5 7"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="11.5" r="1.15" fill="currentColor" />
      <circle cx="13" cy="14" r="1.15" fill="currentColor" />
      <path
        d="M18.5 7c-.7-3.1 1.1-5.6 4.1-5.6.3 3.1-1.2 5.6-4.1 5.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Logo({
  className,
  variant = "default",
  iconOnly = false,
}: LogoProps) {
  const isOnDark = variant === "onDark";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl text-white shadow-sm ring-1 ring-black/5",
          isOnDark
            ? "bg-gradient-to-br from-accent to-primary"
            : "bg-gradient-to-br from-primary to-accent",
        )}
        aria-hidden
      >
        <LogoMark className="size-6" />
      </div>
      {iconOnly ? null : (
        <span
          className={cn(
            "text-xl font-bold tracking-tight",
            isOnDark ? "text-white" : "text-foreground",
          )}
        >
          Eco<span className="text-primary">Metric</span>
        </span>
      )}
    </div>
  );
}
