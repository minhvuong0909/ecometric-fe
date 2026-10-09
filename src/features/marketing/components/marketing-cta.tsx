import { CTA_SECTION } from "@/features/marketing/constants/marketing-content";
import { Link } from "react-router";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/components/ui/button";
import { Reveal } from "@/shared/components/reveal";

export function MarketingCta() {
  return (
    <section id="contact" className="scroll-mt-16 border-t border-border eco-contact py-20">
      <Reveal className="mx-auto max-w-4xl px-6 text-center lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {CTA_SECTION.title}
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          {CTA_SECTION.description}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="px-10">
            <Link to={ROUTES.register}>{CTA_SECTION.primary}</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-border bg-transparent px-10 text-foreground hover:bg-secondary"
          >
            <Link to={ROUTES.login}>Đăng nhập tài khoản</Link>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
