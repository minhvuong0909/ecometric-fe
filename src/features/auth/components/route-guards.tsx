import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { ROUTES } from "@/shared/constants/routes";

type GuardProps = {
  children: ReactNode;
};

/** Chặn route yêu cầu đăng nhập; đẩy về /login kèm đường dẫn gốc để quay lại. */
export function RequireAuth({ children }: GuardProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

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
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (isAuthenticated) {
    const from = (location.state as { from?: string } | null)?.from;
    return <Navigate to={from ?? ROUTES.app.dashboard} replace />;
  }

  return <>{children}</>;
}
