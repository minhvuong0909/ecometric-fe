import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { AUTH_COPY } from "@/features/auth/constants/auth-content";
import { AuthFooter } from "@/features/auth/components/auth-footer";
import { MarketingPanel } from "@/features/auth/components/marketing-panel";
import { Logo } from "@/shared/components/logo";
import { ThemeToggle } from "@/shared/components/theme-toggle";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/components/ui/button";

export function ForgotPasswordPage() {
  const copy = AUTH_COPY.forgotPassword;

  return (
    <div className="relative flex min-h-dvh flex-col bg-background overflow-hidden">
      {/* Ambient background glows */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(74,222,128,0.1),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(20,184,166,0.08),transparent_50%)]"
        aria-hidden
      />

      {/* Top Header Navigation */}
      <header className="relative z-20 border-b border-border/60 bg-card/60 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link to={ROUTES.home} className="focus-ring rounded-sm" aria-label="Về trang chủ EcoMetric">
            <Logo />
          </Link>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs font-semibold text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 px-3 py-1.5 rounded-lg">
              <Link to={ROUTES.home}>
                <ArrowLeft className="size-3.5" />
                Về trang chủ
              </Link>
            </Button>
            <div className="h-4 w-px bg-border/80" />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full items-stretch gap-8 lg:grid-cols-12">
          {/* Form Card */}
          <section className="flex flex-col justify-center rounded-3xl border border-border/80 bg-card/90 p-8 sm:p-10 shadow-2xl backdrop-blur-md lg:col-span-6 xl:col-span-5 animate-fade-up">
            <div className="w-full space-y-6">
              <header className="space-y-2">
                <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                  {copy.title}
                </h1>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {copy.description}
                </p>
              </header>

              <div className="rounded-2xl border border-border/80 bg-background/60 p-6 space-y-4">
                <p className="text-sm font-semibold text-foreground">{copy.cardTitle}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{copy.cardDescription}</p>
                <Button asChild className="eco-tactile h-12 w-full bg-gradient-to-r from-emerald-600 to-teal-600 font-bold text-white shadow-md">
                  <Link to={ROUTES.login}>{copy.backToLogin}</Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Marketing Showcase Card */}
          <MarketingPanel
            variant="login"
            className="hidden lg:flex lg:col-span-6 xl:col-span-7 animate-fade-up"
          />
        </div>
      </main>

      {/* Bottom Footer */}
      <AuthFooter className="relative z-10 border-t border-border/60 bg-card/40 backdrop-blur-xs" />
    </div>
  );
}
