import { NavLink } from "react-router";
import { Keyboard, Upload } from "lucide-react";
import { ROUTES } from "@/shared/constants/routes";
import { cn } from "@/shared/lib/utils";

export function DataEntryMethods() {
  return (
    <nav
      aria-label="Cách nhập dữ liệu"
      className="grid w-full max-w-md grid-cols-2 gap-1 rounded-xl border border-border bg-muted/60 p-1"
    >
      {[
        { path: ROUTES.app.dataInput, label: "Nhập thủ công", icon: Keyboard },
        { path: ROUTES.app.uploadDoc, label: "Tải hóa đơn lên", icon: Upload },
      ].map(({ path, label, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            cn(
              "flex items-center justify-center gap-2 rounded-lg px-3 py-3 text-sm font-medium transition-colors focus-ring",
              isActive
                ? "bg-card text-primary shadow-sm ring-1 ring-border"
                : "text-muted-foreground hover:bg-card/60 hover:text-foreground",
            )
          }
        >
          <Icon className="size-4" aria-hidden />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
