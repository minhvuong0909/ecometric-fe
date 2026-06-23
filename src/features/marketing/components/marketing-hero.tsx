import { Play } from "lucide-react";
import { Link } from "react-router";
import { DashboardPreview } from "@/features/auth/components/dashboard-preview";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

export function MarketingHero() {
  return (
    <section
      id="top"
      className={cn(
        "relative overflow-hidden pb-24 pt-20 lg:pb-32 lg:pt-24",
        "bg-[radial-gradient(ellipse_at_top_right,rgba(74,222,128,0.08),transparent_55%)]",
      )}
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5">
            <span
              className="size-2 rounded-full bg-accent"
              aria-hidden
            />
            <span className="text-xs font-medium text-primary">
              New: Scope 3 Value Chain Module
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-secondary-foreground sm:text-5xl lg:text-[3rem] lg:leading-[1.15]">
            Automate Carbon Accounting.{" "}
            <span className="text-primary">Accelerate ESG Compliance.</span>
          </h1>

          <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
            Effortlessly track and report Scope 1, 2, and 3 emissions with our
            high-fidelity analytics platform built for modern sustainability
            teams.
          </p>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
            <Button
              asChild
              size="lg"
              className="h-14 bg-accent px-8 text-sm font-bold tracking-wide text-accent-foreground shadow-sm hover:bg-accent/90 active:bg-accent/80"
            >
              <Link to="/register">Get Started Free</Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-14 gap-2 border-2 border-secondary-foreground/10 px-8 text-sm font-bold tracking-wide text-secondary-foreground hover:bg-muted active:bg-muted/80"
            >
              <Play className="size-4 fill-current" aria-hidden />
              Watch Demo
            </Button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-accent/20 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -bottom-12 -left-12 size-48 rounded-full bg-secondary-foreground/10 blur-3xl" aria-hidden />
          <div className="relative rounded-xl border border-white/60 bg-card/40 p-6 shadow-2xl backdrop-blur-md">
            <DashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
