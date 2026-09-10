import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/shared/stores/theme-store";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useThemeStore();
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={cn(
        "relative size-9 rounded-lg border border-border/60 bg-muted/30 hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200",
        className,
      )}
      title={isDark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
      aria-label="Chuyển chế độ giao diện"
    >
      <Sun
        className={cn(
          "size-4 transition-all duration-300",
          isDark ? "rotate-90 scale-0 opacity-0 absolute" : "rotate-0 scale-100 opacity-100",
        )}
      />
      <Moon
        className={cn(
          "size-4 transition-all duration-300 text-emerald-400",
          isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0 absolute",
        )}
      />
    </Button>
  );
}
