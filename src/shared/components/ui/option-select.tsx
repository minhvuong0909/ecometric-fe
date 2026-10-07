import { Children, isValidElement } from "react";
import type { ReactNode } from "react";
import { Select } from "radix-ui";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/utils";
type Props = {
  id?: string;
  value: string;
  onChange: (event: { target: { value: string } }) => void;
  required?: boolean;
  className?: string;
  children: ReactNode;
};
export function OptionSelect({
  id,
  value,
  onChange,
  required,
  className,
  children,
}: Props) {
  const options = Children.toArray(children).filter(
    isValidElement<{ value: string; children: ReactNode }>,
  );
  const placeholder = options.find((option) => option.props.value === "")?.props
    .children;
  return (
    <Select.Root
      value={value || "__empty"}
      onValueChange={(next) => onChange({ target: { value: next === "__empty" ? "" : next } })}
      required={required}
    >
      <Select.Trigger
        id={id}
        className={cn(
          "flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border border-input bg-card px-3.5 text-left text-sm shadow-xs outline-none transition-colors hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring data-[placeholder]:text-muted-foreground",
          className,
        )}
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon>
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={6}
          className="z-50 max-h-[min(320px,var(--radix-select-content-available-height))] w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-lg"
        >
          <Select.Viewport>
            {options
              
              .map((option) => (
                <Select.Item
                  key={option.props.value}
                  value={option.props.value || "__empty"}
                  className="relative flex cursor-default items-center rounded-lg py-2.5 pr-9 pl-3 text-sm outline-none data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary data-[state=checked]:font-semibold"
                >
                  <Select.ItemText>{option.props.children}</Select.ItemText>
                  <Select.ItemIndicator className="absolute right-3 text-primary">
                    <Check className="size-4" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
