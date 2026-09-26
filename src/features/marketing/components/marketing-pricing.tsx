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
                "rounded-md px-6 py-2 text-sm font-bold tracking-wide transition-all duration-150 focus-ring eco-tactile",
                interval === "monthly"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-primary",
              )}
            >
              {PRICING_SECTION.monthly}
            </button>
            <button
              type="button"
              aria-pressed={interval === "annually"}
              onClick={() => setInterval("annually")}
              className={cn(
                "rounded-md px-6 py-2 text-sm font-bold tracking-wide transition-all duration-150 focus-ring eco-tactile",
                interval === "annually"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-primary",
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
                  "relative flex w-full flex-col rounded-2xl border p-8 transition-all duration-300",
                  isHighlighted
                    ? "border-2 border-primary bg-gradient-to-b from-primary/10 via-card to-card shadow-2xl shadow-primary/10 lg:-mt-3 lg:pb-10 lg:pt-10"
                    : "border-border/80 bg-card hover:border-primary/40",
                )}
              >
                {isHighlighted && "badge" in tier ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold tracking-wider text-primary-foreground uppercase shadow-md">
                    {tier.badge}
                  </span>
                ) : null}

                <h3
                  className={cn(
                    "text-xl font-bold",
                    isHighlighted ? "text-primary" : "text-foreground",
                  )}
                >
                  {tier.name}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {tier.description}
                </p>

                <div className="mt-6 flex items-baseline gap-1">
                  {"priceLabel" in tier && tier.priceLabel ? (
                    <span className="text-4xl font-extrabold tracking-tight text-foreground">
                      {tier.priceLabel}
                    </span>
                  ) : (
                    <>
                      <span className="text-4xl font-extrabold tracking-tight text-foreground">
                        ${price}
                      </span>
                      <span className="text-base text-muted-foreground">
                        {PRICING_SECTION.perMonth}
                      </span>
                    </>
                  )}
                </div>

                <ul className="mt-8 flex flex-1 flex-col gap-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  variant={isHighlighted ? "default" : "outline"}
                  className={cn(
                    "eco-tactile mt-8 h-12 w-full text-sm font-bold tracking-wide",
                    isHighlighted
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/25 hover:from-emerald-700 hover:to-teal-700"
                      : "border border-border/80 text-foreground hover:bg-muted",
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
