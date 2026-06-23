import { Link } from "react-router";
import { cn } from "@/shared/lib/utils";

type AuthFooterProps = {
  className?: string;
};

const footerLinks = [
  { label: "Privacy", href: "#privacy" },
  { label: "Terms", href: "#terms" },
  { label: "Support", href: "#support" },
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
        © {currentYear} EcoMetric Platform.
      </p>
      <nav aria-label="Legal" className="flex gap-4">
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
