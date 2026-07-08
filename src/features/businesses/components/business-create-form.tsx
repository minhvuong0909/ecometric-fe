import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { AppPanel } from "@/features/app/components/app-panel";
import { TextField } from "@/features/businesses/components/text-field";
import { BUSINESSES_COPY } from "@/features/businesses/constants/businesses-copy";
import { useCreateBusiness } from "@/features/businesses/hooks/use-create-business";
import {
  createBusinessFormSchema,
  type CreateBusinessFormValues,
} from "@/features/businesses/schemas/business-schema";
import type { CreateBusinessRequest } from "@/features/businesses/types/businesses.types";
import { Button } from "@/shared/components/ui/button";
import { ROUTES } from "@/shared/constants/routes";
import { getApiErrorMessage } from "@/shared/lib/get-error-message";

function toRequest(values: CreateBusinessFormValues): CreateBusinessRequest {
  const defaultBranch = values.branchName
    ? {
        name: values.branchName,
        code: values.branchCode,
        address: values.branchAddress,
        country: values.branchCountry,
      }
    : undefined;

  return {
    name: values.name,
    slug: values.slug,
    taxCode: values.taxCode,
    industry: values.industry,
    country: values.country,
    timezone: values.timezone,
    website: values.website,
    companyAdminEmail: values.companyAdminEmail,
    companyAdminFullName: values.companyAdminFullName,
    defaultBranch,
  };
}

export function BusinessCreateForm() {
  const copy = BUSINESSES_COPY.form;
  const labels = copy.labels;
  const placeholders = copy.placeholders;
  const navigate = useNavigate();
  const mutation = useCreateBusiness();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateBusinessFormValues>({
    resolver: zodResolver(createBusinessFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      taxCode: "",
      industry: "",
      country: "",
      timezone: "",
      website: "",
      companyAdminEmail: "",
      companyAdminFullName: "",
      branchName: "",
      branchCode: "",
      branchAddress: "",
      branchCountry: "",
    },
  });

  useEffect(() => {
    if (mutation.isSuccess) {
      navigate(ROUTES.app.businessDetail(mutation.data.business.id), {
        replace: true,
      });
    }
  }, [mutation.isSuccess, mutation.data, navigate]);

  const onSubmit = (values: CreateBusinessFormValues) => {
    mutation.mutate(toRequest(values));
  };

  const serverError = mutation.error ? getApiErrorMessage(mutation.error) : null;
  const isSubmitting = mutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <AppPanel title={copy.sectionGeneral}>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            id="name"
            label={labels.name}
            required
            placeholder={placeholders.name}
            disabled={isSubmitting}
            error={errors.name?.message}
            {...register("name")}
          />
          <TextField
            id="slug"
            label={labels.slug}
            required
            placeholder={placeholders.slug}
            disabled={isSubmitting}
            error={errors.slug?.message}
            {...register("slug")}
          />
          <TextField
            id="taxCode"
            label={labels.taxCode}
            placeholder={placeholders.taxCode}
            disabled={isSubmitting}
            error={errors.taxCode?.message}
            {...register("taxCode")}
          />
          <TextField
            id="industry"
            label={labels.industry}
            placeholder={placeholders.industry}
            disabled={isSubmitting}
            error={errors.industry?.message}
            {...register("industry")}
          />
          <TextField
            id="country"
            label={labels.country}
            placeholder={placeholders.country}
            disabled={isSubmitting}
            error={errors.country?.message}
            {...register("country")}
          />
          <TextField
            id="timezone"
            label={labels.timezone}
            placeholder={placeholders.timezone}
            disabled={isSubmitting}
            error={errors.timezone?.message}
            {...register("timezone")}
          />
          <TextField
            id="website"
            label={labels.website}
            placeholder={placeholders.website}
            disabled={isSubmitting}
            error={errors.website?.message}
            className="sm:col-span-2"
            {...register("website")}
          />
        </div>
      </AppPanel>

      <AppPanel title={copy.sectionAdmin}>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            id="companyAdminEmail"
            label={labels.companyAdminEmail}
            required
            type="email"
            placeholder={placeholders.companyAdminEmail}
            disabled={isSubmitting}
            error={errors.companyAdminEmail?.message}
            {...register("companyAdminEmail")}
          />
          <TextField
            id="companyAdminFullName"
            label={labels.companyAdminFullName}
            placeholder={placeholders.companyAdminFullName}
            disabled={isSubmitting}
            error={errors.companyAdminFullName?.message}
            {...register("companyAdminFullName")}
          />
        </div>
      </AppPanel>

      <AppPanel title={copy.sectionBranch}>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            id="branchName"
            label={labels.branchName}
            placeholder={placeholders.branchName}
            disabled={isSubmitting}
            error={errors.branchName?.message}
            {...register("branchName")}
          />
          <TextField
            id="branchCode"
            label={labels.branchCode}
            placeholder={placeholders.branchCode}
            disabled={isSubmitting}
            error={errors.branchCode?.message}
            {...register("branchCode")}
          />
          <TextField
            id="branchAddress"
            label={labels.branchAddress}
            placeholder={placeholders.branchAddress}
            disabled={isSubmitting}
            error={errors.branchAddress?.message}
            className="sm:col-span-2"
            {...register("branchAddress")}
          />
          <TextField
            id="branchCountry"
            label={labels.branchCountry}
            placeholder={placeholders.branchCountry}
            disabled={isSubmitting}
            error={errors.branchCountry?.message}
            {...register("branchCountry")}
          />
        </div>
      </AppPanel>

      {serverError ? (
        <p
          className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>{serverError}</span>
        </p>
      ) : null}

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => navigate(ROUTES.app.businesses)}
        >
          {copy.cancel}
        </Button>
        <Button
          type="submit"
          className="bg-accent text-accent-foreground hover:bg-accent/90"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              {copy.submitting}
            </>
          ) : (
            copy.submitCreate
          )}
        </Button>
      </div>
    </form>
  );
}
