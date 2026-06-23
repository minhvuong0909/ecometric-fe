import { Leaf } from "lucide-react";
import { cn } from "@/shared/lib/utils";

type LogoProps = {
  className?: string;
  variant?: "default" | "onDark";
};

export function Logo({ className, variant = "default" }: LogoProps) {
  const isOnDark = variant === "onDark";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-lg",
          isOnDark ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground",
        )}
        aria-hidden
      >
        <Leaf className="size-5" strokeWidth={2.25} />
      </div>
      <span
        className={cn(
          "text-xl font-bold tracking-tight",
          isOnDark ? "text-white" : "text-foreground",
        )}
      >
        EcoMetric
      </span>
    </div>
  );
}
