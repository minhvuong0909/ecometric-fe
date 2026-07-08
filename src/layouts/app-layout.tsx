import { Menu, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router";
import { AppTopBar } from "@/features/app/components/app-top-bar";
import { LogoutButton } from "@/features/app/components/logout-button";
import { APP_SHARED_COPY } from "@/features/app/constants/app-copy";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { Logo } from "@/shared/components/logo";
import { Button } from "@/shared/components/ui/button";
import { APP_NAV_ITEMS } from "@/shared/constants/figma-screens";
import { ROUTES } from "@/shared/constants/routes";
import { getInitials } from "@/shared/lib/get-initials";
import { cn } from "@/shared/lib/utils";

const NAV_BY_ID = new Map(APP_NAV_ITEMS.map((item) => [item.id, item]));
const SIDEBAR_COLLAPSED_KEY = "ecometric.sidebarCollapsed";

function readCollapsed(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "1";
}

type SidebarBodyProps = {
  collapsed?: boolean;
  onNavigate?: () => void;
};

function SidebarNav({ collapsed = false, onNavigate }: SidebarBodyProps) {
  return (
    <nav
      aria-label="Không gian làm việc"
      className="flex-1 space-y-6 overflow-y-auto px-3 py-5"
    >
      {APP_SHARED_COPY.navGroups.map((group) => (
        <div key={group.label} className="space-y-1">
          {collapsed ? (
            <div className="mx-3 mb-1 h-px bg-border" aria-hidden />
          ) : (
            <p className="px-3 pb-1 text-[10px] font-semibold tracking-widest text-muted-foreground/70 uppercase">
              {group.label}
            </p>
          )}
          {group.ids.map((id) => {
            const item = NAV_BY_ID.get(id);
            if (!item) return null;
            const Icon = item.navIcon;
            return (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={onNavigate}
                title={collapsed ? item.title : undefined}
                aria-label={collapsed ? item.title : undefined}
                className={({ isActive }) =>
                  cn(
                    "group relative flex items-center gap-3 rounded-lg py-2.5 text-sm font-medium transition-colors duration-150 focus-ring",
                    collapsed ? "justify-center px-0" : "px-3",
                    isActive
                      ? "bg-secondary text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      aria-hidden
                      className={cn(
                        "absolute top-1/2 left-0 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary transition-opacity duration-150",
                        isActive ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {Icon ? (
                      <Icon
                        className={cn(
                          "size-4 shrink-0 transition-colors duration-150",
                          isActive
                            ? "text-primary"
                            : "text-muted-foreground group-hover:text-foreground",
                        )}
                        aria-hidden
                      />
                    ) : null}
                    {collapsed ? null : (
                      <span className="truncate">{item.title}</span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

function SidebarUser({ collapsed = false }: SidebarBodyProps) {
  const user = useAuthStore((state) => state.user);
  const name = user?.fullName?.trim() || user?.email || "EcoMetric";
  const initials = getInitials(user?.fullName?.trim() || user?.email || "");

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-2 border-t border-border p-3">
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary-foreground text-xs font-bold text-accent"
          title={name}
        >
          {initials}
        </span>
        <LogoutButton
          iconOnly
          className="text-muted-foreground hover:text-foreground"
        />
      </div>
    );
  }

  return (
    <div className="border-t border-border p-3">
      <div className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary-foreground text-xs font-bold text-accent">
          {initials}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{name}</p>
          {user?.email ? (
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          ) : null}
        </div>
      </div>
      <LogoutButton className="text-muted-foreground hover:text-foreground" />
    </div>
  );
}

export function AppLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileNavRef = useRef<HTMLElement>(null);

  useEffect(() => {
    window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, collapsed ? "1" : "0");
  }, [collapsed]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Drawer mobile: khóa cuộn nền, đóng bằng Escape, giữ focus bên trong (focus-trap),
  // và trả focus về nút mở khi đóng.
  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const getFocusable = () => {
      const node = mobileNavRef.current;
      if (!node) return [] as HTMLElement[];
      return Array.from(
        node.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null);
    };

    getFocusable()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = getFocusable();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [mobileOpen]);

  return (
    <div className="flex min-h-dvh bg-background">
      {/* Desktop sidebar (collapsible) */}
      <aside
        className={cn(
          "hidden shrink-0 border-r border-border bg-card transition-[width] duration-300 ease-out lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col",
          collapsed ? "lg:w-[76px]" : "lg:w-[280px]",
        )}
      >
        <div
          className={cn(
            "flex items-center border-b border-border px-4 py-5",
            collapsed ? "flex-col gap-3" : "justify-between gap-2 px-6",
          )}
        >
          <NavLink
            to={ROUTES.app.dashboard}
            className="focus-ring inline-flex rounded-sm"
            aria-label="EcoMetric"
          >
            <Logo iconOnly={collapsed} />
          </NavLink>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-foreground"
            aria-label={
              collapsed
                ? APP_SHARED_COPY.sidebar.expand
                : APP_SHARED_COPY.sidebar.collapse
            }
            aria-expanded={!collapsed}
            onClick={() => setCollapsed((prev) => !prev)}
          >
            {collapsed ? (
              <PanelLeftOpen className="size-4" aria-hidden />
            ) : (
              <PanelLeftClose className="size-4" aria-hidden />
            )}
          </Button>
        </div>

        {collapsed ? null : (
          <p className="px-6 pb-3 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            {APP_SHARED_COPY.sidebarTagline}
          </p>
        )}

        <SidebarNav collapsed={collapsed} />
        <SidebarUser collapsed={collapsed} />
      </aside>

      {/* Mobile drawer */}
      <div
        className={cn("lg:hidden", mobileOpen ? "" : "pointer-events-none")}
        aria-hidden={!mobileOpen}
      >
        <div
          className={cn(
            "fixed inset-0 z-40 bg-black/40 transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setMobileOpen(false)}
        />
        <aside
          ref={mobileNavRef}
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex w-[280px] max-w-[82%] flex-col border-r border-border bg-card shadow-xl transition-transform duration-300 ease-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Điều hướng"
        >
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <Logo />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-foreground"
              aria-label={APP_SHARED_COPY.sidebar.closeMenu}
              onClick={() => setMobileOpen(false)}
            >
              <X className="size-4" aria-hidden />
            </Button>
          </div>
          <SidebarNav onNavigate={() => setMobileOpen(false)} />
          <SidebarUser />
        </aside>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-border bg-card px-4 py-4 lg:hidden">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            aria-label={APP_SHARED_COPY.sidebar.openMenu}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="size-5" aria-hidden />
          </Button>
          <Logo />
          <span className="size-9" aria-hidden />
        </div>
        <AppTopBar className="sticky top-0 z-20 hidden lg:flex" />
        <main className="flex-1 px-6 py-8 lg:px-8">
          <div key={location.pathname} className="route-transition">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
