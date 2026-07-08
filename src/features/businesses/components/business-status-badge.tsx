import { BUSINESS_STATUS_LABELS } from "@/features/businesses/constants/businesses-copy";
import type { BusinessStatus } from "@/features/businesses/types/businesses.types";
import { cn } from "@/shared/lib/utils";

const STATUS_STYLES: Record<BusinessStatus, string> = {
  ACTIVE: "bg-secondary text-primary",
  SUSPENDED: "bg-amber-100 text-amber-800",
  ARCHIVED: "bg-muted text-muted-foreground",
};

type BusinessStatusBadgeProps = {
  status: BusinessStatus;
  className?: string;
};

export function BusinessStatusBadge({
  status,
  className,
}: BusinessStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        STATUS_STYLES[status],
        className,
      )}
    >
      {BUSINESS_STATUS_LABELS[status]}
    </span>
  );
}
