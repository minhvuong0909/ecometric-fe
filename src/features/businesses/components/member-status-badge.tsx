import { MEMBER_STATUS_LABELS } from "@/features/businesses/constants/businesses-copy";
import type { MemberStatus } from "@/features/businesses/types/businesses.types";
import { Badge, type badgeVariants } from "@/shared/components/ui/badge";
import type { VariantProps } from "class-variance-authority";

const STATUS_VARIANTS: Record<MemberStatus, VariantProps<typeof badgeVariants>["variant"]> = {
  INVITED: "info",
  ACTIVE: "success",
  DISABLED: "warning",
  REMOVED: "neutral",
};

type MemberStatusBadgeProps = {
  status: MemberStatus;
  className?: string;
};

export function MemberStatusBadge({ status, className }: MemberStatusBadgeProps) {
  return (
    <Badge variant={STATUS_VARIANTS[status]} className={className}>
      {MEMBER_STATUS_LABELS[status]}
    </Badge>
  );
}
