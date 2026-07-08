import { AppPageHeader } from "@/features/app/components/app-page-header";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { BusinessCreateForm } from "@/features/businesses/components/business-create-form";
import { BUSINESSES_COPY } from "@/features/businesses/constants/businesses-copy";

export function BusinessCreatePage() {
  const copy = BUSINESSES_COPY.form;
  const isAdmin = useAuthStore(
    (state) => state.user?.platformRole === "SYSTEM_ADMIN",
  );

  return (
    <div className="max-w-3xl space-y-8">
      <AppPageHeader
        breadcrumbs={copy.createBreadcrumbs}
        title={copy.createTitle}
        description={copy.createDescription}
      />

      {isAdmin ? (
        <BusinessCreateForm />
      ) : (
        <p
          className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {copy.adminOnly}
        </p>
      )}
    </div>
  );
}
