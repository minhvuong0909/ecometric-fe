import { MarketingCta } from "@/features/marketing/components/marketing-cta";
import { MarketingFaq } from "@/features/marketing/components/marketing-faq";
import { MarketingFeatures } from "@/features/marketing/components/marketing-features";
import { MarketingFooter } from "@/features/marketing/components/marketing-footer";
import { MarketingHeader } from "@/features/marketing/components/marketing-header";
import { MarketingHero } from "@/features/marketing/components/marketing-hero";
import { MarketingPricing } from "@/features/marketing/components/marketing-pricing";
import { MarketingStandards } from "@/features/marketing/components/marketing-standards";
import { MarketingWorkflow } from "@/features/marketing/components/marketing-workflow";

export function PublicWebsitePage() {
  return (
    <div className="min-h-dvh bg-background">
      <MarketingHeader />
      <main>
        <MarketingHero />
        <MarketingStandards />
        <MarketingWorkflow />
        <MarketingFeatures />
        <MarketingPricing />
        <MarketingFaq />
        <MarketingCta />
      </main>
      <MarketingFooter />
    </div>
  );
}
