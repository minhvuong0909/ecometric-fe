import { Link } from "react-router";
import { ArrowRight, Globe2, ShieldCheck, Award } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { EcoBrandScene } from "@/shared/components/eco-brand-scene";
import { HERO_COPY } from "@/features/marketing/constants/marketing-content";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/components/ui/button";

const standards = [{ label: "Phạm vi 1, 2 & 3", icon: Globe2 }, { label: "Chuẩn GHG Protocol", icon: ShieldCheck }, { label: "ISO 14064-1:2018", icon: Award }];
export function MarketingHero() {
  const reduced = useReducedMotion();
  return <section id="top" className="eco-hero scroll-mt-20">
    <div className="mx-auto grid max-w-7xl items-center gap-4 px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:px-8">
      <motion.div className="eco-hero-copy" initial={reduced ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
        <div className="eco-eyebrow"><span /> CARBON INTELLIGENCE / ECOMETRIC</div>
        <h1>{HERO_COPY.titleLead}<br /><span>{HERO_COPY.titleHighlight}</span></h1>
        <p className="eco-hero-description">{HERO_COPY.description}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="eco-primary-cta"><Link to={ROUTES.register}>{HERO_COPY.ctaPrimary}<ArrowRight className="ml-2 size-4" /></Link></Button>
          <Button asChild variant="outline" size="lg"><a href="#workflow">Tìm hiểu quy trình 3 bước</a></Button>
        </div>
        <div className="eco-hero-standards">{standards.map(({ label, icon: Icon }) => <div key={label}><Icon size={17} /><span>{label}</span></div>)}</div>
      </motion.div>
      <EcoBrandScene />
    </div>
    <div className="eco-hero-bottom mx-auto max-w-7xl px-6 lg:px-8"><span>DỮ LIỆU RÕ RÀNG.</span><span>QUYẾT ĐỊNH BỀN VỮNG.</span><a href="#workflow">Khám phá EcoMetric <ArrowRight size={15} /></a></div>
  </section>;
}
