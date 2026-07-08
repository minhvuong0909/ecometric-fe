import { Outlet, useLocation } from "react-router";

export function RootLayout() {
  const location = useLocation();
  // Chỉ đổi key theo nhánh cấp 1 (home/login/register/app...) để cross-fade
  // khi chuyển vùng lớn mà không remount vỏ ứng dụng con.
  const sectionKey = location.pathname.split("/")[1] || "home";

  return (
    <div className="min-h-dvh bg-background">
      <div key={sectionKey} className="route-transition">
        <Outlet />
      </div>
    </div>
  );
}
