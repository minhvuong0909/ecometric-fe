import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { APP_SHARED_COPY } from "@/features/app/constants/app-copy";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { Button } from "@/shared/components/ui/button";
import { ROUTES } from "@/shared/constants/routes";
import { cn } from "@/shared/lib/utils";

type LogoutButtonProps = {
  className?: string;
  variant?: "ghost" | "outline";
  /** Icon-only mode (used in the compact mobile header). */
  iconOnly?: boolean;
};

export function LogoutButton({
  className,
  variant = "ghost",
  iconOnly = false,
}: LogoutButtonProps) {
  const navigate = useNavigate();
  const logoutMutation = useLogout();
  const isPending = logoutMutation.isPending;

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => navigate(ROUTES.login, { replace: true }),
    });
  };

  if (iconOnly) {
    return (
      <Button
        type="button"
        variant={variant}
        size="icon"
        className={className}
        onClick={handleLogout}
        disabled={isPending}
        aria-label={APP_SHARED_COPY.logout}
      >
        <LogOut className="size-4" aria-hidden />
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant={variant}
      className={cn("w-full justify-start gap-3 font-medium", className)}
      onClick={handleLogout}
      disabled={isPending}
    >
      <LogOut className="size-4 shrink-0" aria-hidden />
      {isPending ? APP_SHARED_COPY.loggingOut : APP_SHARED_COPY.logout}
    </Button>
  );
}
