import { NavLink, Outlet } from "react-router";
import { AppTopBar } from "@/features/app/components/app-top-bar";
import { APP_SHARED_COPY } from "@/features/app/constants/app-copy";
import { Logo } from "@/shared/components/logo";
import { APP_NAV_ITEMS } from "@/shared/constants/figma-screens";
import { ROUTES } from "@/shared/constants/routes";
import { cn } from "@/shared/lib/utils";

export function AppLayout() {
  return (
    <div className="flex min-h-dvh bg-background">
      <aside className="hidden w-[280px] shrink-0 border-r border-border bg-card lg:flex lg:flex-col">
        <div className="border-b border-border px-6 py-5">
          <NavLink to={ROUTES.app.dashboard} className="focus-ring rounded-sm">
            <Logo />
          </NavLink>
          <p className="mt-2 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            {APP_SHARED_COPY.sidebarTagline}
          </p>
        </div>
        <nav aria-label="Không gian làm việc" className="flex-1 space-y-1 p-4">
          {APP_NAV_ITEMS.map((item) => {
            const Icon = item.navIcon;
            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150 focus-ring",
                    isActive
                      ? "bg-secondary text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )
                }
              >
                {Icon ? <Icon className="size-4 shrink-0" aria-hidden /> : null}
                {item.title}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="lg:hidden border-b border-border bg-card px-6 py-4">
          <Logo />
        </div>
        <AppTopBar className="hidden lg:flex" />
        <main className="flex-1 px-6 py-8 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
