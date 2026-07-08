import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { AppPanel } from "@/features/app/components/app-panel";
import { TextField } from "@/features/businesses/components/text-field";
import {
  BUSINESS_STATUS_OPTIONS,
  BUSINESSES_COPY,
} from "@/features/businesses/constants/businesses-copy";
import { useUpdateBusiness } from "@/features/businesses/hooks/use-update-business";
import {
  updateBusinessFormSchema,
  type UpdateBusinessFormValues,
} from "@/features/businesses/schemas/business-schema";
import type {
  Business,
  UpdateBusinessRequest,
} from "@/features/businesses/types/businesses.types";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { ROUTES } from "@/shared/constants/routes";
import { getApiErrorMessage } from "@/shared/lib/get-error-message";

function toRequest(values: UpdateBusinessFormValues): UpdateBusinessRequest {
  return {
    name: values.name,
    slug: values.slug,
    taxCode: values.taxCode,
    industry: values.industry,
    country: values.country,
    timezone: values.timezone,
    website: values.website,
    status: values.status,
  };
}

type BusinessEditFormProps = {
  business: Business;
};

export function BusinessEditForm({ business }: BusinessEditFormProps) {
  const copy = BUSINESSES_COPY.form;
  const labels = copy.labels;
  const placeholders = copy.placeholders;
  const navigate = useNavigate();
  const mutation = useUpdateBusiness();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateBusinessFormValues>({
    resolver: zodResolver(updateBusinessFormSchema),
    defaultValues: {
      name: business.name,
      slug: business.slug,
      taxCode: business.taxCode ?? "",
      industry: business.industry ?? "",
      country: business.country,
      timezone: business.timezone,
      website: business.website ?? "",
      status: business.status,
    },
  });

  useEffect(() => {
    if (mutation.isSuccess) {
      navigate(ROUTES.app.businessDetail(business.id), { replace: true });
    }
  }, [mutation.isSuccess, navigate, business.id]);

  const onSubmit = (values: UpdateBusinessFormValues) => {
    mutation.mutate({ id: business.id, data: toRequest(values) });
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
            disabled={isSubmitting}
            error={errors.name?.message}
            {...register("name")}
          />
          <TextField
            id="slug"
            label={labels.slug}
            required
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
            required
            disabled={isSubmitting}
            error={errors.country?.message}
            {...register("country")}
          />
          <TextField
            id="timezone"
            label={labels.timezone}
            required
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
          <div className="space-y-1.5">
            <Label htmlFor="status">{labels.status}</Label>
            <select
              id="status"
              disabled={isSubmitting}
              className="focus-visible:border-ring focus-visible:ring-ring h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none transition-colors hover:border-ring/60 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50"
              {...register("status")}
            >
              {BUSINESS_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
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
      ) : mutation.isSuccess ? (
        <p
          className="flex items-start gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary"
          role="status"
        >
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>{copy.editSuccess}</span>
        </p>
      ) : null}

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => navigate(ROUTES.app.businessDetail(business.id))}
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
            copy.submitEdit
          )}
        </Button>
      </div>
    </form>
  );
}
