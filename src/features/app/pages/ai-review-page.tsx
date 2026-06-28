import { Link } from "react-router";
import { AlertTriangle } from "lucide-react";
import { AppPageHeader } from "@/features/app/components/app-page-header";
import { AppPanel } from "@/features/app/components/app-panel";
import { AI_REVIEW_COPY } from "@/features/app/constants/app-copy";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/lib/utils";

export function AiReviewPage() {
  const copy = AI_REVIEW_COPY;

  return (
    <div className="space-y-8">
      <AppPageHeader
        breadcrumbs={copy.breadcrumbs}
        title={copy.title}
        description={copy.description}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <AppPanel title="Hóa đơn năng lượng">
          <p className="mb-4 text-xs text-muted-foreground">Đã tải lên ngày 14 tháng 6, 2024 • 2,4 MB</p>
          <div className="rounded-lg border border-border bg-muted/30 p-6">
            <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
              Hóa đơn năng lượng
            </p>
            <p className="mt-4 text-sm">Điện năng tiêu thụ tháng 6 năm 2024</p>
            <div className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <span>Thành tiền</span>
                <span>12.450.000 ₫</span>
              </div>
              <div className="flex justify-between">
                <span>Thuế (5%)</span>
                <span>622.500 ₫</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Tổng cộng</span>
                <span>13.072.500 ₫</span>
              </div>
            </div>
          </div>
        </AppPanel>

        <AppPanel title="Kiểm tra trích xuất bằng AI">
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
            {copy.warning}
          </div>
          <div className="space-y-4">
            {copy.fields.map((field) => (
              <div key={field.label} className="space-y-1.5">
                <Label className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
                  {field.label}
                </Label>
                <Input
                  defaultValue={field.value}
                  readOnly
                  className={cn("bg-muted", "warn" in field && field.warn && "border-amber-400")}
                />
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {copy.actions.map((action, index) => (
              <Button key={action} variant={index === 0 ? "default" : "outline"} size="sm">
                {action}
              </Button>
            ))}
          </div>
        </AppPanel>
      </div>

      <div className="flex justify-end">
        <Button asChild className="font-bold">
          <Link to={ROUTES.app.emissionDetail}>{copy.calculateCta}</Link>
        </Button>
      </div>
    </div>
  );
}
