import { cn } from "@/shared/lib/utils";

type LogoProps = {
  className?: string;
  variant?: "default" | "onDark";
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg";
};

export function Logo({
  className,
  variant = "default",
  iconOnly = false,
  size = "md",
}: LogoProps) {
  const isOnDark = variant === "onDark";

  const sizeClasses = {
    sm: "size-8",
    md: "size-10",
    lg: "size-12",
  }[size];

  return (
    <div className={cn("group flex items-center gap-3", className)}>
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-xl shadow-sm transition-transform duration-300 group-hover:scale-105",
          sizeClasses,
        )}
      >
        <img
          src="/logo.png"
          alt="EcoMetric"
          className="size-full object-cover rounded-xl"
        />
      </div>
      {iconOnly ? null : (
        <span
          className={cn(
            "text-xl font-bold tracking-tight select-none",
            isOnDark ? "text-white" : "text-foreground",
          )}
        >
          Eco<span className="text-primary">Metric</span>
        </span>
      )}
    </div>
  );
}
