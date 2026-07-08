import { Loader2 } from "lucide-react";
import { useParams } from "react-router";
import { AppPageHeader } from "@/features/app/components/app-page-header";
import { BusinessEditForm } from "@/features/businesses/components/business-edit-form";
import { BUSINESSES_COPY } from "@/features/businesses/constants/businesses-copy";
import { useBusiness } from "@/features/businesses/hooks/use-business";
import { getApiErrorMessage } from "@/shared/lib/get-error-message";

export function BusinessEditPage() {
  const copy = BUSINESSES_COPY.form;
  const { id } = useParams<{ id: string }>();
  const { data: business, isLoading, isError, error } = useBusiness(id);

  return (
    <div className="max-w-3xl space-y-8">
      <AppPageHeader
        breadcrumbs={copy.editBreadcrumbs}
        title={copy.editTitle}
        description={copy.editDescription}
      />

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
          {isError ? getApiErrorMessage(error) : copy.notFound}
        </p>
      ) : (
        <BusinessEditForm business={business} />
      )}
    </div>
  );
}
