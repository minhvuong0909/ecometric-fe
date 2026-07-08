import { Check } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import {
  PRICING_SECTION,
  PRICING_TIERS,
  type PricingInterval,
} from "@/features/marketing/constants/marketing-content";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/components/ui/button";
import { Reveal } from "@/shared/components/reveal";
import { cn } from "@/shared/lib/utils";

function formatPrice(monthlyPrice: number, interval: PricingInterval) {
  if (interval === "annually") {
    return Math.round(monthlyPrice * 0.8);
  }
  return monthlyPrice;
}

export function MarketingPricing() {
  const [interval, setInterval] = useState<PricingInterval>("monthly");

  return (
    <section id="pricing" className="scroll-mt-16 bg-background py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-secondary-foreground sm:text-4xl">
            {PRICING_SECTION.title}
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            {PRICING_SECTION.description}
          </p>

          <div
            className="mt-8 inline-flex rounded-lg border border-border bg-card p-1"
            role="group"
            aria-label={PRICING_SECTION.billingInterval}
          >
            <button
              type="button"
              aria-pressed={interval === "monthly"}
              onClick={() => setInterval("monthly")}
              className={cn(
                "rounded-md px-6 py-2 text-sm font-bold tracking-wide transition-colors duration-150 focus-ring",
                interval === "monthly"
                  ? "bg-secondary-foreground text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {PRICING_SECTION.monthly}
            </button>
            <button
              type="button"
              aria-pressed={interval === "annually"}
              onClick={() => setInterval("annually")}
              className={cn(
                "rounded-md px-6 py-2 text-sm font-bold tracking-wide transition-colors duration-150 focus-ring",
                interval === "annually"
                  ? "bg-secondary-foreground text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {PRICING_SECTION.annually}
            </button>
          </div>
        </Reveal>

        <div className="grid items-start gap-6 lg:grid-cols-3">
          {PRICING_TIERS.map((tier, index) => {
            const isHighlighted = tier.highlighted;
            const price =
              "monthlyPrice" in tier
                ? formatPrice(tier.monthlyPrice, interval)
                : null;

            return (
              <Reveal key={tier.id} delay={index * 90} className="flex">
              <article
                className={cn(
                  "relative flex w-full flex-col rounded-xl border p-8",
                  isHighlighted
                    ? "border-accent bg-secondary-foreground text-primary-foreground shadow-xl lg:-mt-3 lg:pb-10 lg:pt-10"
                    : "border-border bg-card",
                )}
              >
                {isHighlighted && "badge" in tier ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-bold tracking-wider text-accent-foreground uppercase">
                    {tier.badge}
                  </span>
                ) : null}

                <h3
                  className={cn(
                    "text-xl font-semibold",
                    isHighlighted ? "text-white" : "text-secondary-foreground",
                  )}
                >
                  {tier.name}
                </h3>
                <p
                  className={cn(
                    "mt-2 text-sm",
                    isHighlighted ? "text-secondary" : "text-muted-foreground",
                  )}
                >
                  {tier.description}
                </p>

                <div className="mt-6 flex items-baseline gap-1">
                  {"priceLabel" in tier && tier.priceLabel ? (
                    <span
                      className={cn(
                        "text-4xl font-bold tracking-tight",
                        isHighlighted ? "text-white" : "text-secondary-foreground",
                      )}
                    >
                      {tier.priceLabel}
                    </span>
                  ) : (
                    <>
                      <span
                        className={cn(
                          "text-4xl font-bold tracking-tight",
                          isHighlighted ? "text-white" : "text-secondary-foreground",
                        )}
                      >
                        ${price}
                      </span>
                      <span
                        className={cn(
                          "text-base",
                          isHighlighted ? "text-secondary" : "text-muted-foreground",
                        )}
                      >
                        {PRICING_SECTION.perMonth}
                      </span>
                    </>
                  )}
                </div>

                <ul className="mt-8 flex flex-1 flex-col gap-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <Check
                        className={cn(
                          "mt-0.5 size-4 shrink-0",
                          isHighlighted ? "text-accent" : "text-primary",
                        )}
                        aria-hidden
                      />
                      <span
                        className={
                          isHighlighted ? "text-white" : "text-foreground"
                        }
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  variant={isHighlighted ? "default" : "outline"}
                  className={cn(
                    "mt-8 h-12 w-full text-sm font-bold tracking-wide",
                    isHighlighted
                      ? "bg-accent text-accent-foreground hover:bg-accent/90 active:bg-accent/80"
                      : "border-2 border-secondary-foreground text-secondary-foreground hover:bg-muted",
                  )}
                >
                  {tier.id === "enterprise" ? (
                    <a href="#contact">{tier.cta}</a>
                  ) : (
                    <Link to={ROUTES.register}>{tier.cta}</Link>
                  )}
                </Button>
              </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
