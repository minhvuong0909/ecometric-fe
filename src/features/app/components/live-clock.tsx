import { useEffect, useState } from "react";
import { cn } from "@/shared/lib/utils";

const DATE_FORMAT = new Intl.DateTimeFormat("vi-VN", {
  weekday: "short",
  day: "2-digit",
  month: "2-digit",
});

const TIME_HM_FORMAT = new Intl.DateTimeFormat("vi-VN", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

type LiveClockProps = {
  className?: string;
};

/** Đồng hồ thời gian thực: chấm "live" nhấp nháy, giờ:phút đậm, giây mờ nhỏ. */
export function LiveClock({ className }: LiveClockProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const seconds = now.getSeconds().toString().padStart(2, "0");

  return (
    <div
      className={cn(
        "hidden h-10 items-center gap-2.5 rounded-lg border border-border bg-muted/40 pr-3.5 pl-3 md:flex",
        className,
      )}
    >
      <span className="relative flex size-2" aria-hidden>
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-70 motion-reduce:animate-none" />
        <span className="relative inline-flex size-2 rounded-full bg-primary" />
      </span>

      <span className="text-xs font-medium text-muted-foreground tabular-nums">
        {DATE_FORMAT.format(now)}
      </span>

      <span className="h-4 w-px bg-border" aria-hidden />

      <time
        className="flex items-baseline tabular-nums"
        dateTime={now.toISOString()}
        aria-live="off"
      >
        <span className="text-sm font-semibold tracking-tight text-secondary-foreground">
          {TIME_HM_FORMAT.format(now)}
        </span>
        <span className="text-xs font-medium text-muted-foreground">
          :{seconds}
        </span>
      </time>
    </div>
  );
}
