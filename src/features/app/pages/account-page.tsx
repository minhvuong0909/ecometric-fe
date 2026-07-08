import { KeyRound, Loader2 } from "lucide-react";
import { Link } from "react-router";
import { AppPageHeader } from "@/features/app/components/app-page-header";
import { AppPanel } from "@/features/app/components/app-panel";
import { AUTH_COPY } from "@/features/auth/constants/auth-content";
import { useProfile } from "@/features/auth/hooks/use-profile";
import { Button } from "@/shared/components/ui/button";
import { ROUTES } from "@/shared/constants/routes";

export function AccountPage() {
  const copy = AUTH_COPY.account;
  const { data, isLoading, isError } = useProfile();

  const user = data?.user;
  const memberships = data?.memberships ?? [];

  return (
    <div className="max-w-4xl space-y-8">
      <AppPageHeader
        breadcrumbs={copy.breadcrumbs}
        title={copy.title}
        description={copy.description}
        actions={
          <Button asChild variant="outline">
            <Link to={ROUTES.app.changePassword}>
              <KeyRound className="size-4" aria-hidden />
              {copy.changePasswordCta}
            </Link>
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          {copy.loading}
        </div>
      ) : isError ? (
        <p
          className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {copy.error}
        </p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <AppPanel title={copy.infoTitle}>
            <dl className="space-y-4">
              <div className="space-y-1">
                <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {copy.nameLabel}
                </dt>
                <dd className="text-sm font-medium text-foreground">
                  {user?.fullName?.trim() || copy.noName}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {copy.emailLabel}
                </dt>
                <dd className="text-sm font-medium text-foreground">
                  {user?.email}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {copy.roleLabel}
                </dt>
                <dd>
                  <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-bold text-primary">
                    {user?.platformRole}
                  </span>
                </dd>
              </div>
            </dl>
          </AppPanel>

          <AppPanel title={copy.membershipsTitle}>
            {memberships.length > 0 ? (
              <ul className="divide-y divide-border">
                {memberships.map((membership) => (
                  <li
                    key={membership.businessId}
                    className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                  >
                    <span className="text-sm font-medium text-foreground">
                      {membership.businessName}
                    </span>
                    <span className="shrink-0 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                      {membership.role}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                {copy.noMemberships}
              </p>
            )}
          </AppPanel>
        </div>
      )}
    </div>
  );
}
