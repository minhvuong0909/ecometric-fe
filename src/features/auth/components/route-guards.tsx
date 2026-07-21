import { useUser } from "@clerk/react";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { ROUTES } from "@/shared/constants/routes";

type GuardProps = {
  children: ReactNode;
};

/** Chặn route yêu cầu đăng nhập; đẩy về /login kèm đường dẫn gốc để quay lại. */
export function RequireAuth({ children }: GuardProps) {
  const storeIsAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setUser = useAuthStore((state) => state.setUser);
  const { isSignedIn, isLoaded, user: clerkUser } = useUser();
  const location = useLocation();

  useEffect(() => {
    if (isSignedIn && clerkUser) {
      setUser({
        id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress ?? "",
        fullName: clerkUser.fullName ?? clerkUser.firstName ?? "User",
        platformRole: "USER",
      });
    }
  }, [isSignedIn, clerkUser, setUser]);

  if (!isLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const isAuthenticated = storeIsAuthenticated || Boolean(isSignedIn);

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTES.login}
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return <>{children}</>;
}

/** Route chỉ dành cho khách; đã đăng nhập thì đẩy vào app (hoặc trang trước đó). */
export function GuestOnly({ children }: GuardProps) {
  const storeIsAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { isSignedIn, isLoaded } = useUser();
  const location = useLocation();

  if (!isLoaded) {
    return null;
  }

  const isAuthenticated = storeIsAuthenticated || Boolean(isSignedIn);

  if (isAuthenticated) {
    const from = (location.state as { from?: string } | null)?.from;
    return <Navigate to={from ?? ROUTES.app.dashboard} replace />;
  }

  return <>{children}</>;
}
