import { KeyRound, LogOut, UserRound } from "lucide-react";
import { useNavigate } from "react-router";
import { AUTH_COPY } from "@/features/auth/constants/auth-content";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { ROUTES } from "@/shared/constants/routes";
import { getInitials } from "@/shared/lib/get-initials";
import { cn } from "@/shared/lib/utils";

type UserMenuProps = {
  className?: string;
};

export function UserMenu({ className }: UserMenuProps) {
  const navigate = useNavigate();
  const logoutMutation = useLogout();
  const copy = AUTH_COPY.menu;

  const user = useAuthStore((state) => state.user);
  const initials = getInitials(user?.fullName?.trim() || user?.email);
  const displayName = user?.fullName?.trim() || user?.email || "EcoMetric";

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => navigate(ROUTES.login, { replace: true }),
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={copy.trigger}
          className={cn(
            "flex size-9 items-center justify-center rounded-full bg-secondary-foreground text-xs font-bold text-accent outline-none transition-opacity duration-150 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            className,
          )}
        >
          {initials}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          <p className="truncate text-sm font-semibold text-foreground">
            {displayName}
          </p>
          {user?.email ? (
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          ) : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => navigate(ROUTES.app.settings)}>
          <UserRound aria-hidden />
          {copy.account}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => navigate(ROUTES.app.settings)}>
          <KeyRound aria-hidden />
          {copy.changePassword}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          disabled={logoutMutation.isPending}
          onSelect={(event) => {
            event.preventDefault();
            handleLogout();
          }}
        >
          <LogOut aria-hidden />
          {copy.logout}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
