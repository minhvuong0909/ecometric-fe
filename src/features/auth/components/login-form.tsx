import { AUTH_COPY } from "@/features/auth/constants/auth-content";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { AuthField } from "@/features/auth/components/auth-field";
import { GoogleAuthButton } from "@/features/auth/components/google-auth-button";
import { useLogin } from "@/features/auth/hooks/use-login";
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/login-schema";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import { ROUTES } from "@/shared/constants/routes";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/shared/lib/get-error-message";
import { cn } from "@/shared/lib/utils";

type LoginFormProps = {
  className?: string;
};

export function LoginForm({ className }: LoginFormProps) {
  const copy = AUTH_COPY.login;
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const rememberMe = watch("rememberMe");

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate({ email: values.email, password: values.password });
  };

  const serverError = loginMutation.error
    ? getApiErrorMessage(loginMutation.error)
    : null;
  const successMessage = loginMutation.isSuccess
    ? AUTH_COPY.api.welcomeBack(loginMutation.data.user.email)
    : null;
  const isSubmitting = loginMutation.isPending;

  useEffect(() => {
    if (loginMutation.isSuccess) {
      toast.success("Đăng nhập thành công!", {
        description: AUTH_COPY.api.welcomeBack(loginMutation.data.user.email),
      });
      const from = (location.state as { from?: string } | null)?.from;
      navigate(from ?? ROUTES.app.dashboard, { replace: true });
    }
  }, [loginMutation.isSuccess, loginMutation.data, navigate, location.state]);

  useEffect(() => {
    if (loginMutation.isError) {
      toast.error("Đăng nhập thất bại");
    }
  }, [loginMutation.isError, loginMutation.error]);

  return (
    <div className={cn("space-y-5", className)}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
        noValidate
        aria-busy={isSubmitting}
      >
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
          autoComplete="current-password"
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

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="rememberMe"
              checked={rememberMe}
              disabled={isSubmitting}
              onCheckedChange={(checked) =>
                setValue("rememberMe", checked === true, { shouldDirty: true })
              }
            />
            <Label htmlFor="rememberMe" className="cursor-pointer font-normal">
              {copy.rememberMe}
            </Label>
          </div>
          <Link
            to={ROUTES.forgotPassword}
            className="link-primary text-sm tracking-wide"
          >
            {copy.forgotPassword}
          </Link>
        </div>

        {serverError ? (
          <p
            className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            role="alert"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>{serverError}</span>
          </p>
        ) : null}

        {successMessage ? (
          <p
            className="flex items-start gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary"
            role="status"
          >
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>{successMessage}</span>
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
          Hoặc đăng nhập bằng Google
        </span>
      </div>

      <GoogleAuthButton mode="signin" />

      <p className="text-center text-sm text-muted-foreground pt-1">
        {copy.noAccount}{" "}
        <Link to={ROUTES.register} className="link-primary font-medium">
          {copy.signUp}
        </Link>
      </p>
    </div>
  );
}
