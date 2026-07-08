import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  Trash2,
} from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { AppPageHeader } from "@/features/app/components/app-page-header";
import { AppPanel } from "@/features/app/components/app-panel";
import { MemberStatusBadge } from "@/features/businesses/components/member-status-badge";
import {
  MANAGEABLE_ROLE_OPTIONS,
  MANAGEABLE_STATUS_OPTIONS,
  MEMBER_ROLE_LABELS,
  MEMBER_STATUS_LABELS,
  MEMBERS_COPY,
} from "@/features/businesses/constants/businesses-copy";
import { useBusiness } from "@/features/businesses/hooks/use-business";
import { useBusinessMembers } from "@/features/businesses/hooks/use-business-members";
import { useChangeMemberRole } from "@/features/businesses/hooks/use-change-member-role";
import { useChangeMemberStatus } from "@/features/businesses/hooks/use-change-member-status";
import { useRemoveBusinessMember } from "@/features/businesses/hooks/use-remove-business-member";
import type {
  BusinessMember,
  ManageableMemberStatus,
  ManageableRole,
  MemberStatus,
} from "@/features/businesses/types/businesses.types";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { ROUTES } from "@/shared/constants/routes";
import { useDebouncedValue } from "@/shared/hooks/use-debounced-value";
import { getApiErrorMessage } from "@/shared/lib/get-error-message";
import { getInitials } from "@/shared/lib/get-initials";
import { cn } from "@/shared/lib/utils";

const PAGE_SIZE = 20;

const DATE_FORMAT = new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" });

function formatDate(value: string | null): string {
  if (!value) return MEMBERS_COPY.noValue;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : DATE_FORMAT.format(date);
}

