import { ArrowLeft, Loader2, Mail, Pencil, Trash2, Users } from "lucide-react";
import type { ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { AppPageHeader } from "@/features/app/components/app-page-header";
import { AppPanel } from "@/features/app/components/app-panel";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { BusinessStatusBadge } from "@/features/businesses/components/business-status-badge";
import {
  BUSINESSES_COPY,
  INVITATIONS_COPY,
  MEMBERS_COPY,
} from "@/features/businesses/constants/businesses-copy";
import { useBusiness } from "@/features/businesses/hooks/use-business";
import { useDeleteBusiness } from "@/features/businesses/hooks/use-delete-business";
import { Button } from "@/shared/components/ui/button";
import { ROUTES } from "@/shared/constants/routes";
import { getApiErrorMessage } from "@/shared/lib/get-error-message";

const DATE_FORMAT = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : DATE_FORMAT.format(date);
}

export function BusinessDetailPage() {
  const copy = BUSINESSES_COPY.detail;
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isAdmin = useAuthStore(
    (state) => state.user?.platformRole === "SYSTEM_ADMIN",
  );

  const { data: business, isLoading, isError, error } = useBusiness(id);
  const deleteMutation = useDeleteBusiness();

  const handleDelete = () => {
    if (!business) return;
    if (!window.confirm(copy.deleteConfirm(business.name))) return;
    deleteMutation.mutate(business.id, {
      onSuccess: () => navigate(ROUTES.app.businesses, { replace: true }),
    });
  };

  return (
    <div className="max-w-4xl space-y-8">
      <AppPageHeader
        breadcrumbs={copy.breadcrumbs}
        title={business?.name ?? copy.breadcrumbs[1].label}
        actions={
          business ? (
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link to={ROUTES.app.businessMembers(business.id)}>
                  <Users className="size-4" aria-hidden />
                  {MEMBERS_COPY.manageCta}
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to={ROUTES.app.businessInvitations(business.id)}>
                  <Mail className="size-4" aria-hidden />
                  {INVITATIONS_COPY.manageCta}
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to={ROUTES.app.businessEdit(business.id)}>
                  <Pencil className="size-4" aria-hidden />
                  {copy.edit}
                </Link>
              </Button>
              {isAdmin ? (
                <Button
                  variant="outline"
                  className="border-destructive/40 text-destructive hover:bg-destructive/5"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                  ) : (
                    <Trash2 className="size-4" aria-hidden />
                  )}
                  {copy.delete}
                </Button>
              ) : null}
            </div>
          ) : undefined
        }
      />

      <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
        <Link to={ROUTES.app.businesses}>
          <ArrowLeft className="size-4" aria-hidden />
          {copy.back}
        </Link>
      </Button>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          {copy.loading}
        </div>
      ) : isError || !business ? (
        <p
          className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {isError ? getApiErrorMessage(error) : copy.error}
        </p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <AppPanel
            title={copy.infoTitle}
            badge={<BusinessStatusBadge status={business.status} />}
            interactive
          >
            <dl className="space-y-4">
              <DetailRow label={copy.fields.name}>{business.name}</DetailRow>
              <DetailRow label={copy.fields.slug}>/{business.slug}</DetailRow>
              <DetailRow label={copy.fields.taxCode}>
                {business.taxCode || BUSINESSES_COPY.list.noValue}
              </DetailRow>
              <DetailRow label={copy.fields.industry}>
                {business.industry || BUSINESSES_COPY.list.noValue}
              </DetailRow>
              <DetailRow label={copy.fields.website}>
                {business.website ? (
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noreferrer"
                    className="link-primary"
                  >
                    {business.website}
                  </a>
                ) : (
                  BUSINESSES_COPY.list.noValue
                )}
              </DetailRow>
            </dl>
          </AppPanel>

          <AppPanel title={copy.metaTitle} interactive>
            <dl className="space-y-4">
              <DetailRow label={copy.fields.country}>
                {business.country}
              </DetailRow>
              <DetailRow label={copy.fields.timezone}>
                {business.timezone}
              </DetailRow>
              <DetailRow label={copy.fields.createdAt}>
                {formatDate(business.createdAt)}
              </DetailRow>
              <DetailRow label={copy.fields.updatedAt}>
                {formatDate(business.updatedAt)}
              </DetailRow>
            </dl>
          </AppPanel>
        </div>
      )}
    </div>
  );
}

type DetailRowProps = {
  label: string;
  children: ReactNode;
};

function DetailRow({ label, children }: DetailRowProps) {
  return (
    <div className="space-y-1">
      <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="text-sm font-medium break-words text-foreground">
        {children}
      </dd>
    </div>
  );
}
