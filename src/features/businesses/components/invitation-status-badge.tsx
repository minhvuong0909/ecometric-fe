import { INVITATION_STATUS_LABELS } from "@/features/businesses/constants/businesses-copy";
import type { InvitationStatus } from "@/features/businesses/types/businesses.types";
import { cn } from "@/shared/lib/utils";

const STATUS_STYLES: Record<InvitationStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  ACCEPTED: "bg-secondary text-primary",
  EXPIRED: "bg-muted text-muted-foreground",
  REVOKED: "bg-red-100 text-red-800",
};

type InvitationStatusBadgeProps = {
  status: InvitationStatus;
  className?: string;
};

export function InvitationStatusBadge({
  status,
  className,
}: InvitationStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        STATUS_STYLES[status],
        className,
      )}
    >
      {INVITATION_STATUS_LABELS[status]}
    </span>
  );
}
