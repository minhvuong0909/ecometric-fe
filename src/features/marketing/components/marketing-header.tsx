import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { Logo } from "@/shared/components/logo";
import { ThemeToggle } from "@/shared/components/theme-toggle";
import {
  HEADER_COPY,
  NAV_LINKS,
} from "@/features/marketing/constants/marketing-content";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

export function MarketingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6 lg:px-8">
        <div className="flex items-center gap-8 lg:gap-12">
          <Link to={ROUTES.home} className="focus-ring rounded-sm" aria-label="EcoMetric trang chủ">
            <Logo />
          </Link>
          <nav aria-label="Chính" className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) =>
              link.href.startsWith("#") ? (
                <a
                  key={link.id}
                  href={link.href}
                  className={cn(
                    "text-sm font-semibold tracking-wide transition-all duration-200 focus-ring px-3 py-1.5 rounded-lg",
                    link.id === "home"
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:bg-primary/10 hover:text-primary active:bg-primary/15",
                  )}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.id}
                  to={link.href}
                  className={cn(
                    "text-sm font-semibold tracking-wide transition-all duration-200 focus-ring px-3 py-1.5 rounded-lg",
                    link.id === "home"
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:bg-primary/10 hover:text-primary active:bg-primary/15",
                  )}
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link
            to={ROUTES.login}
            className="text-sm font-semibold tracking-wide text-muted-foreground transition-all duration-200 hover:bg-primary/10 hover:text-primary px-3 py-1.5 rounded-lg focus-ring"
          >
            {HEADER_COPY.login}
          </Link>
          <Button
            asChild
            className="h-10 bg-gradient-to-r from-emerald-600 to-teal-600 px-6 font-bold tracking-wide text-white shadow-md shadow-emerald-600/20 hover:from-emerald-700 hover:to-teal-700"
          >
            <Link to={ROUTES.register}>{HEADER_COPY.startTrial}</Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? HEADER_COPY.closeMenu : HEADER_COPY.openMenu}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen ? (
        <nav
          id="mobile-nav"
          aria-label="Di động"
          className="border-t border-border bg-card px-6 py-4 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  className="block rounded-lg px-3 py-2 text-sm font-semibold tracking-wide text-muted-foreground transition-all duration-200 hover:bg-primary/10 hover:text-primary focus-ring"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="mt-3 flex flex-col gap-2 border-t border-border pt-4">
              <Button variant="outline" asChild className="w-full">
                <Link to={ROUTES.login} onClick={() => setMobileOpen(false)}>
                  {HEADER_COPY.login}
                </Link>
              </Button>
              <Button
                asChild
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 font-bold tracking-wide text-white hover:from-emerald-700 hover:to-teal-700"
              >
                <Link to={ROUTES.register} onClick={() => setMobileOpen(false)}>
                  {HEADER_COPY.startTrial}
                </Link>
              </Button>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
