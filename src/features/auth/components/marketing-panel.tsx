import { Check, ShieldCheck, Sparkles } from "lucide-react";
import { AUTH_COPY } from "@/features/auth/constants/auth-content";
import { DashboardPreview } from "@/features/auth/components/dashboard-preview";
import { CountUp } from "@/shared/components/motion/count-up";
import { TiltCard } from "@/shared/components/motion/tilt-card";
import { cn } from "@/shared/lib/utils";

type MarketingPanelProps = {
  className?: string;
  variant?: "login" | "register";
};

export function MarketingPanel({ className, variant = "login" }: MarketingPanelProps) {
  const loginCopy = AUTH_COPY.marketingPanel;
  const registerCopy = AUTH_COPY.registerMarketingPanel;

  return (
    <div
      className={cn(
        "relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-muted/30 to-card p-8 lg:p-10 shadow-2xl backdrop-blur-md",
        className,
      )}
    >
      {/* Ambient background glows matching Home Hero */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 size-72 rounded-full bg-emerald-500/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-16 size-72 rounded-full bg-teal-500/10 blur-3xl"
        aria-hidden
      />

      <div className="relative z-10 space-y-8">
        {variant === "login" ? (
          <>
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
                <Sparkles className="size-3.5" />
                {loginCopy.eyebrow}
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Nền tảng kiểm kê phát thải{" "}
                <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 bg-clip-text text-transparent">
                  thế hệ mới
                </span>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Tự động hóa bóc tách hóa đơn EVN, xăng dầu và lập hồ sơ kiểm toán GHG Protocol chỉ trong vài phút.
              </p>
            </div>

            <TiltCard maxTilt={5} scale={1.01}>
              <DashboardPreview className="shadow-2xl border-border/80" />
            </TiltCard>

            {/* Trust counters matching Home page */}
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
                <p className="text-xs text-muted-foreground mt-0.5">Chuẩn GHG Protocol</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
                <ShieldCheck className="size-3.5" />
                {registerCopy.eyebrow}
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Bắt đầu hành trình{" "}
                <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 bg-clip-text text-transparent">
                  Chuyển đổi Xanh
                </span>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {registerCopy.description}
              </p>
            </div>

            <ol className="space-y-3.5">
              {registerCopy.steps.map((step) => (
                <li
                  key={step.label}
                  className="flex items-center gap-4 rounded-2xl border border-border/80 bg-background/60 p-4 transition-all duration-200 hover:border-primary/40 hover:bg-card hover:-translate-y-0.5 shadow-sm"
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                    <Check className="size-5" aria-hidden />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-bold tracking-wider text-primary uppercase">
                      {step.label}
                    </p>
                    <p className="text-sm font-bold text-foreground">{step.title}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs text-emerald-800 dark:text-emerald-300">
              <p className="font-bold flex items-center gap-1.5 mb-1">
                <Sparkles className="size-4 text-emerald-600 dark:text-emerald-400" />
                Dùng thử miễn phí 14 ngày
              </p>
              <p className="leading-relaxed opacity-90">
                Toàn quyền truy cập mọi tính năng OCR hóa đơn, bóc tách AI và báo cáo GHG Protocol không giới hạn.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
