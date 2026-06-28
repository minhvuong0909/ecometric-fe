import type { ReactNode } from "react";
import { Link } from "react-router";
import { AppPageHeader } from "@/features/app/components/app-page-header";
import { AppPanel } from "@/features/app/components/app-panel";
import { WizardStepper } from "@/features/app/components/wizard-stepper";
import {
  APP_SHARED_COPY,
  INPUT_STEP_1_COPY,
  INPUT_STEP_2_COPY,
  INPUT_STEP_3_COPY,
} from "@/features/app/constants/app-copy";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/lib/utils";

function getWizardSteps(activeIndex: number) {
  return APP_SHARED_COPY.wizardSteps.map((label, index) => ({
    label,
    active: index === activeIndex,
    completed: index < activeIndex,
  }));
}

type SetupLayoutProps = {
  activeStep: number;
  cardTitle: string;
  description: string;
  children: ReactNode;
  sidebar: ReactNode;
  backTo?: string;
  nextTo?: string;
  nextLabel?: string;
};

function SetupLayout({
  activeStep,
  cardTitle,
  description,
  children,
  sidebar,
  backTo,
  nextTo,
  nextLabel = "Tiếp tục",
}: SetupLayoutProps) {
  return (
    <div className="space-y-8">
      <AppPageHeader title={INPUT_STEP_1_COPY.setupTitle} description={description} />
      <WizardStepper steps={getWizardSteps(activeStep)} />
      <div className="grid gap-6 lg:grid-cols-3">
        <AppPanel title={cardTitle} className="lg:col-span-2">
          {children}
        </AppPanel>
        <div className="space-y-4">{sidebar}</div>
      </div>
      <div className="flex justify-between gap-4">
        {backTo ? (
          <Button variant="outline" asChild>
            <Link to={backTo}>Quay lại</Link>
          </Button>
        ) : (
          <span />
        )}
        {nextTo ? (
          <Button asChild className="font-bold">
            <Link to={nextTo}>{nextLabel}</Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export function DataInputStep1Page() {
  const copy = INPUT_STEP_1_COPY;
  return (
    <SetupLayout
      activeStep={0}
      cardTitle={copy.cardTitle}
      description={copy.description}
      nextTo={ROUTES.app.dataInputStep2}
      sidebar={
        <AppPanel title={copy.sidebarTitle}>
          <ul className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            {copy.sidebarTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </AppPanel>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {copy.fields.map((field) => (
          <div key={field.label} className="space-y-1.5">
            <Label>{field.label}</Label>
            <Input defaultValue={field.value} />
          </div>
        ))}
      </div>
    </SetupLayout>
  );
}

export function DataInputStep2Page() {
  const copy = INPUT_STEP_2_COPY;
  return (
    <SetupLayout
      activeStep={1}
      cardTitle={copy.cardTitle}
      description={copy.description}
      backTo={ROUTES.app.dataInputStep1}
      nextTo={ROUTES.app.dataInputStep3}
      sidebar={
        <AppPanel title={copy.sidebarTitle}>
          <p className="text-sm leading-relaxed text-muted-foreground">{copy.sidebarBody}</p>
          <p className="mt-4 text-sm font-semibold text-primary">
            Mức độ sẵn sàng: {copy.readiness}
          </p>
        </AppPanel>
      }
    >
      <div className="space-y-6">
        <div>
          <p className="mb-3 text-sm font-semibold">Loại ngành nghề</p>
          <div className="flex flex-wrap gap-2">
            {copy.industries.map((item) => (
              <span
                key={item}
                className={cn(
                  "rounded-lg border px-4 py-2 text-sm font-medium",
                  item === copy.selectedIndustry
                    ? "border-primary bg-secondary text-primary"
                    : "border-border text-muted-foreground",
                )}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold">Kỳ báo cáo</p>
          <div className="flex flex-wrap gap-2">
            {copy.periods.map((item) => (
              <span
                key={item}
                className={cn(
                  "rounded-lg border px-4 py-2 text-sm font-medium",
                  item === copy.selectedPeriod
                    ? "border-primary bg-secondary text-primary"
                    : "border-border text-muted-foreground",
                )}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label>Tháng bắt đầu</Label>
            <Input defaultValue={copy.dateRange.start} />
          </div>
          <div className="space-y-1.5">
            <Label>Tháng kết thúc</Label>
            <Input defaultValue={copy.dateRange.end} />
          </div>
          <div className="space-y-1.5">
            <Label>Năm</Label>
            <Input defaultValue={copy.dateRange.year} />
          </div>
        </div>
      </div>
    </SetupLayout>
  );
}

export function DataInputStep3Page() {
  const copy = INPUT_STEP_3_COPY;
  return (
    <SetupLayout
      activeStep={2}
      cardTitle={copy.cardTitle}
      description={copy.description}
      backTo={ROUTES.app.dataInputStep2}
      nextTo={ROUTES.app.dataInput}
      nextLabel={copy.continueCta}
      sidebar={
        <AppPanel title="Khuyến nghị cho Ngành F&B">
          <p className="mb-4 text-sm text-muted-foreground">
            Dựa trên hồ sơ ngành nghề, chúng tôi khuyến nghị bạn theo dõi các nguồn phát thải chính
            sau đây.
          </p>
          <ul className="space-y-2 text-sm font-medium text-secondary-foreground">
            {copy.recommended.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-primary" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </AppPanel>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {copy.sources.map((source) => (
          <div
            key={source.title}
            className="rounded-xl border border-border p-4 transition-colors hover:border-primary/40"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <h3 className="font-semibold text-secondary-foreground">{source.title}</h3>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-primary">
                {source.badge}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{source.desc}</p>
          </div>
        ))}
      </div>
    </SetupLayout>
  );
}
