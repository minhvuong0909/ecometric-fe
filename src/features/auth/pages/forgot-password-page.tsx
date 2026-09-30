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
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Top Header Navigation */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link to={ROUTES.home} className="focus-ring rounded-sm" aria-label="Về trang chủ EcoMetric">
            <Logo />
          </Link>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="gap-1.5">
              <Link to={ROUTES.home}>
                <ArrowLeft className="size-3.5" />
                Về trang chủ
              </Link>
            </Button>
            <div className="h-4 w-px bg-border" />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full items-stretch gap-8 lg:grid-cols-12">
          {/* Form Card */}
          <section className="flex flex-col justify-center rounded-xl border border-border bg-card p-8 sm:p-10 shadow-sm lg:col-span-6 xl:col-span-5">
            <div className="w-full space-y-6">
              <header className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {copy.title}
                </h1>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {copy.description}
                </p>
              </header>

              <div className="rounded-xl border border-border bg-background/60 p-6 space-y-4">
                <p className="text-sm font-semibold text-foreground">{copy.cardTitle}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{copy.cardDescription}</p>
                <Button asChild className="h-11 w-full">
                  <Link to={ROUTES.login}>{copy.backToLogin}</Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Marketing Showcase Card */}
          <MarketingPanel variant="login" className="hidden lg:flex lg:col-span-6 xl:col-span-7" />
        </div>
      </main>

      {/* Bottom Footer */}
      <AuthFooter className="border-t border-border bg-card" />
    </div>
  );
}
