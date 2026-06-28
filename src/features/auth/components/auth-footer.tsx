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
    <footer
      className={cn(
        "flex flex-col gap-4 border-t border-border px-6 py-6 sm:flex-row sm:items-center sm:justify-between lg:px-6",
        className,
      )}
    >
      <p className="text-sm text-muted-foreground">
        {AUTH_COPY.footer.copyright.replace("{year}", String(currentYear))}
      </p>
      <nav aria-label="Pháp lý" className="flex gap-4">
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
    </footer>
  );
}
