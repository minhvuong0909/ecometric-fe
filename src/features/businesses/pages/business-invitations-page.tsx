import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Mail,
  RefreshCw,
  Search,
  Send,
  Trash2,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router";
import { AppPageHeader } from "@/features/app/components/app-page-header";
import { AppPanel } from "@/features/app/components/app-panel";
import { InvitationStatusBadge } from "@/features/businesses/components/invitation-status-badge";
import { TextField } from "@/features/businesses/components/text-field";
import {
  INVITATION_STATUS_OPTIONS,
  INVITATIONS_COPY,
  MANAGEABLE_ROLE_OPTIONS,
  MEMBER_ROLE_LABELS,
  MEMBERS_COPY,
} from "@/features/businesses/constants/businesses-copy";
import { useBusiness } from "@/features/businesses/hooks/use-business";
import { useBusinessInvitations } from "@/features/businesses/hooks/use-business-invitations";
import { useCreateInvitation } from "@/features/businesses/hooks/use-create-invitation";
import { useResendInvitation } from "@/features/businesses/hooks/use-resend-invitation";
import { useRevokeInvitation } from "@/features/businesses/hooks/use-revoke-invitation";
import {
  inviteMemberFormSchema,
  type InviteMemberFormValues,
} from "@/features/businesses/schemas/invitation-schema";
import type {
  BusinessInvitation,
  InvitationStatus,
} from "@/features/businesses/types/businesses.types";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { ROUTES } from "@/shared/constants/routes";
import { useDebouncedValue } from "@/shared/hooks/use-debounced-value";
import { getApiErrorMessage } from "@/shared/lib/get-error-message";
import { cn } from "@/shared/lib/utils";

const PAGE_SIZE = 20;

const DATE_FORMAT = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatDate(value: string | null): string {
  if (!value) return INVITATIONS_COPY.noValue;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : DATE_FORMAT.format(date);
}

/** Chỉ lời mời đang chờ / hết hạn mới gửi lại hoặc thu hồi được. */
function canManage(status: InvitationStatus): boolean {
  return status === "PENDING" || status === "EXPIRED";
}

