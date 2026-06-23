import { MarketingCta } from "@/features/marketing/components/marketing-cta";
import { MarketingFeatures } from "@/features/marketing/components/marketing-features";
import { MarketingFooter } from "@/features/marketing/components/marketing-footer";
import { MarketingHeader } from "@/features/marketing/components/marketing-header";
import { MarketingHero } from "@/features/marketing/components/marketing-hero";
import { MarketingPricing } from "@/features/marketing/components/marketing-pricing";

export function PublicWebsitePage() {
  return (
    <div className="min-h-dvh bg-background">
      <MarketingHeader />
      <main>
        <MarketingHero />
        <MarketingFeatures />
        <MarketingPricing />
        <MarketingCta />
      </main>
      <MarketingFooter />
    </div>
  );
}
