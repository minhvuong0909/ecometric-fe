import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AppPageHeader } from "@/features/app/components/app-page-header";
import { AppPanel } from "@/features/app/components/app-panel";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { BusinessStatusBadge } from "@/features/businesses/components/business-status-badge";
import {
  BUSINESS_STATUS_OPTIONS,
  BUSINESSES_COPY,
} from "@/features/businesses/constants/businesses-copy";
import { useBusinesses } from "@/features/businesses/hooks/use-businesses";
import { useDeleteBusiness } from "@/features/businesses/hooks/use-delete-business";
import type { BusinessStatus } from "@/features/businesses/types/businesses.types";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { ROUTES } from "@/shared/constants/routes";
import { getApiErrorMessage } from "@/shared/lib/get-error-message";
import { useDebouncedValue } from "@/shared/hooks/use-debounced-value";
import { cn } from "@/shared/lib/utils";

const PAGE_SIZE = 20;

export function BusinessesPage() {
  const copy = BUSINESSES_COPY.list;
  const navigate = useNavigate();
  const isAdmin = useAuthStore(
    (state) => state.user?.platformRole === "SYSTEM_ADMIN",
  );

  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState<BusinessStatus | undefined>();
  const [page, setPage] = useState(1);

  const search = useDebouncedValue(searchInput.trim(), 350);

  const params = useMemo(
    () => ({
      search: search || undefined,
      status,
      page,
      limit: PAGE_SIZE,
    }),
    [search, status, page],
  );

  const { data, isLoading, isError, error, isFetching } = useBusinesses(params);
  const deleteMutation = useDeleteBusiness();

  const items = data?.items ?? [];
  const pagination = data?.pagination;
  const hasFilters = Boolean(search) || Boolean(status);

  const resetToFirstPage = () => setPage(1);

  const handleStatusChange = (next?: BusinessStatus) => {
    setStatus(next);
    resetToFirstPage();
  };

  const handleDelete = (id: string, name: string) => {
    if (!window.confirm(BUSINESSES_COPY.detail.deleteConfirm(name))) return;
    deleteMutation.mutate(id);
  };

  const from = pagination ? (pagination.page - 1) * pagination.limit + 1 : 0;
  const to = pagination
    ? Math.min(pagination.page * pagination.limit, pagination.total)
    : 0;

  return (
    <div className="space-y-8">
      <AppPageHeader
        breadcrumbs={copy.breadcrumbs}
        title={copy.title}
        description={copy.description}
        actions={
          isAdmin ? (
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to={ROUTES.app.businessCreate}>
                <Plus className="size-4" aria-hidden />
                {copy.createCta}
              </Link>
            </Button>
          ) : undefined
        }
      />

      <AppPanel bodyClassName="p-0">
        <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
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
            <FilterPill
              active={!status}
              onClick={() => handleStatusChange(undefined)}
            >
              {copy.filterAll}
            </FilterPill>
            {BUSINESS_STATUS_OPTIONS.map((option) => (
              <FilterPill
                key={option.value}
                active={status === option.value}
                onClick={() => handleStatusChange(option.value)}
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
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                    {copy.columns.name}
                  </th>
                  <th className="px-6 py-3 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                    {copy.columns.taxCode}
                  </th>
                  <th className="px-6 py-3 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                    {copy.columns.industry}
                  </th>
                  <th className="px-6 py-3 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                    {copy.columns.status}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-bold tracking-wide text-muted-foreground uppercase">
                    {copy.columns.actions}
                  </th>
                </tr>
              </thead>
              <tbody
                className={cn(
                  "transition-opacity",
                  isFetching && "opacity-60",
                )}
              >
                {items.map((business) => (
                  <tr
                    key={business.id}
                    className="border-b border-border last:border-0 eco-row-hover"
                  >
                    <td className="px-6 py-4">
                      <Link
                        to={ROUTES.app.businessDetail(business.id)}
                        className="font-semibold text-foreground hover:text-primary focus-ring rounded-sm"
                      >
                        {business.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        /{business.slug}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {business.taxCode || copy.noValue}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {business.industry || copy.noValue}
                    </td>
                    <td className="px-6 py-4">
                      <BusinessStatusBadge status={business.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() =>
                            navigate(ROUTES.app.businessEdit(business.id))
                          }
                          aria-label={`${copy.edit} ${business.name}`}
                        >
                          <Pencil className="size-4" aria-hidden />
                        </Button>
                        {isAdmin ? (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() =>
                              handleDelete(business.id, business.name)
                            }
                            disabled={
                              deleteMutation.isPending &&
                              deleteMutation.variables === business.id
                            }
                            aria-label={`${copy.delete} ${business.name}`}
                          >
                            {deleteMutation.isPending &&
                            deleteMutation.variables === business.id ? (
                              <Loader2 className="size-4 animate-spin" aria-hidden />
                            ) : (
                              <Trash2 className="size-4" aria-hidden />
                            )}
                          </Button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
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
