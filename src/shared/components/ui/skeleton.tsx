import { cn } from "@/shared/lib/utils";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted/80 duration-1000",
        className,
      )}
      {...props}
    />
  );
}

type TableSkeletonProps = {
  columns?: number;
  rows?: number;
  className?: string;
};

export function TableSkeleton({
  columns = 5,
  rows = 4,
  className,
}: TableSkeletonProps) {
  return (
    <div className={cn("space-y-3 p-6", className)}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex items-center gap-4 py-2">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              className={cn(
                "h-5 rounded-md",
                colIndex === 0
                  ? "w-1/4"
                  : colIndex === 1
                    ? "w-1/5"
                    : colIndex === columns - 1
                      ? "w-16 ml-auto"
                      : "w-1/6",
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
