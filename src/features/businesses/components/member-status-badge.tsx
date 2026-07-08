import { MEMBER_STATUS_LABELS } from "@/features/businesses/constants/businesses-copy";
import type { MemberStatus } from "@/features/businesses/types/businesses.types";
import { cn } from "@/shared/lib/utils";

const STATUS_STYLES: Record<MemberStatus, string> = {
  INVITED: "bg-sky-100 text-sky-800",
  ACTIVE: "bg-secondary text-primary",
  DISABLED: "bg-amber-100 text-amber-800",
  REMOVED: "bg-muted text-muted-foreground",
};

type MemberStatusBadgeProps = {
  status: MemberStatus;
  className?: string;
};

export function MemberStatusBadge({ status, className }: MemberStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        STATUS_STYLES[status],
        className,
      )}
    >
      {MEMBER_STATUS_LABELS[status]}
    </span>
  );
}
