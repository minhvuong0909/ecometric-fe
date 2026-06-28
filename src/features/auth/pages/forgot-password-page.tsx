import { Link } from "react-router";
import { AUTH_COPY } from "@/features/auth/constants/auth-content";
import { AuthFooter } from "@/features/auth/components/auth-footer";
import { MarketingPanel } from "@/features/auth/components/marketing-panel";
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

export function ForgotPasswordPage() {
  const copy = AUTH_COPY.forgotPassword;

  return (
    <div className="flex min-h-dvh flex-col bg-background lg:flex-row">
      <section className="flex flex-1 flex-col bg-card lg:max-w-[54%]">
        <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:px-24 lg:py-16">
          <div className="mx-auto w-full max-w-md space-y-8">
            <Logo />
            <header className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                {copy.title}
              </h1>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {copy.description}
              </p>
            </header>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">{copy.cardTitle}</CardTitle>
                <CardDescription>{copy.cardDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="h-12 w-full">
                  <Link to={ROUTES.login}>{copy.backToLogin}</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <AuthFooter className="mt-auto lg:max-w-[54%]" />
      </section>
      <MarketingPanel className="hidden min-h-[28rem] flex-1 lg:flex" />
    </div>
  );
}
