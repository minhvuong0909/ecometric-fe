import { MarketingCta } from "@/features/marketing/components/marketing-cta";
import { MarketingFaq } from "@/features/marketing/components/marketing-faq";
import { MarketingFeatures } from "@/features/marketing/components/marketing-features";
import { MarketingFooter } from "@/features/marketing/components/marketing-footer";
import { MarketingHeader } from "@/features/marketing/components/marketing-header";
import { MarketingHero } from "@/features/marketing/components/marketing-hero";
import { MarketingPricing } from "@/features/marketing/components/marketing-pricing";
import { MarketingChallenges } from "@/features/marketing/components/marketing-challenges";
import { MarketingPointer } from "@/features/marketing/components/marketing-pointer";
import "@/features/marketing/styles/homepage.css";

export function PublicWebsitePage() {
  return (
    <div className="eco-brand eco-home min-h-dvh bg-background">
      <MarketingPointer />
      <MarketingHeader />
      <main>
        <MarketingHero />
        <MarketingChallenges />
        <MarketingFeatures />
        <MarketingPricing />
        <MarketingFaq />
        <MarketingCta />
      </main>
      <MarketingFooter />
    </div>
  );
}
