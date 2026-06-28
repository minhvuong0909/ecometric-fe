import { AUTH_COPY } from "@/features/auth/constants/auth-content";
import { Lock } from "lucide-react";
import { cn } from "@/shared/lib/utils";

type SecureBadgeProps = {
  className?: string;
  label?: string;
};

export function SecureBadge({ className, label = AUTH_COPY.secureBadge }: SecureBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1",
        className,
      )}
    >
      <Lock className="size-3.5 text-muted-foreground" aria-hidden />
      <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
    </div>
  );
}
