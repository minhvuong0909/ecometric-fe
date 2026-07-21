import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { TextField } from "@/features/businesses/components/text-field";
import {
  ACCEPT_INVITATION_COPY,
  MEMBER_ROLE_LABELS,
} from "@/features/businesses/constants/businesses-copy";
import { useAcceptInvitation } from "@/features/businesses/hooks/use-accept-invitation";
import {
  acceptInvitationFormSchema,
  type AcceptInvitationFormValues,
} from "@/features/businesses/schemas/invitation-schema";
import { Button } from "@/shared/components/ui/button";
import { Logo } from "@/shared/components/logo";
import { ROUTES } from "@/shared/constants/routes";
import { getApiErrorMessage } from "@/shared/lib/get-error-message";

export function AcceptInvitationPage() {
  const copy = ACCEPT_INVITATION_COPY;
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const isAuthed = useAuthStore((state) => Boolean(state.user));

  const mutation = useAcceptInvitation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AcceptInvitationFormValues>({
    resolver: zodResolver(acceptInvitationFormSchema),
    defaultValues: { fullName: "", password: "" },
  });

  const onSubmit = (values: AcceptInvitationFormValues) => {
    mutation.mutate({
      token,
      fullName: values.fullName,
      password: values.password,
    });
  };

  const serverError = mutation.error ? getApiErrorMessage(mutation.error) : null;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md space-y-8 animate-fade-up">
        <Logo />

        {!token ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
            <p className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>{copy.missingToken}</span>
            </p>
          </div>
        ) : mutation.isSuccess ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center shadow-sm eco-surface-hover">
            <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-secondary">
              <CheckCircle2 className="size-6 text-primary" aria-hidden />
            </span>
            <h1 className="mt-4 text-2xl font-bold text-foreground">
              {copy.successTitle}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {copy.successBody(mutation.data.business.name)}
            </p>
            <p className="mt-1 text-sm font-medium text-primary">
              {MEMBER_ROLE_LABELS[mutation.data.member.role]}
            </p>
            <Button asChild className="mt-6 w-full">
              <Link to={isAuthed ? ROUTES.app.root : ROUTES.login}>
                {isAuthed ? copy.goToApp : copy.goToLogin}
              </Link>
            </Button>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
            <header className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">{copy.title}</h1>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {copy.description}
              </p>
            </header>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-6 space-y-4"
              noValidate
            >
              <TextField
                id="accept-fullName"
                label={copy.labels.fullName}
                placeholder={copy.placeholders.fullName}
                autoComplete="name"
                disabled={mutation.isPending}
                error={errors.fullName?.message}
                {...register("fullName")}
              />
              <TextField
                id="accept-password"
                label={copy.labels.password}
                type="password"
                placeholder={copy.placeholders.password}
                autoComplete="new-password"
                disabled={mutation.isPending}
                hint={copy.hint}
                error={errors.password?.message}
                {...register("password")}
              />

              {serverError ? (
                <p
                  className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
                  role="alert"
                >
                  <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
                  <span>{serverError}</span>
                </p>
              ) : null}

              <Button
                type="submit"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                disabled={mutation.isPending}
                aria-busy={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    {copy.submitting}
                  </>
                ) : (
                  copy.submit
                )}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
