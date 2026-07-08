import { Bell } from "lucide-react";
import { AppSearch } from "@/features/app/components/app-search";
import { LiveClock } from "@/features/app/components/live-clock";
import { UserMenu } from "@/features/app/components/user-menu";
import { APP_SHARED_COPY } from "@/features/app/constants/app-copy";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

type AppTopBarProps = {
  className?: string;
};

export function AppTopBar({ className }: AppTopBarProps) {
  const copy = APP_SHARED_COPY.topBar;

  return (
    <header
      className={cn(
        "flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-6",
        className,
      )}
    >
      <div>
        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
          {copy.companyLabel}
        </p>
        <p className="text-lg font-bold text-secondary-foreground">{copy.companyName}</p>
      </div>

      <div className="flex items-center gap-3">
        <LiveClock />
        <AppSearch />
        <Button variant="ghost" size="icon" aria-label={copy.notifications}>
          <Bell className="size-4" />
        </Button>
        <UserMenu />
      </div>
    </header>
  );
}
