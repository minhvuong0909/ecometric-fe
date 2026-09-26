import { useEffect } from "react";
import { Bell, Building2, ChevronDown } from "lucide-react";
import { Link } from "react-router";
import { AppSearch } from "@/features/app/components/app-search";
import { LiveClock } from "@/features/app/components/live-clock";
import { UserMenu } from "@/features/app/components/user-menu";
import { ThemeToggle } from "@/shared/components/theme-toggle";
import { APP_SHARED_COPY } from "@/features/app/constants/app-copy";
import { useBusinesses } from "@/features/businesses/hooks/use-businesses";
import { useBusinessStore } from "@/shared/stores/business-store";
import { Button } from "@/shared/components/ui/button";
import { ROUTES } from "@/shared/constants/routes";
import { cn } from "@/shared/lib/utils";

type AppTopBarProps = {
  className?: string;
};

export function AppTopBar({ className }: AppTopBarProps) {
  const copy = APP_SHARED_COPY.topBar;
  const { data: businessesData } = useBusinesses({ limit: 100 });
  const { activeBusinessId, activeBusiness, setActiveBusiness } = useBusinessStore();

  const businesses = businessesData?.items ?? [];

  useEffect(() => {
    if (businesses.length > 0) {
      const found = businesses.find((b) => b.id === activeBusinessId);
      if (found) {
        if (!activeBusiness || activeBusiness.id !== found.id) {
          setActiveBusiness(found);
        }
      } else {
        // Auto select first business
        setActiveBusiness(businesses[0]);
      }
    }
  }, [businesses, activeBusinessId, activeBusiness, setActiveBusiness]);

  return (
    <header
      className={cn(
        "flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-6",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
          <Building2 className="size-5" />
        </div>
        <div>
          <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
            {copy.companyLabel}
          </p>
          {businesses.length > 1 ? (
            <div className="relative inline-block">
              <select
                aria-label="Chọn doanh nghiệp đang hoạt động"
                value={activeBusiness?.id ?? ""}
                onChange={(e) => {
                  const target = businesses.find((b) => b.id === e.target.value);
                  if (target) setActiveBusiness(target);
                }}
                className="cursor-pointer appearance-none bg-transparent pr-6 text-sm font-bold text-foreground focus:outline-none hover:text-primary transition-colors"
              >
                {businesses.map((b) => (
                  <option key={b.id} value={b.id} className="bg-popover text-popover-foreground">
                    {b.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            </div>
          ) : (
            <Link
              to={ROUTES.app.businesses}
              className="text-sm font-bold text-foreground hover:text-primary transition-colors"
              title="Quản lý doanh nghiệp"
            >
              {activeBusiness?.name ?? (businesses.length === 0 ? "Chưa chọn doanh nghiệp" : copy.companyName)}
            </Link>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <LiveClock />
        <AppSearch />
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          aria-label={copy.notifications}
          className="size-9 rounded-lg border border-border/60 bg-muted/30 hover:bg-muted text-muted-foreground hover:text-foreground"
        >
          <Bell className="size-4" />
        </Button>
        <UserMenu />
      </div>
    </header>
  );
}

