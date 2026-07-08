import type { ComponentProps } from "react";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

type TextFieldProps = ComponentProps<typeof Input> & {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
};

/** Field chuẩn cho form: Label + Input + thông báo lỗi/gợi ý. */
export function TextField({
  label,
  error,
  hint,
  required,
  id,
  ...props
}: TextFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {label}
        {required ? <span className="ml-0.5 text-destructive">*</span> : null}
      </Label>
      <Input id={id} aria-invalid={error ? true : undefined} {...props} />
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
