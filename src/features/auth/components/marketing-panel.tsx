import { Award, Check, Globe2, ShieldCheck, Sparkles } from "lucide-react";
import { AUTH_COPY } from "@/features/auth/constants/auth-content";
import { DashboardPreview } from "@/features/auth/components/dashboard-preview";
import { cn } from "@/shared/lib/utils";

const TRUST_STANDARDS = [
  { label: "Phạm vi 1, 2 & 3", icon: Globe2 },
  { label: "Chuẩn GHG Protocol", icon: ShieldCheck },
  { label: "ISO 14064-1:2018", icon: Award },
] as const;

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
        "flex flex-col justify-between rounded-xl border border-border bg-card p-8 lg:p-10 shadow-sm",
        className,
      )}
    >
      <div className="space-y-8">
        {variant === "login" ? (
          <>
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                <Sparkles className="size-3.5" />
                {loginCopy.eyebrow}
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Nền tảng kiểm kê phát thải <span className="text-primary">thế hệ mới</span>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Tự động hóa bóc tách hóa đơn EVN, xăng dầu và lập hồ sơ kiểm toán GHG Protocol chỉ trong vài phút.
              </p>
            </div>

            <DashboardPreview className="shadow-sm border-border" />

            {/* Phạm vi tuân thủ tiêu chuẩn — không dùng số liệu chưa xác thực */}
            <div className="pt-6 border-t border-border grid grid-cols-3 gap-4">
              {TRUST_STANDARDS.map(({ label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="size-4 shrink-0 text-primary" aria-hidden />
                  <p className="text-xs font-medium text-muted-foreground leading-tight">{label}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                <ShieldCheck className="size-3.5" />
                {registerCopy.eyebrow}
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Bắt đầu hành trình <span className="text-primary">Chuyển đổi Xanh</span>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {registerCopy.description}
              </p>
            </div>

            <ol className="space-y-3.5">
              {registerCopy.steps.map((step) => (
                <li
                  key={step.label}
                  className="flex items-center gap-4 rounded-xl border border-border bg-background/60 p-4"
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Check className="size-5" aria-hidden />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-semibold tracking-wide text-primary uppercase">
                      {step.label}
                    </p>
                    <p className="text-sm font-semibold text-foreground">{step.title}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs text-emerald-800 dark:text-emerald-300">
              <p className="font-semibold flex items-center gap-1.5 mb-1">
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
