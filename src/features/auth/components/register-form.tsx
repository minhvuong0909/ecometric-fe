import { AUTH_COPY } from "@/features/auth/constants/auth-content";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { AuthField } from "@/features/auth/components/auth-field";
import { GoogleAuthButton } from "@/features/auth/components/google-auth-button";
import { PasswordStrength } from "@/features/auth/components/password-strength";
import { useRegister } from "@/features/auth/hooks/use-register";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/features/auth/schemas/register-schema";
import { Button } from "@/shared/components/ui/button";
import { ROUTES } from "@/shared/constants/routes";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/shared/lib/get-error-message";
import { cn } from "@/shared/lib/utils";

type RegisterFormProps = {
  className?: string;
};

export function RegisterForm({ className }: RegisterFormProps) {
  const copy = AUTH_COPY.register;
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const watchedPassword = watch("password");

  const onSubmit = (values: RegisterFormValues) => {
    registerMutation.mutate({
      fullName: values.fullName,
      email: values.email,
      password: values.password,
    });
  };

  const serverError = registerMutation.error
    ? getApiErrorMessage(registerMutation.error)
    : null;
  const isSubmitting = registerMutation.isPending;

  useEffect(() => {
    if (registerMutation.isSuccess) {
      toast.success("Tạo tài khoản thành công!", {
        description: "Chào mừng bạn đến với EcoMetric.",
      });
      navigate(ROUTES.app.dashboard, { replace: true });
    }
  }, [registerMutation.isSuccess, navigate]);

  useEffect(() => {
    if (registerMutation.isError) {
      toast.error("Đăng ký thất bại", {
        description: getApiErrorMessage(registerMutation.error),
      });
    }
  }, [registerMutation.isError, registerMutation.error]);

  return (
    <div className={cn("space-y-5", className)}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
        noValidate
        aria-busy={isSubmitting}
      >
        <AuthField
          id="fullName"
          label={copy.fullNameLabel}
          icon={User}
          type="text"
          autoComplete="name"
          placeholder={copy.fullNamePlaceholder}
          disabled={isSubmitting}
          error={errors.fullName?.message}
          {...register("fullName")}
        />

        <AuthField
          id="email"
          label={copy.emailLabel}
          icon={Mail}
          type="email"
          autoComplete="email"
          placeholder={copy.emailPlaceholder}
          disabled={isSubmitting}
          error={errors.email?.message}
          {...register("email")}
        />

        <AuthField
          id="password"
          label={copy.passwordLabel}
          icon={Lock}
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder={copy.passwordPlaceholder}
          disabled={isSubmitting}
          error={errors.password?.message}
          trailing={
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground"
              disabled={isSubmitting}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? copy.hidePassword : copy.showPassword}
            >
              {showPassword ? (
                <EyeOff className="size-4" aria-hidden />
              ) : (
                <Eye className="size-4" aria-hidden />
              )}
            </Button>
          }
          {...register("password")}
        />

        <PasswordStrength password={watchedPassword} />

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
          className="h-12 w-full bg-accent text-sm font-semibold tracking-wide text-accent-foreground shadow-md transition-all hover:bg-accent/90 hover:shadow-lg active:bg-accent/80"
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
            <>
              {copy.submit}
              <ArrowRight className="size-4" aria-hidden />
            </>
          )}
        </Button>
      </form>

      <div className="relative flex items-center justify-center pt-1">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <span className="relative bg-card px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Hoặc tạo tài khoản bằng Google
        </span>
      </div>

      <GoogleAuthButton mode="signup" />

      <p className="text-center text-sm text-muted-foreground pt-1">
        {copy.hasAccount}{" "}
        <Link to={ROUTES.login} className="link-primary font-medium">
          {copy.signIn}
        </Link>
      </p>
    </div>
  );
}
