import { cn } from "@/shared/lib/utils";

type WizardStep = {
  label: string;
  active?: boolean;
  completed?: boolean;
};

type WizardStepperProps = {
  steps: WizardStep[];
  className?: string;
};

export function WizardStepper({ steps, className }: WizardStepperProps) {
  return (
    <ol
      className={cn(
        "flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4",
        className,
      )}
      aria-label="Tiến trình thiết lập"
    >
      {steps.map((step, index) => (
        <li key={step.label} className="flex items-center gap-4">
          <span
            className={cn(
              "text-xs font-bold tracking-wide uppercase",
              step.active
                ? "text-primary"
                : step.completed
                  ? "text-secondary-foreground"
                  : "text-muted-foreground",
            )}
          >
            {step.label}
          </span>
          {index < steps.length - 1 ? (
            <span className="hidden text-muted-foreground sm:inline" aria-hidden>
              →
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
