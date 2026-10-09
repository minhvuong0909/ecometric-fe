import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/shared/components/ui/button";
import { ROUTES } from "@/shared/constants/routes";

export function MarketingHero() {
  const reduced = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const artworkY = useTransform(scrollYProgress, [0, 1], [0, -28]);

  return (
    <section ref={heroRef} id="top" className="home-intro scroll-mt-20">
      <motion.div className="home-document-background" aria-hidden="true" style={{ y: reduced ? 0 : artworkY }}>
        <img src="/images/ecometric-documents-reference.png" alt="" width="1200" height="1200" fetchPriority="high" />
      </motion.div>
      <div className="home-container home-intro-grid">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>
          <p className="home-kicker">Nền tảng kiểm kê phát thải cho doanh nghiệp</p>
          <h1>Hiểu rõ phát thải.<br /><span>Chủ động giảm carbon.</span></h1>
          <p className="home-lead">
            Tập hợp dữ liệu điện, nhiên liệu và vận chuyển. Theo dõi phát thải,
            lập báo cáo và xác định ưu tiên cải thiện cùng EcoMetric.
          </p>
          <div className="home-actions">
            <Button asChild size="lg">
              <Link to={ROUTES.register}>
                Dùng thử miễn phí <ArrowRight className="ml-2 size-4" aria-hidden="true" />
              </Link>
            </Button>
            <a className="home-text-link" href="#workflow">
              Xem cách EcoMetric hoạt động <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
