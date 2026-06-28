import { ArrowRight, BarChart3, Database, Layers } from "lucide-react";
import {
  FEATURES,
  FEATURES_SECTION,
} from "@/features/marketing/constants/marketing-content";
import { cn } from "@/shared/lib/utils";

const ICONS = {
  database: Database,
  layers: Layers,
  "bar-chart": BarChart3,
} as const;

export function MarketingFeatures() {
  return (
    <section id="features" className="bg-card py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-secondary-foreground sm:text-4xl">
            {FEATURES_SECTION.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {FEATURES_SECTION.description}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = ICONS[feature.icon];
            return (
              <article
                key={feature.title}
                className="flex flex-col rounded-lg border border-border p-6 transition-colors duration-150 hover:border-ring/60"
              >
                <div className="mb-6 flex size-12 items-center justify-center rounded-lg bg-secondary">
                  <Icon className="size-5 text-primary" aria-hidden />
                </div>
                <h3 className="text-xl font-semibold text-secondary-foreground">
                  {feature.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
                <a
                  href="#features"
                  className={cn(
                    "link-primary mt-6 inline-flex items-center gap-1 text-sm tracking-wide",
                  )}
                >
                  {FEATURES_SECTION.learnMore}
                  <ArrowRight className="size-3.5" aria-hidden />
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