export function BusinessMembersPage() {
  const copy = MEMBERS_COPY;
  const { id } = useParams<{ id: string }>();
  const businessId = id ?? "";

  const [searchInput, setSearchInput] = useState("");
  const [role, setRole] = useState<ManageableRole | undefined>();
  const [status, setStatus] = useState<MemberStatus | undefined>();
  const [page, setPage] = useState(1);
  const [actionError, setActionError] = useState<string | null>(null);

  const search = useDebouncedValue(searchInput.trim(), 350);

  const params = useMemo(
    () => ({
      search: search || undefined,
      role,
      status,
      page,
      limit: PAGE_SIZE,
    }),
    [search, role, status, page],
  );

  const { data: business } = useBusiness(businessId);
  const { data, isLoading, isError, error, isFetching } = useBusinessMembers(
    businessId,
    params,
  );

  const roleMutation = useChangeMemberRole(businessId);
  const statusMutation = useChangeMemberStatus(businessId);
  const removeMutation = useRemoveBusinessMember(businessId);

  const items = data?.items ?? [];
  const pagination = data?.pagination;
  const hasFilters = Boolean(search) || Boolean(role) || Boolean(status);

  const resetToFirstPage = () => setPage(1);

  const handleRoleChange = (member: BusinessMember, next: ManageableRole) => {
    if (next === member.role) return;
    setActionError(null);
    roleMutation.mutate(
      { memberId: member.id, role: next },
      { onError: (err) => setActionError(getApiErrorMessage(err)) },
    );
  };

  const handleStatusChange = (
    member: BusinessMember,
    next: ManageableMemberStatus,
  ) => {
    if (next === member.status) return;
    setActionError(null);
    statusMutation.mutate(
      { memberId: member.id, status: next },
      { onError: (err) => setActionError(getApiErrorMessage(err)) },
    );
  };

  const handleRemove = (member: BusinessMember) => {
    const name = member.user.fullName || member.user.email;
    if (!window.confirm(copy.removeConfirm(name))) return;
    setActionError(null);
    removeMutation.mutate(member.id, {
      onError: (err) => setActionError(getApiErrorMessage(err)),
    });
  };

  const from = pagination ? (pagination.page - 1) * pagination.limit + 1 : 0;
  const to = pagination
    ? Math.min(pagination.page * pagination.limit, pagination.total)
    : 0;

  return (
    <div className="space-y-8">
      <AppPageHeader
        breadcrumbs={copy.breadcrumbs}
        title={business ? `${copy.title} · ${business.name}` : copy.title}
        description={copy.description}
      />

      <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
        <Link to={ROUTES.app.businessDetail(businessId)}>
          <ArrowLeft className="size-4" aria-hidden />
          {copy.back}
        </Link>
      </Button>

      {actionError ? (
        <p
          className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {actionError}
        </p>
      ) : null}

      <AppPanel bodyClassName="p-0">
        <div className="flex flex-col gap-4 border-b border-border p-4">
          <div className="relative w-full sm:max-w-xs">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              value={searchInput}
              onChange={(event) => {
                setSearchInput(event.target.value);
                resetToFirstPage();
              }}
              placeholder={copy.searchPlaceholder}
              className="pl-9"
              aria-label={copy.searchPlaceholder}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <FilterPill active={!role} onClick={() => { setRole(undefined); resetToFirstPage(); }}>
              {copy.filterAllRoles}
            </FilterPill>
            {MANAGEABLE_ROLE_OPTIONS.map((option) => (
              <FilterPill
                key={option.value}
                active={role === option.value}
                onClick={() => { setRole(option.value); resetToFirstPage(); }}
              >
                {option.label}
              </FilterPill>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <FilterPill active={!status} onClick={() => { setStatus(undefined); resetToFirstPage(); }}>
              {copy.filterAllStatuses}
            </FilterPill>
            {(Object.keys(MEMBER_STATUS_LABELS) as MemberStatus[]).map(
              (value) => (
                <FilterPill
                  key={value}
                  active={status === value}
                  onClick={() => { setStatus(value); resetToFirstPage(); }}
                >
                  {MEMBER_STATUS_LABELS[value]}
                </FilterPill>
              ),
            )}
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
            <table className="w-full min-w-[840px] text-left text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                    {copy.columns.member}
                  </th>
                  <th className="px-6 py-3 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                    {copy.columns.role}
                  </th>
                  <th className="px-6 py-3 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                    {copy.columns.status}
                  </th>
                  <th className="px-6 py-3 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                    {copy.columns.joinedAt}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-bold tracking-wide text-muted-foreground uppercase">
                    {copy.columns.actions}
                  </th>
                </tr>
              </thead>
              <tbody
                className={cn("transition-opacity", isFetching && "opacity-60")}
              >
                {items.map((member) => {
                  const rolePending =
                    roleMutation.isPending &&
                    roleMutation.variables?.memberId === member.id;
                  const statusPending =
                    statusMutation.isPending &&
                    statusMutation.variables?.memberId === member.id;
                  const removePending =
                    removeMutation.isPending &&
                    removeMutation.variables === member.id;

                  return (
                    <tr
                      key={member.id}
                      className="group border-b border-border last:border-0 eco-row-hover"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-primary transition-transform duration-200 group-hover:scale-110">
                            {getInitials(member.user.fullName || member.user.email)}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-foreground">
                              {member.user.fullName || copy.noName}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {member.user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <RowSelect
                          value={member.role}
                          disabled={rolePending}
                          loading={rolePending}
                          ariaLabel={`${copy.columns.role} · ${member.user.email}`}
                          currentLabel={MEMBER_ROLE_LABELS[member.role]}
                          isManaged={MANAGEABLE_ROLE_OPTIONS.some(
                            (opt) => opt.value === member.role,
                          )}
                          options={MANAGEABLE_ROLE_OPTIONS}
                          onChange={(next) =>
                            handleRoleChange(member, next as ManageableRole)
                          }
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <MemberStatusBadge status={member.status} />
                          <RowSelect
                            value={member.status}
                            disabled={statusPending}
                            loading={statusPending}
                            ariaLabel={`${copy.columns.status} · ${member.user.email}`}
                            currentLabel={MEMBER_STATUS_LABELS[member.status]}
                            isManaged={MANAGEABLE_STATUS_OPTIONS.some(
                              (opt) => opt.value === member.status,
                            )}
                            options={MANAGEABLE_STATUS_OPTIONS}
                            onChange={(next) =>
                              handleStatusChange(
                                member,
                                next as ManageableMemberStatus,
                              )
                            }
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {formatDate(member.joinedAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemove(member)}
                            disabled={removePending}
                            aria-label={`${copy.remove} ${member.user.email}`}
                          >
                            {removePending ? (
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

type RowSelectProps = {
  value: string;
  options: readonly { value: string; label: string }[];
  onChange: (next: string) => void;
  ariaLabel: string;
  disabled?: boolean;
  loading?: boolean;
  /** Nếu giá trị hiện tại không nằm trong options (vd INVITED / SYSTEM_ADMIN). */
  isManaged?: boolean;
  currentLabel?: string;
};

function RowSelect({
  value,
  options,
  onChange,
  ariaLabel,
  disabled,
  loading,
  isManaged = true,
  currentLabel,
}: RowSelectProps) {
  return (
    <span className="relative inline-flex items-center">
      <select
        value={value}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "focus-ring h-9 rounded-md border border-input bg-background px-2.5 pr-7 text-sm font-medium text-foreground",
          "appearance-none transition-colors hover:border-primary/50 disabled:opacity-60",
        )}
      >
        {!isManaged && currentLabel ? (
          <option value={value} disabled>
            {currentLabel}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {loading ? (
        <Loader2
          className="pointer-events-none absolute right-2 size-3.5 animate-spin text-muted-foreground"
          aria-hidden
        />
      ) : (
        <ChevronRight
          className="pointer-events-none absolute right-2 size-3.5 rotate-90 text-muted-foreground"
          aria-hidden
        />
      )}
    </span>
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
