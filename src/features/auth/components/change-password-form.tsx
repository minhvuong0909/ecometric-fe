import { AUTH_COPY } from "@/features/auth/constants/auth-content";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AuthField } from "@/features/auth/components/auth-field";
import { useChangePassword } from "@/features/auth/hooks/use-change-password";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/features/auth/schemas/change-password-schema";
import { Button } from "@/shared/components/ui/button";
import { getApiErrorMessage } from "@/shared/lib/get-error-message";
import { cn } from "@/shared/lib/utils";

type ChangePasswordFormProps = {
  className?: string;
};

export function ChangePasswordForm({ className }: ChangePasswordFormProps) {
  const copy = AUTH_COPY.changePassword;
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const mutation = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const onSubmit = (values: ChangePasswordFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => reset(),
    });
  };

  const serverError = mutation.error
    ? getApiErrorMessage(mutation.error)
    : null;
  const isSuccess = mutation.isSuccess;
  const isSubmitting = mutation.isPending;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("space-y-5", className)}
      noValidate
      aria-busy={isSubmitting}
    >
      <AuthField
        id="currentPassword"
        label={copy.currentLabel}
        icon={Lock}
        type={showCurrent ? "text" : "password"}
        autoComplete="current-password"
        placeholder={copy.currentPlaceholder}
        disabled={isSubmitting}
        error={errors.currentPassword?.message}
        trailing={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground"
            disabled={isSubmitting}
            onClick={() => setShowCurrent((prev) => !prev)}
            aria-label={showCurrent ? copy.hidePassword : copy.showPassword}
          >
            {showCurrent ? (
              <EyeOff className="size-4" aria-hidden />
            ) : (
              <Eye className="size-4" aria-hidden />
            )}
          </Button>
        }
        {...register("currentPassword")}
      />

      <AuthField
        id="newPassword"
        label={copy.newLabel}
        icon={KeyRound}
        type={showNew ? "text" : "password"}
        autoComplete="new-password"
        placeholder={copy.newPlaceholder}
        disabled={isSubmitting}
        error={errors.newPassword?.message}
        trailing={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground"
            disabled={isSubmitting}
            onClick={() => setShowNew((prev) => !prev)}
            aria-label={showNew ? copy.hidePassword : copy.showPassword}
          >
            {showNew ? (
              <EyeOff className="size-4" aria-hidden />
            ) : (
              <Eye className="size-4" aria-hidden />
            )}
          </Button>
        }
        {...register("newPassword")}
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

      {isSuccess ? (
        <p
          className="flex items-start gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary"
          role="status"
        >
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>{copy.success}</span>
        </p>
      ) : null}

      <Button
        type="submit"
        className="h-12 w-full bg-accent text-sm font-semibold tracking-wide text-accent-foreground shadow-md transition-all hover:bg-accent/90 hover:shadow-lg active:bg-accent/80 sm:w-auto sm:px-8"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        data-loading={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            {copy.submitting}
          </>
        ) : (
          copy.submit
        )}
      </Button>
    </form>
  );
}
