import { SignInButton, SignUpButton } from "@clerk/react";
import { GoogleIcon } from "@/shared/components/google-icon";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

type GoogleAuthButtonProps = {
  mode?: "signin" | "signup";
  className?: string;
};

export function GoogleAuthButton({
  mode = "signin",
  className,
}: GoogleAuthButtonProps) {
  if (import.meta.env.VITE_AUTH_EXTERNAL_ENABLED !== "true") {
    return null;
  }
  const signingUp = mode === "signup";
  const AuthButton = signingUp ? SignUpButton : SignInButton;
  const buttonContent = (
    <Button
      type="button"
      variant="outline"
      className={cn(
        "h-11 w-full flex items-center justify-center gap-2.5 border-border bg-card font-medium text-foreground transition-all hover:bg-muted/50 hover:border-primary/40 active:scale-[0.985]",
        className,
      )}
      aria-label={
        mode === "signup" ? "Đăng ký bằng Google" : "Đăng nhập bằng Google"
      }
    >
      <GoogleIcon className="size-4.5 shrink-0" />
      <span>
        {mode === "signup" ? "Đăng ký với Google" : "Tiếp tục với Google"}
      </span>
    </Button>
  );

  return (
    <div className="space-y-4">
      <p className="text-center text-xs text-muted-foreground">
        {signingUp
          ? "Hoặc tạo tài khoản bằng Google"
          : "Hoặc đăng nhập bằng Google"}
      </p>
      <AuthButton mode="modal" fallbackRedirectUrl="/app">
        {buttonContent}
      </AuthButton>
    </div>
  );
}
