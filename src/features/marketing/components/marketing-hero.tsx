import { Link } from "react-router";
import { motion } from "framer-motion";
import { DashboardPreview } from "@/features/auth/components/dashboard-preview";
import { HERO_COPY } from "@/features/marketing/constants/marketing-content";
import { CountUp } from "@/shared/components/motion/count-up";
import { TiltCard } from "@/shared/components/motion/tilt-card";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

export function MarketingHero() {
  return (
    <section
      id="top"
      className={cn(
        "relative scroll-mt-16 overflow-hidden pb-24 pt-20 lg:pb-32 lg:pt-24",
        "bg-[radial-gradient(ellipse_at_top_right,rgba(74,222,128,0.1),transparent_55%)]",
      )}
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary/80 px-4 py-1.5 border border-border/60 shadow-xs">
            <span className="size-2 rounded-full bg-accent animate-pulse" aria-hidden />
            <span className="text-xs font-semibold text-primary">{HERO_COPY.badge}</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.15]">
            {HERO_COPY.titleLead}{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 bg-clip-text text-transparent">
              {HERO_COPY.titleHighlight}
            </span>
          </h1>

          <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
            {HERO_COPY.description}
          </p>

          <div className="flex flex-col gap-3.5 pt-2 sm:flex-row sm:items-center">
            <Button
              asChild
              size="lg"
              className="eco-tactile h-13 bg-gradient-to-r from-emerald-600 to-teal-600 px-8 text-sm font-bold tracking-wide text-white shadow-lg shadow-emerald-600/25 hover:from-emerald-700 hover:to-teal-700"
            >
              <Link to={ROUTES.register}>{HERO_COPY.ctaPrimary}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="eco-tactile h-13 gap-2 border border-border/80 px-8 text-sm font-bold tracking-wide text-foreground hover:bg-muted"
            >
              <a href="#workflow">Tìm hiểu quy trình 3 bước</a>
            </Button>
          </div>

          {/* Real-world trust counters with CountUp */}
          <div className="pt-6 border-t border-border/60 grid grid-cols-3 gap-4">
            <div>
              <p className="text-2xl font-black text-foreground">
                <CountUp value={150} suffix="+" />
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Doanh nghiệp tin dùng</p>
            </div>
            <div>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                <CountUp value={90} suffix="%" />
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Tiết kiệm thời gian</p>
            </div>
            <div>
              <p className="text-2xl font-black text-foreground">
                <CountUp value={100} suffix="%" />
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Sẵn sàng kiểm toán</p>
            </div>
          </div>
        </motion.div>

        {/* 3D Tilt Preview Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-xl lg:max-w-none"
        >
          <div
            className="pointer-events-none absolute -right-12 -top-12 size-56 rounded-full bg-emerald-500/15 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-12 -left-12 size-56 rounded-full bg-teal-500/15 blur-3xl"
            aria-hidden
          />
          <TiltCard maxTilt={6} scale={1.015}>
            <DashboardPreview className="relative shadow-2xl rounded-2xl border border-border/80" />
          </TiltCard>
        </motion.div>
      </div>
    </section>
  );
}
