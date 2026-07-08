import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { Logo } from "@/shared/components/logo";
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
          <nav aria-label="Chính" className="hidden items-center gap-12 md:flex">
            {NAV_LINKS.map((link) =>
              link.href.startsWith("#") ? (
                <a
                  key={link.id}
                  href={link.href}
                  className={cn(
                    "text-sm font-semibold tracking-wide transition-colors duration-150 focus-ring rounded-sm",
                    link.id === "home"
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground active:text-foreground/80",
                  )}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.id}
                  to={link.href}
                  className={cn(
                    "text-sm font-semibold tracking-wide transition-colors duration-150 focus-ring rounded-sm",
                    link.id === "home"
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground active:text-foreground/80",
                  )}
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>
        </div>

        <div className="hidden items-center gap-6 md:flex">
          <Link
            to={ROUTES.login}
            className="text-sm font-semibold tracking-wide text-muted-foreground transition-colors duration-150 hover:text-foreground focus-ring rounded-sm"
          >
            {HEADER_COPY.login}
          </Link>
          <Button
            asChild
            className="h-10 bg-accent px-6 font-bold tracking-wide text-accent-foreground hover:bg-accent/90 active:bg-accent/80"
          >
            <Link to={ROUTES.register}>{HEADER_COPY.startTrial}</Link>
          </Button>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? HEADER_COPY.closeMenu : HEADER_COPY.openMenu}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
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
                  className="block rounded-md px-2 py-2.5 text-sm font-semibold tracking-wide text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-ring"
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
                className="w-full bg-accent font-bold tracking-wide text-accent-foreground hover:bg-accent/90"
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