export function BusinessInvitationsPage() {
  const copy = INVITATIONS_COPY;
  const { id } = useParams<{ id: string }>();
  const businessId = id ?? "";

  const [emailInput, setEmailInput] = useState("");
  const [status, setStatus] = useState<InvitationStatus | undefined>();
  const [page, setPage] = useState(1);
  const [actionError, setActionError] = useState<string | null>(null);

  const email = useDebouncedValue(emailInput.trim(), 350);

  const params = useMemo(
    () => ({
      email: email || undefined,
      status,
      page,
      limit: PAGE_SIZE,
    }),
    [email, status, page],
  );

  const { data: business } = useBusiness(businessId);
  const { data, isLoading, isError, error, isFetching } =
    useBusinessInvitations(businessId, params);

  const createMutation = useCreateInvitation(businessId);
  const resendMutation = useResendInvitation(businessId);
  const revokeMutation = useRevokeInvitation(businessId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteMemberFormValues>({
    resolver: zodResolver(inviteMemberFormSchema),
    defaultValues: { email: "", role: "STAFF" },
  });

  const items = data?.items ?? [];
  const pagination = data?.pagination;
  const hasFilters = Boolean(email) || Boolean(status);

  const resetToFirstPage = () => setPage(1);

  const onInvite = (values: InviteMemberFormValues) => {
    setActionError(null);
    createMutation.mutate(values, {
      onSuccess: () => reset({ email: "", role: values.role }),
    });
  };

  const handleResend = (invitation: BusinessInvitation) => {
    setActionError(null);
    resendMutation.mutate(invitation.id, {
      onError: (err) => setActionError(getApiErrorMessage(err)),
    });
  };

  const handleRevoke = (invitation: BusinessInvitation) => {
    if (!window.confirm(copy.revokeConfirm(invitation.email))) return;
    setActionError(null);
    revokeMutation.mutate(invitation.id, {
      onError: (err) => setActionError(getApiErrorMessage(err)),
    });
  };

  const from = pagination ? (pagination.page - 1) * pagination.limit + 1 : 0;
  const to = pagination
    ? Math.min(pagination.page * pagination.limit, pagination.total)
    : 0;

  const inviteError = createMutation.error
    ? getApiErrorMessage(createMutation.error)
    : null;

  return (
    <div className="space-y-8">
      <AppPageHeader
        breadcrumbs={copy.breadcrumbs}
        title={business ? `${copy.title} · ${business.name}` : copy.title}
        description={copy.description}
        actions={
          <Button asChild variant="outline">
            <Link to={ROUTES.app.businessMembers(businessId)}>
              <Users className="size-4" aria-hidden />
              {MEMBERS_COPY.manageCta}
            </Link>
          </Button>
        }
      />

      <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
        <Link to={ROUTES.app.businessDetail(businessId)}>
          <ArrowLeft className="size-4" aria-hidden />
          {copy.back}
        </Link>
      </Button>

      <AppPanel title={copy.inviteTitle} description={copy.inviteDescription}>
        <form
          onSubmit={handleSubmit(onInvite)}
          className="grid gap-4 sm:grid-cols-[1fr_220px_auto] sm:items-start"
          noValidate
        >
          <TextField
            id="invite-email"
            label={copy.labels.email}
            type="email"
            required
            placeholder={copy.placeholders.email}
            disabled={createMutation.isPending}
            error={errors.email?.message}
            {...register("email")}
          />
          <div className="space-y-1.5">
            <Label htmlFor="invite-role">
              {copy.labels.role}
              <span className="ml-0.5 text-destructive">*</span>
            </Label>
            <select
              id="invite-role"
              disabled={createMutation.isPending}
              className="focus-ring h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground disabled:opacity-60"
              {...register("role")}
            >
              {MANAGEABLE_ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <Button
            type="submit"
            className="bg-accent text-accent-foreground hover:bg-accent/90 sm:mt-[26px]"
            disabled={createMutation.isPending}
            aria-busy={createMutation.isPending}
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                {copy.submitting}
              </>
            ) : (
              <>
                <Send className="size-4" aria-hidden />
                {copy.submitInvite}
              </>
            )}
          </Button>
        </form>

        {inviteError ? (
          <p
            className="mt-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            role="alert"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>{inviteError}</span>
          </p>
        ) : createMutation.isSuccess ? (
          <p className="mt-4 text-sm font-medium text-primary">
            {copy.inviteSuccess}
          </p>
        ) : null}
      </AppPanel>

      {actionError ? (
        <p
          className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {actionError}
        </p>
      ) : null}

      <AppPanel bodyClassName="p-0">
        <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              value={emailInput}
              onChange={(event) => {
                setEmailInput(event.target.value);
                resetToFirstPage();
              }}
              placeholder={copy.searchPlaceholder}
              className="pl-9"
              aria-label={copy.searchPlaceholder}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <FilterPill
              active={!status}
              onClick={() => {
                setStatus(undefined);
                resetToFirstPage();
              }}
            >
              {copy.filterAll}
            </FilterPill>
            {INVITATION_STATUS_OPTIONS.map((option) => (
              <FilterPill
                key={option.value}
                active={status === option.value}
                onClick={() => {
                  setStatus(option.value);
                  resetToFirstPage();
                }}
              >
                {option.label}
              </FilterPill>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-2 p-6 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            {copy.loading}
          </div>
        ) : isError ? (
          <p className="p-6 text-sm text-destructive" role="alert">
            {getApiErrorMessage(error)}
          </p>
        ) : items.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">
            {hasFilters ? copy.emptyFiltered : copy.empty}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                    {copy.columns.email}
                  </th>
                  <th className="px-6 py-3 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                    {copy.columns.role}
                  </th>
                  <th className="px-6 py-3 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                    {copy.columns.status}
                  </th>
                  <th className="px-6 py-3 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                    {copy.columns.expiresAt}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-bold tracking-wide text-muted-foreground uppercase">
                    {copy.columns.actions}
                  </th>
                </tr>
              </thead>
              <tbody
                className={cn("transition-opacity", isFetching && "opacity-60")}
              >
                {items.map((invitation) => {
                  const manageable = canManage(invitation.status);
                  const resendPending =
                    resendMutation.isPending &&
                    resendMutation.variables === invitation.id;
                  const revokePending =
                    revokeMutation.isPending &&
                    revokeMutation.variables === invitation.id;

                  return (
                    <tr
                      key={invitation.id}
                      className="border-b border-border last:border-0 eco-row-hover"
                    >
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-2 font-medium text-foreground">
                          <Mail
                            className="size-4 shrink-0 text-muted-foreground"
                            aria-hidden
                          />
                          {invitation.email}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {MEMBER_ROLE_LABELS[invitation.role]}
                      </td>
                      <td className="px-6 py-4">
                        <InvitationStatusBadge status={invitation.status} />
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {formatDate(invitation.expiresAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleResend(invitation)}
                            disabled={!manageable || resendPending}
                            aria-label={`${copy.resend} ${invitation.email}`}
                            title={copy.resend}
                          >
                            {resendPending ? (
                              <Loader2 className="size-4 animate-spin" aria-hidden />
                            ) : (
                              <RefreshCw className="size-4" aria-hidden />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => handleRevoke(invitation)}
                            disabled={!manageable || revokePending}
                            aria-label={`${copy.revoke} ${invitation.email}`}
                            title={copy.revoke}
                          >
                            {revokePending ? (
                              <Loader2 className="size-4 animate-spin" aria-hidden />
                            ) : (
                              <Trash2 className="size-4" aria-hidden />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {pagination && pagination.total > 0 ? (
          <div className="flex items-center justify-between gap-4 border-t border-border px-6 py-4">
            <p className="text-xs text-muted-foreground">
              {copy.pagination.summary(from, to, pagination.total)}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1 || isFetching}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                <ChevronLeft className="size-4" aria-hidden />
                {copy.pagination.prev}
              </Button>
              <span className="text-xs font-medium text-muted-foreground tabular-nums">
                {copy.pagination.page(pagination.page, pagination.totalPages)}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.totalPages || isFetching}
                onClick={() => setPage((prev) => prev + 1)}
              >
                {copy.pagination.next}
                <ChevronRight className="size-4" aria-hidden />
              </Button>
            </div>
          </div>
        ) : null}
      </AppPanel>
    </div>
  );
}

type FilterPillProps = {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
};

function FilterPill({ active, onClick, children }: FilterPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "focus-ring rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
