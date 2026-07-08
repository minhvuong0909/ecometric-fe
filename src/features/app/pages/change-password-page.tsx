import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { AppPageHeader } from "@/features/app/components/app-page-header";
import { AppPanel } from "@/features/app/components/app-panel";
import { ChangePasswordForm } from "@/features/auth/components/change-password-form";
import { AUTH_COPY } from "@/features/auth/constants/auth-content";
import { Button } from "@/shared/components/ui/button";
import { ROUTES } from "@/shared/constants/routes";

export function ChangePasswordPage() {
  const copy = AUTH_COPY.changePassword;

  return (
    <div className="max-w-2xl space-y-8">
      <AppPageHeader
        breadcrumbs={copy.breadcrumbs}
        title={copy.title}
        description={copy.description}
        actions={
          <Button asChild variant="outline">
            <Link to={ROUTES.app.account}>
              <ArrowLeft className="size-4" aria-hidden />
              {copy.back}
            </Link>
          </Button>
        }
      />

      <AppPanel bodyClassName="p-6 sm:p-8">
        <ChangePasswordForm />
      </AppPanel>
    </div>
  );
}
