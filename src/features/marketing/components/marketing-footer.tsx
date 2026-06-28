import { Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router";
import { Logo } from "@/shared/components/logo";
import {
  FOOTER_COLUMNS,
  FOOTER_COPY,
} from "@/features/marketing/constants/marketing-content";
import { cn } from "@/shared/lib/utils";

const currentYear = new Date().getFullYear();

export function MarketingFooter() {
  return (
    <footer
      id="contact"
      className="border-t border-white/5 bg-secondary-foreground pt-20 pb-10"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid w-full gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-16">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo variant="onDark" />
            <p className="mt-6 text-sm leading-relaxed text-footer-muted">
              {FOOTER_COPY.tagline}
            </p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold tracking-widest text-accent uppercase">
                {column.title}
              </h3>
              <ul className="mt-6 space-y-4">
                {column.links.map((link) => (
                  <li key={link.id}>
                    {link.href.startsWith("#") ? (
                      <a
                        href={link.href}
                        className={cn(
                          "text-sm transition-colors duration-150 focus-ring rounded-sm",
                          link.id === FOOTER_COPY.highlightLinkId
                            ? "text-accent/80 hover:text-accent"
                            : "text-white hover:text-secondary",
                        )}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className={cn(
                          "text-sm transition-colors duration-150 focus-ring rounded-sm",
                          link.id === FOOTER_COPY.highlightLinkId
                            ? "text-accent/80 hover:text-accent"
                            : "text-white hover:text-secondary",
                        )}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <p className="text-xs font-medium text-footer-muted">
            {FOOTER_COPY.copyright.replace("{year}", String(currentYear))}
          </p>
          <div className="flex gap-6">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-white/70 transition-colors duration-150 hover:text-white focus-ring rounded-sm"
            >
              <Linkedin className="size-5" aria-hidden />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="text-white/70 transition-colors duration-150 hover:text-white focus-ring rounded-sm"
            >
              <Twitter className="size-5" aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
