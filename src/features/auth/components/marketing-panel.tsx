import { Check } from "lucide-react";
import { AUTH_COPY } from "@/features/auth/constants/auth-content";
import { DashboardPreview } from "@/features/auth/components/dashboard-preview";
import { cn } from "@/shared/lib/utils";

type MarketingPanelProps = {
  className?: string;
  variant?: "login" | "register";
};

export function MarketingPanel({ className, variant = "login" }: MarketingPanelProps) {
  const loginCopy = AUTH_COPY.marketingPanel;
  const registerCopy = AUTH_COPY.registerMarketingPanel;

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
        {variant === "login" ? (
          <>
            <div className="space-y-4">
              <p className="text-xs font-medium tracking-widest text-accent uppercase">
                {loginCopy.eyebrow}
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl lg:leading-tight">
                {loginCopy.title}
              </h2>
            </div>
            <DashboardPreview />
          </>
        ) : (
          <>
            <div className="space-y-4">
              <p className="text-xs font-medium tracking-widest text-accent uppercase">
                {registerCopy.eyebrow}
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:leading-tight">
                {registerCopy.title}
              </h2>
              <p className="text-base leading-relaxed text-white/80">
                {registerCopy.description}
              </p>
            </div>

            <ol className="space-y-4">
              {registerCopy.steps.map((step) => (
                <li
                  key={step.label}
                  className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <Check className="size-5 text-accent" aria-hidden />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium tracking-widest text-accent uppercase">
                      {step.label}
                    </p>
                    <p className="font-semibold text-white">{step.title}</p>
                  </div>
                </li>
              ))}
            </ol>
          </>
        )}
      </div>
    </div>
  );
}
