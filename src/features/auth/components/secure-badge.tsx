import { Lock } from "lucide-react";
import { cn } from "@/shared/lib/utils";

type SecureBadgeProps = {
  className?: string;
};

export function SecureBadge({ className }: SecureBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1",
        className,
      )}
    >
      <Lock className="size-3.5 text-muted-foreground" aria-hidden />
      <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Secure workspace login
      </span>
    </div>
  );
}
