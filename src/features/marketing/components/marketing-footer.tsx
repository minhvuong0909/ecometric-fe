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
      className="border-t border-border/80 bg-slate-950 dark:bg-[#070d0a] pt-20 pb-10 text-slate-300"
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
                          "inline-flex text-sm transition-all duration-200 focus-ring px-2.5 py-1 -mx-2.5 rounded-lg",
                          link.id === FOOTER_COPY.highlightLinkId
                            ? "text-emerald-400 font-semibold hover:bg-emerald-500/15 hover:text-emerald-300"
                            : "text-slate-300 hover:bg-white/10 hover:text-emerald-400 dark:text-slate-400 dark:hover:bg-primary/15 dark:hover:text-emerald-400",
                        )}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className={cn(
                          "inline-flex text-sm transition-all duration-200 focus-ring px-2.5 py-1 -mx-2.5 rounded-lg",
                          link.id === FOOTER_COPY.highlightLinkId
                            ? "text-emerald-400 font-semibold hover:bg-emerald-500/15 hover:text-emerald-300"
                            : "text-slate-300 hover:bg-white/10 hover:text-emerald-400 dark:text-slate-400 dark:hover:bg-primary/15 dark:hover:text-emerald-400",
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
          <div className="flex gap-4">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-emerald-400 p-2 rounded-lg focus-ring"
            >
              <Linkedin className="size-5" aria-hidden />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-emerald-400 p-2 rounded-lg focus-ring"
            >
              <Twitter className="size-5" aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
