import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { useLogin } from "@/features/auth/hooks/use-login";
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/login-schema";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/lib/utils";

type LoginFormProps = {
  className?: string;
};

export function LoginForm({ className }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
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
    loginMutation.mutate(values);
  };

  const serverError = loginMutation.error?.message;
  const successMessage = loginMutation.isSuccess
    ? loginMutation.data.message
    : null;
  const isSubmitting = loginMutation.isPending;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("space-y-6", className)}
      noValidate
      aria-busy={isSubmitting}
    >
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          className="h-12"
          disabled={isSubmitting}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />
        {errors.email ? (
          <p id="email-error" className="text-sm text-destructive" role="alert">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            className="h-12 pr-12"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
            {...register("password")}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground"
            disabled={isSubmitting}
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="size-4" aria-hidden />
            ) : (
              <Eye className="size-4" aria-hidden />
            )}
          </Button>
        </div>
        {errors.password ? (
          <p id="password-error" className="text-sm text-destructive" role="alert">
            {errors.password.message}
          </p>
        ) : null}
      </div>

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
            Remember me
          </Label>
        </div>
        <Link to="/forgot-password" className="link-primary text-sm tracking-wide">
          Forgot password?
        </Link>
      </div>

      {serverError ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive" role="alert">
          {serverError}
        </p>
      ) : null}

      {successMessage ? (
        <p
          className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary"
          role="status"
        >
          {successMessage}
        </p>
      ) : null}

      <Button
        type="submit"
        className="h-12 w-full text-sm font-semibold tracking-wide shadow-md"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        data-loading={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Signing in…
          </>
        ) : (
          <>
            Login
            <ArrowRight className="size-4" aria-hidden />
          </>
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="link-primary">
          Sign up
        </Link>
      </p>
    </form>
  );
}
