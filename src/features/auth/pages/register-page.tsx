import { Link } from "react-router";
import { AUTH_COPY } from "@/features/auth/constants/auth-content";
import { AuthFooter } from "@/features/auth/components/auth-footer";
import { MarketingPanel } from "@/features/auth/components/marketing-panel";
import { SecureBadge } from "@/features/auth/components/secure-badge";
import { Logo } from "@/shared/components/logo";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export function RegisterPage() {
  const copy = AUTH_COPY.register;

  return (
    <div className="flex min-h-dvh flex-col bg-background lg:flex-row">
      <section className="flex flex-1 flex-col bg-card lg:max-w-[54%]">
        <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:px-24 lg:py-16">
          <div className="mx-auto w-full max-w-md space-y-8">
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

            <Card>
              <CardHeader>
                <CardTitle className="text-base">{copy.cardTitle}</CardTitle>
                <CardDescription>{copy.cardDescription}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Button asChild className="h-12 w-full font-semibold tracking-wide">
                  <Link to={ROUTES.app.dashboard}>{copy.continueDashboard}</Link>
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  {copy.hasAccount}{" "}
                  <Link to={ROUTES.login} className="link-primary font-medium">
                    {copy.signIn}
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        <AuthFooter className="mt-auto lg:max-w-[54%]" />
      </section>
      <MarketingPanel variant="register" className="hidden min-h-[28rem] flex-1 lg:flex" />
    </div>
  );
}
