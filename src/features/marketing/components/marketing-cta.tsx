import { CTA_SECTION } from "@/features/marketing/constants/marketing-content";
import { Link } from "react-router";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/components/ui/button";

export function MarketingCta() {
  return (
    <section className="relative overflow-hidden bg-secondary-foreground py-24">
      <div
        className="pointer-events-none absolute -right-36 top-0 size-[600px] rounded-full bg-accent/5 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl sm:leading-tight">
          {CTA_SECTION.title}
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-secondary">
          {CTA_SECTION.description}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="h-14 bg-accent px-10 text-sm font-bold tracking-wide text-accent-foreground shadow-lg hover:bg-accent/90 active:bg-accent/80"
          >
            <Link to={ROUTES.register}>{CTA_SECTION.primary}</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-14 border-white/20 bg-transparent px-10 text-sm font-bold tracking-wide text-white hover:bg-white/10 active:bg-white/15"
          >
            <Link to={ROUTES.register}>{CTA_SECTION.secondary}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
