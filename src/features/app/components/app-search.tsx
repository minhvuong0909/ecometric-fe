import { CornerDownLeft, Search } from "lucide-react";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router";
import { APP_SHARED_COPY } from "@/features/app/constants/app-copy";
import { Input } from "@/shared/components/ui/input";
import { APP_SCREENS } from "@/shared/constants/figma-screens";
import { ROUTES } from "@/shared/constants/routes";
import { normalizeText } from "@/shared/lib/normalize-text";
import { cn } from "@/shared/lib/utils";

type SearchItem = {
  title: string;
  description?: string;
  path: string;
  keywords: string;
};

const SEARCH_ITEMS: SearchItem[] = [
  ...APP_SCREENS.map((screen) => ({
    title: screen.title,
    description: screen.description,
    path: screen.path,
    keywords: normalizeText(`${screen.title} ${screen.description}`),
  })),
  {
    title: "Hồ sơ tài khoản",
    description: "Thông tin tài khoản và doanh nghiệp của bạn.",
    path: ROUTES.app.account,
    keywords: normalizeText("hồ sơ tài khoản profile thông tin"),
  },
  {
    title: "Đổi mật khẩu",
    description: "Cập nhật mật khẩu đăng nhập.",
    path: ROUTES.app.changePassword,
    keywords: normalizeText("đổi mật khẩu change password bảo mật"),
  },
];

type AppSearchProps = {
  className?: string;
};

export function AppSearch({ className }: AppSearchProps) {
  const copy = APP_SHARED_COPY.topBar;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const normalized = normalizeText(query);
    if (!normalized) return SEARCH_ITEMS.slice(0, 6);
    return SEARCH_ITEMS.filter((item) =>
      item.keywords.includes(normalized),
    ).slice(0, 8);
  }, [query]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Phím tắt toàn cục Ctrl/Cmd + K để mở.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Khóa cuộn nền khi mở.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    setQuery("");
    setActive(0);
  };

  const go = (item: SearchItem) => {
    close();
    navigate(item.path);
  };

  const onInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((prev) => Math.min(prev + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((prev) => Math.max(prev - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const item = results[active];
      if (item) go(item);
    } else if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={copy.search}
        className={cn(
          "focus-ring flex h-10 items-center gap-2 rounded-md border border-border px-3 text-sm text-muted-foreground transition-colors hover:border-ring/60 hover:text-foreground",
          className,
        )}
      >
        <Search className="size-4" aria-hidden />
        <span className="hidden lg:inline">{copy.searchPlaceholder}</span>
        <kbd className="ml-2 hidden rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-muted-foreground lg:inline">
          {copy.searchShortcut}
        </kbd>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]"
          role="dialog"
          aria-modal="true"
          aria-label={copy.search}
        >
          <div
            className="animate-overlay-in fixed inset-0 bg-black/40"
            onClick={close}
            aria-hidden
          />
          <div className="animate-pop-in relative w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
            <div className="flex items-center gap-2 border-b border-border px-4">
              <Search
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden
              />
              <Input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder={copy.searchPlaceholder}
                className="h-12 border-0 px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                aria-label={copy.search}
              />
              <button
                type="button"
                onClick={close}
                className="focus-ring shrink-0 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-muted-foreground"
                aria-label={copy.searchClose}
              >
                Esc
              </button>
            </div>

            <div className="max-h-[320px] overflow-y-auto p-2">
              {results.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                  {copy.searchEmpty} “{query}”.
                </p>
              ) : (
                <ul>
                  {results.map((item, index) => (
                    <li key={item.path}>
                      <button
                        type="button"
                        onMouseEnter={() => setActive(index)}
                        onClick={() => go(item)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                          index === active
                            ? "bg-accent/10 text-foreground"
                            : "text-muted-foreground hover:bg-muted",
                        )}
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-foreground">
                            {item.title}
                          </span>
                          {item.description ? (
                            <span className="block truncate text-xs text-muted-foreground">
                              {item.description}
                            </span>
                          ) : null}
                        </span>
                        {index === active ? (
                          <CornerDownLeft
                            className="size-4 shrink-0 text-muted-foreground"
                            aria-hidden
                          />
                        ) : null}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
