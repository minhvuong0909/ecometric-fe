import { AlertTriangle, Trash2 } from "lucide-react";
import { AlertDialog as AlertDialogPrimitive } from "radix-ui";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "destructive" | "default";
  isLoading?: boolean;
  onConfirm: () => void;
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Xác nhận",
  cancelText = "Huỷ",
  variant = "destructive",
  isLoading = false,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity duration-200 animate-overlay-in" />
        <AlertDialogPrimitive.Content
          className={cn(
            "fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-6 shadow-2xl transition-all duration-200 animate-pop-in",
          )}
        >
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-xl",
                variant === "destructive"
                  ? "bg-destructive/10 text-destructive border border-destructive/20"
                  : "bg-primary/10 text-primary border border-primary/20",
              )}
            >
              {variant === "destructive" ? (
                <Trash2 className="size-5" aria-hidden />
              ) : (
                <AlertTriangle className="size-5" aria-hidden />
              )}
            </div>

            <div className="flex-1 space-y-1.5 pt-0.5">
              <AlertDialogPrimitive.Title className="text-base font-bold text-foreground">
                {title}
              </AlertDialogPrimitive.Title>
              {description ? (
                <AlertDialogPrimitive.Description className="text-xs leading-relaxed text-muted-foreground">
                  {description}
                </AlertDialogPrimitive.Description>
              ) : null}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <AlertDialogPrimitive.Cancel asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isLoading}
                className="font-medium"
              >
                {cancelText}
              </Button>
            </AlertDialogPrimitive.Cancel>

            <Button
              type="button"
              variant={variant}
              size="sm"
              disabled={isLoading}
              data-loading={isLoading}
              onClick={() => {
                onConfirm();
              }}
              className="font-bold"
            >
              {confirmText}
            </Button>
          </div>
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  );
}
