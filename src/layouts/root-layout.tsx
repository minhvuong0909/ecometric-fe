import { Outlet } from "react-router";

export function RootLayout() {
  return (
    <div className="min-h-dvh bg-background">
      <Outlet />
    </div>
  );
}
