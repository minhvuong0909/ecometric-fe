import { BUSINESS_STATUS_LABELS } from "@/features/businesses/constants/businesses-copy";
import type { BusinessStatus } from "@/features/businesses/types/businesses.types";
import { Badge, type badgeVariants } from "@/shared/components/ui/badge";
import type { VariantProps } from "class-variance-authority";

const STATUS_VARIANTS: Record<BusinessStatus, VariantProps<typeof badgeVariants>["variant"]> = {
  ACTIVE: "success",
  SUSPENDED: "warning",
  ARCHIVED: "neutral",
};

type BusinessStatusBadgeProps = {
  status: BusinessStatus;
  className?: string;
};

export function BusinessStatusBadge({ status, className }: BusinessStatusBadgeProps) {
  return (
    <Badge variant={STATUS_VARIANTS[status]} className={className}>
      {BUSINESS_STATUS_LABELS[status]}
    </Badge>
  );
}
