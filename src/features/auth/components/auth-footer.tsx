import { Link } from "react-router";
import { AUTH_COPY } from "@/features/auth/constants/auth-content";
import { cn } from "@/shared/lib/utils";

type AuthFooterProps = {
  className?: string;
};

const footerLinks = [
  { label: AUTH_COPY.footer.privacy, href: "#privacy" },
  { label: AUTH_COPY.footer.terms, href: "#terms" },
  { label: AUTH_COPY.footer.support, href: "#support" },
] as const;

const currentYear = new Date().getFullYear();

export function AuthFooter({ className }: AuthFooterProps) {
  return (
    <footer className={cn("border-t border-border py-5", className)}>
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-6 sm:flex-row sm:text-left lg:px-8">
        <p className="text-sm text-muted-foreground">
          {AUTH_COPY.footer.copyright.replace("{year}", String(currentYear))}
        </p>
        <nav
          aria-label="Pháp lý"
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="link-muted text-sm"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
