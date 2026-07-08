import { AUTH_COPY } from "@/features/auth/constants/auth-content";
import { AuthFooter } from "@/features/auth/components/auth-footer";
import { MarketingPanel } from "@/features/auth/components/marketing-panel";
import { RegisterForm } from "@/features/auth/components/register-form";
import { SecureBadge } from "@/features/auth/components/secure-badge";
import { Logo } from "@/shared/components/logo";

export function RegisterPage() {
  const copy = AUTH_COPY.register;

  return (
    <div className="flex min-h-dvh flex-col bg-background lg:flex-row">
      <section className="flex flex-1 flex-col bg-card lg:max-w-[54%]">
        <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:px-24 lg:py-16">
          <div className="mx-auto w-full max-w-md space-y-8 animate-fade-up">
            <Logo />
            <header className="space-y-4 pt-2">
              <SecureBadge label={copy.secureBadge} />
              <div className="space-y-3 pt-2">
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                  {copy.title}
                </h1>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {copy.description}
                </p>
              </div>
            </header>

            <RegisterForm />
          </div>
        </div>
        <AuthFooter className="mt-auto lg:max-w-[54%]" />
      </section>
      <MarketingPanel variant="register" className="hidden min-h-[28rem] flex-1 lg:flex" />
    </div>
  );
}
