import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/shared/lib/utils";

type PasswordStrengthProps = {
  password?: string;
};

type Criterion = {
  id: string;
  label: string;
  test: (val: string) => boolean;
};

const CRITERIA: Criterion[] = [
  {
    id: "length",
    label: "Tối thiểu 8 ký tự",
    test: (val) => val.length >= 8,
  },
  {
    id: "lowercase",
    label: "Chứa ít nhất 1 chữ thường (a-z)",
    test: (val) => /[a-z]/.test(val),
  },
  {
    id: "uppercase",
    label: "Chứa ít nhất 1 chữ hoa (A-Z)",
    test: (val) => /[A-Z]/.test(val),
  },
  {
    id: "number-symbol",
    label: "Chứa ít nhất 1 số (0-9) hoặc ký tự đặc biệt",
    test: (val) => /[\d\W_]/.test(val),
  },
];

export function PasswordStrength({ password = "" }: PasswordStrengthProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Only show the strength indicator if the user has started typing
  useEffect(() => {
    if (password.length > 0) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [password]);

  if (!isVisible) return null;

  const results = CRITERIA.map((criterion) => ({
    id: criterion.id,
    label: criterion.label,
    passed: criterion.test(password),
  }));

  const score = results.filter((r) => r.passed).length;

  // Determine indicator colors based on Clerk/Stripe palette
  const getStrengthConfig = (score: number) => {
    switch (score) {
      case 1:
        return {
          colorClass: "bg-red-500",
          text: "Yếu",
          textColor: "text-red-500 dark:text-red-400",
        };
      case 2:
        return {
          colorClass: "bg-amber-500",
          text: "Trung bình",
          textColor: "text-amber-500 dark:text-amber-400",
        };
      case 3:
        return {
          colorClass: "bg-emerald-500/80",
          text: "Tốt",
          textColor: "text-emerald-600 dark:text-emerald-400",
        };
      case 4:
        return {
          colorClass: "bg-emerald-500",
          text: "Rất mạnh",
          textColor: "text-emerald-500 dark:text-emerald-400",
        };
      default:
        return {
          colorClass: "bg-muted",
          text: "Quá yếu",
          textColor: "text-muted-foreground",
        };
    }
  };

  const { colorClass, text, textColor } = getStrengthConfig(score);

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card/40 p-4 shadow-sm backdrop-blur-sm animate-fade-up">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground">Độ mạnh mật khẩu:</span>
        <span className={cn("text-xs font-bold transition-all duration-300", textColor)}>
          {text}
        </span>
      </div>

      {/* Segmented Progress Bar */}
      <div className="grid grid-cols-4 gap-1.5">
        {[1, 2, 3, 4].map((step) => {
          const isActive = score >= step;
          return (
            <div
              key={step}
              className="h-1.5 overflow-hidden rounded-full bg-muted/65 dark:bg-muted/30"
            >
              <div
                className={cn(
                  "h-full w-full transform origin-left transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  isActive ? colorClass : "scale-x-0"
                )}
              />
            </div>
          );
        })}
      </div>

      {/* Criteria Checklist */}
      <ul className="space-y-2 pt-1 text-xs">
        {results.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-2.5 text-muted-foreground transition-all duration-300"
          >
            <span
              className={cn(
                "flex size-4.5 shrink-0 items-center justify-center rounded-full border text-white transition-all duration-300",
                item.passed
                  ? "border-emerald-500 bg-emerald-500 scale-100 shadow-sm shadow-emerald-500/10"
                  : "border-muted-foreground/35 bg-transparent"
              )}
            >
              <Check
                className={cn(
                  "size-3 transition-transform duration-300",
                  item.passed ? "scale-100 opacity-100" : "scale-50 opacity-0"
                )}
              />
            </span>
            <span
              className={cn(
                "transition-colors duration-300",
                item.passed ? "text-foreground font-medium" : "text-muted-foreground"
              )}
            >
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
