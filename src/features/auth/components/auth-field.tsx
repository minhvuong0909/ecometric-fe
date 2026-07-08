import type { LucideIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/lib/utils";

type AuthFieldProps = ComponentProps<"input"> & {
  id: string;
  label: string;
  icon: LucideIcon;
  error?: string;
  /** Phần tử phụ bên phải input, ví dụ nút hiện/ẩn mật khẩu */
  trailing?: ReactNode;
};

export function AuthField({
  id,
  label,
  icon: Icon,
  error,
  trailing,
  className,
  ...props
}: AuthFieldProps) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="group relative">
        <Icon
          className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground transition-colors duration-150 group-focus-within:text-primary"
          aria-hidden
        />
        <Input
          id={id}
          className={cn("h-12 pl-11", trailing ? "pr-12" : undefined, className)}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          {...props}
        />
        {trailing ? (
          <div className="absolute top-1/2 right-2 -translate-y-1/2">
            {trailing}
          </div>
        ) : null}
      </div>
      {error ? (
        <p id={errorId} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
