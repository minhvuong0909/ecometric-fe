import { ArrowRight, BarChart3, Database, Layers } from "lucide-react";
import {
  FEATURES,
  FEATURES_SECTION,
} from "@/features/marketing/constants/marketing-content";
import { Reveal } from "@/shared/components/reveal";
import { cn } from "@/shared/lib/utils";

const ICONS = {
  database: Database,
  layers: Layers,
  "bar-chart": BarChart3,
} as const;

export function MarketingFeatures() {
  return (
    <section id="features" className="scroll-mt-16 bg-card py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="mb-16 max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-secondary-foreground sm:text-4xl">
            {FEATURES_SECTION.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {FEATURES_SECTION.description}
          </p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => {
            const Icon = ICONS[feature.icon];
            const isFeatured = index === 0;

            return (
              <Reveal
                key={feature.title}
                delay={index * 80}
                className={cn(
                  "flex",
                  isFeatured && "md:col-span-2 lg:col-span-2 lg:row-span-2",
                )}
              >
                <article
                  className={cn(
                    "group flex w-full flex-col rounded-xl border p-6 eco-card-hover",
                    isFeatured
                      ? "border-primary/20 bg-[radial-gradient(ellipse_at_top_left,rgba(0,166,62,0.10),transparent_60%)] lg:p-10"
                      : index === 1
                        ? "border-border bg-secondary/60"
                        : "border-border bg-background",
                  )}
                >
                  <div
                    className={cn(
                      "mb-6 flex items-center justify-center rounded-lg bg-secondary transition-colors duration-200 group-hover:bg-primary",
                      isFeatured ? "size-14" : "size-12",
                    )}
                  >
                    <Icon
                      className={cn(
                        "text-primary transition-colors duration-200 group-hover:text-primary-foreground",
                        isFeatured ? "size-6" : "size-5",
                      )}
                      aria-hidden
                    />
                  </div>
                  <h3
                    className={cn(
                      "font-semibold text-secondary-foreground",
                      isFeatured ? "text-2xl" : "text-xl",
                    )}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={cn(
                      "mt-3 flex-1 leading-relaxed text-muted-foreground",
                      isFeatured ? "text-base lg:max-w-md" : "text-sm",
                    )}
                  >
                    {feature.description}
                  </p>
                  {isFeatured ? (
                    <a
                      href="#pricing"
                      className="link-primary mt-6 inline-flex items-center gap-1 text-sm tracking-wide"
                    >
                      {FEATURES_SECTION.learnMore}
                      <ArrowRight className="size-3.5" aria-hidden />
                    </a>
                  ) : null}
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
