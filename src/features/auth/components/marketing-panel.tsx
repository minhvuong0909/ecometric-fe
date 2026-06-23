import { DashboardPreview } from "@/features/auth/components/dashboard-preview";
import { cn } from "@/shared/lib/utils";

type MarketingPanelProps = {
  className?: string;
};

export function MarketingPanel({ className }: MarketingPanelProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col justify-center overflow-hidden bg-[var(--ecometric-green-dark)] p-8 lg:p-12",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(10,66,46,0.9),transparent_50%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(26,102,57,0.85),transparent_50%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-lg space-y-12">
        <div className="space-y-4">
          <p className="text-xs font-medium tracking-widest text-accent uppercase">
            EcoMetric Platform
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl lg:leading-tight">
            Track your emissions and ESG progress in one platform.
          </h2>
        </div>

        <DashboardPreview />
      </div>
    </div>
  );
}
