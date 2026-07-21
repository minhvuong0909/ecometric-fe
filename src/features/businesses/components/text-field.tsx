import type { ComponentProps } from "react";
import { useState } from "react";
import {
  FormFieldError,
  ShakeWrapper,
  ValidationIcon,
} from "@/shared/components/ui/form-validation";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/lib/utils";

type TextFieldProps = ComponentProps<typeof Input> & {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  shakeOnError?: boolean;
};

/** Field chuẩn cho form: Label + Input + thông báo lỗi/gợi ý. */
export function TextField({
  label,
  error,
  hint,
  required,
  id,
  className,
  shakeOnError = false,
  ...props
}: TextFieldProps) {
  const [hasValue, setHasValue] = useState(false);

  const currentVal = props.value !== undefined ? props.value : "";
  const inputHasValue = currentVal ? String(currentVal).length > 0 : hasValue;

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0);
    props.onChange?.(e);
  };

  return (
    <div className="space-y-1.5 w-full">
      <Label htmlFor={id}>
        {label}
        {required ? <span className="ml-0.5 text-destructive">*</span> : null}
      </Label>
      <ShakeWrapper trigger={error} enabled={shakeOnError}>
        <div className="relative flex items-center w-full">
          <Input
            id={id}
            aria-invalid={Boolean(error)}
            className={cn(
              "transition-all duration-300 pr-10",
              error ? "bg-destructive/5 border-destructive/60 focus-visible:border-destructive focus-visible:ring-destructive/20" : "",
              inputHasValue && !error
                ? "border-emerald-500/40 bg-emerald-500/[0.02] dark:bg-emerald-500/[0.01] focus-visible:border-emerald-500 focus-visible:ring-emerald-500/25"
                : "",
              className
            )}
            {...props}
            onChange={handleOnChange}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <ValidationIcon error={error} hasValue={inputHasValue} />
          </div>
        </div>
      </ShakeWrapper>
      <FormFieldError error={error} />
      {!error && hint ? (
        <p className="text-[11px] text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
