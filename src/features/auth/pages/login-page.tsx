import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { AUTH_COPY } from "@/features/auth/constants/auth-content";
import { AuthFooter } from "@/features/auth/components/auth-footer";
import { LoginForm } from "@/features/auth/components/login-form";
import { Logo } from "@/shared/components/logo";
import { ThemeToggle } from "@/shared/components/theme-toggle";
import { MarketingPanel } from "@/features/auth/components/marketing-panel";
import { SecureBadge } from "@/features/auth/components/secure-badge";

import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/components/ui/button";

export function LoginPage() {
  const copy = AUTH_COPY.login;

  return (
    <div className="eco-brand eco-auth flex min-h-dvh flex-col bg-background">
      {/* Top Header Navigation */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <Link
            to={ROUTES.home}
            className="focus-ring rounded-sm"
            aria-label="Về trang chủ EcoMetric"
          >
            <Logo />
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button asChild variant="ghost" size="sm" className="gap-1.5">
              <Link to={ROUTES.home} aria-label="Về trang chủ">
                <ArrowLeft className="size-3.5" />
                <span className="hidden sm:inline">Về trang chủ</span>
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
          <section className="eco-auth-form flex flex-col justify-center rounded-xl border border-border bg-card p-8 sm:p-10 shadow-sm lg:col-span-6 xl:col-span-5">
            <div className="w-full space-y-6">
              <header className="space-y-3">
                <SecureBadge />
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    Đăng nhập <span className="text-primary">EcoMetric</span>
                  </h1>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {copy.description}
                  </p>
                </div>
              </header>

              <LoginForm />
            </div>
          </section>

          {/* Marketing Showcase Card (Synchronized with Home page) */}
          <MarketingPanel
            variant="login"
            className="hidden lg:flex lg:col-span-6 xl:col-span-7"
          />
        </div>
      </main>

      {/* Bottom Footer */}
      <AuthFooter className="border-t border-border bg-card" />
    </div>
  );
}
