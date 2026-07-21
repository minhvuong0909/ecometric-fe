import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Check } from "lucide-react";
import { useEffect, useState } from "react";

// ---------------------------------------------------------
// Shake Animation Wrapper
// ---------------------------------------------------------
interface ShakeWrapperProps {
  children: React.ReactNode;
  trigger: any; // Trigger animation when this value changes (e.g. error message)
  enabled?: boolean;
  className?: string;
}

export function ShakeWrapper({ children, trigger, enabled = true, className }: ShakeWrapperProps) {
  const [shouldShake, setShouldShake] = useState(false);

  useEffect(() => {
    if (trigger && enabled) {
      setShouldShake(true);
      const timer = setTimeout(() => setShouldShake(false), 400);
      return () => clearTimeout(timer);
    }
  }, [trigger, enabled]);

  return (
    <motion.div
      animate={shouldShake ? { x: [0, -6, 6, -6, 6, -3, 3, 0] } : { x: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------
// Validation Status Icon Component
// ---------------------------------------------------------
interface ValidationIconProps {
  error?: string;
  hasValue?: boolean;
  /** Force hide success checkmark (e.g. for password inputs with toggles) */
  hideSuccess?: boolean;
}

export function ValidationIcon({ error, hasValue, hideSuccess }: ValidationIconProps) {
  return (
    <div className="relative flex size-4.5 items-center justify-center shrink-0">
      <AnimatePresence mode="wait">
        {error ? (
          <motion.div
            key="error-icon"
            initial={{ scale: 0, rotate: 45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -45 }}
            transition={{ type: "spring", stiffness: 350, damping: 15 }}
          >
            <AlertCircle className="size-4 text-destructive" aria-hidden />
          </motion.div>
        ) : hasValue && !hideSuccess ? (
          <motion.div
            key="success-icon"
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 45 }}
            transition={{ type: "spring", stiffness: 350, damping: 15 }}
            className="flex size-4 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/35"
          >
            <Check className="size-2.5 text-emerald-500 stroke-[3]" aria-hidden />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------
// Animated Form Field Error Message Component
// ---------------------------------------------------------
interface FormFieldErrorProps {
  error?: string;
  id?: string;
}

export function FormFieldError({ error, id }: FormFieldErrorProps) {
  return (
    <div className="overflow-hidden">
      <AnimatePresence initial={false} mode="wait">
        {error ? (
          <motion.div
            key="error-msg"
            id={id}
            role="alert"
            initial={{ height: 0, opacity: 0, y: -4 }}
            animate={{
              height: "auto",
              opacity: 1,
              y: 0,
              transition: {
                height: { type: "spring", stiffness: 350, damping: 25 },
                opacity: { duration: 0.15 },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              y: -4,
              transition: {
                height: { type: "spring", stiffness: 350, damping: 25 },
                opacity: { duration: 0.12 },
              },
            }}
            className="flex items-center gap-1.5 pt-1 text-xs text-destructive"
          >
            <AlertCircle className="size-3.5 shrink-0" aria-hidden />
            <span className="font-medium leading-none">{error}</span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
