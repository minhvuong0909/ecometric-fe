import { Droplets, Fuel, Trash2, Truck, Zap } from "lucide-react";
import { AppPageHeader } from "@/features/app/components/app-page-header";
import { AppPanel } from "@/features/app/components/app-panel";
import { DATA_INPUT_COPY } from "@/features/app/constants/app-copy";
import { APP_SHARED_COPY } from "@/features/app/constants/app-copy";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

const CARD_ICONS = [Zap, Fuel, Truck, Trash2, Droplets] as const;

export function DataInputPage() {
  const copy = DATA_INPUT_COPY;

  return (
    <div className="space-y-8">
      <AppPageHeader
        breadcrumbs={copy.breadcrumbs}
        title={copy.title}
        description={copy.description}
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="rounded-xl border border-border bg-card px-6 py-4 shadow-sm">
          <p className="text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
            {APP_SHARED_COPY.topBar.companyLabel}
          </p>
          <p className="text-lg font-semibold">{APP_SHARED_COPY.topBar.companyName}</p>
        </div>
        <div className="min-w-[280px] rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between text-sm font-semibold">
            <span>{copy.completeness}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-3/4 rounded-full bg-primary" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {copy.cards.map((card, index) => {
          const Icon = CARD_ICONS[index];
          return (
            <AppPanel key={card.title} bodyClassName="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-secondary">
                    <Icon className="size-5 text-primary" aria-hidden />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-secondary-foreground">{card.title}</h2>
                    <p className="text-sm text-muted-foreground">{card.subtitle}</p>
                  </div>
                </div>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  Bắt buộc
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {card.fields.map((field) => (
                  <div key={field.label} className="space-y-1.5">
                    <Label className="text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
                      {field.label}
                    </Label>
                    <Input defaultValue={field.value} readOnly className="bg-muted" />
                  </div>
                ))}
              </div>
            </AppPanel>
          );
        })}
      </div>

      <div className="flex justify-end">
        <Button className="bg-primary font-bold">{copy.cta}</Button>
      </div>
    </div>
  );
}
