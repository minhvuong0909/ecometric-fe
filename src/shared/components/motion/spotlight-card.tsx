import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
};

export function SpotlightCard({ children, className, onClick }: SpotlightCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-xl border border-border bg-card p-6 shadow-sm transition-colors duration-150",
        "hover:border-primary/40",
        className,
      )}
    >
      {children}
    </div>
  );
}
