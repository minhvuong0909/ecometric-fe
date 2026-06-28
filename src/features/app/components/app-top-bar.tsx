import { Bell, Calendar, ChevronDown, Search } from "lucide-react";
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

      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          className="hidden h-10 gap-2 border-border px-4 font-semibold tracking-wide sm:flex"
        >
          <Calendar className="size-4" aria-hidden />
          {copy.period}
          <ChevronDown className="size-4 opacity-60" aria-hidden />
        </Button>
        <Button variant="ghost" size="icon" className="hidden sm:flex" aria-label={copy.search}>
          <Search className="size-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label={copy.notifications}>
          <Bell className="size-4" />
        </Button>
        <div
          className="flex size-8 items-center justify-center rounded-full bg-secondary-foreground text-xs font-bold text-accent"
          aria-label={copy.avatarLabel}
        >
          {copy.avatarInitials}
        </div>
      </div>
    </header>
  );
}
