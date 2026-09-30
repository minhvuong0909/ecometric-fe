import { SignInButton, SignUpButton } from "@clerk/react";
import { GoogleIcon } from "@/shared/components/google-icon";
import { Button } from "@/shared/components/ui/button";

type GoogleAuthButtonProps = {
  mode?: "signin" | "signup";
  className?: string;
};

export function GoogleAuthButton({ mode = "signin", className }: GoogleAuthButtonProps) {
  const buttonContent = (
    <Button
      type="button"
      variant="outline"
      className={`h-11 w-full flex items-center justify-center gap-2.5 border-border bg-card font-medium text-foreground transition-all hover:bg-muted/50 hover:border-primary/40 active:scale-[0.985] ${className ?? ""}`}
      aria-label="Đăng nhập bằng Google"
    >
      <GoogleIcon className="size-4.5 shrink-0" />
      <span>{mode === "signup" ? "Đăng ký với Google" : "Tiếp tục với Google"}</span>
    </Button>
  );

  if (mode === "signup") {
    return <SignUpButton fallbackRedirectUrl="/app">{buttonContent}</SignUpButton>;
  }

  return <SignInButton fallbackRedirectUrl="/app">{buttonContent}</SignInButton>;
}
