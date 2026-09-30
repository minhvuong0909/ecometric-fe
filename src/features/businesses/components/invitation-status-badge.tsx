import { INVITATION_STATUS_LABELS } from "@/features/businesses/constants/businesses-copy";
import type { InvitationStatus } from "@/features/businesses/types/businesses.types";
import { Badge, type badgeVariants } from "@/shared/components/ui/badge";
import type { VariantProps } from "class-variance-authority";

const STATUS_VARIANTS: Record<InvitationStatus, VariantProps<typeof badgeVariants>["variant"]> = {
  PENDING: "warning",
  ACCEPTED: "success",
  EXPIRED: "neutral",
  REVOKED: "danger",
};

type InvitationStatusBadgeProps = {
  status: InvitationStatus;
  className?: string;
};

export function InvitationStatusBadge({ status, className }: InvitationStatusBadgeProps) {
  return (
    <Badge variant={STATUS_VARIANTS[status]} className={className}>
      {INVITATION_STATUS_LABELS[status]}
    </Badge>
  );
}
