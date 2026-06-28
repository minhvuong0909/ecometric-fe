import { AppPageHeader } from "@/features/app/components/app-page-header";
import { AppPanel } from "@/features/app/components/app-panel";
import { COMPANY_COPY } from "@/features/app/constants/app-copy";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/lib/utils";

export function CompanyPage() {
  const copy = COMPANY_COPY;

  return (
    <div className="space-y-8">
      <AppPageHeader breadcrumbs={copy.breadcrumbs} title="Hồ sơ doanh nghiệp" />

      <div className="grid gap-6 lg:grid-cols-3">
        <AppPanel
          title={copy.generalInfo.title}
          className="lg:col-span-2"
          badge={
            <span className="text-xs font-bold tracking-wide text-primary uppercase">
              {copy.generalInfo.syncBadge}
            </span>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {copy.generalInfo.fields.map((field) => (
              <div key={field.label} className="space-y-1.5">
                <Label>{field.label}</Label>
                <Input defaultValue={field.value} readOnly className="bg-muted" />
              </div>
            ))}
          </div>
        </AppPanel>

        <AppPanel title={copy.integrity.title}>
          <p className="mb-4 text-sm font-bold text-primary">{copy.integrity.status}</p>
          <div className="space-y-4">
            {copy.integrity.checks.map((check) => (
              <div key={check.title} className="rounded-lg border border-border p-3">
                <p className="text-sm font-semibold">{check.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{check.note}</p>
              </div>
            ))}
          </div>
        </AppPanel>
      </div>

      <AppPanel title={copy.operational.title}>
        <div className="grid gap-4 sm:grid-cols-3">
          {copy.operational.fields.map((field) => (
            <div key={field.label} className="space-y-1.5">
              <Label>{field.label}</Label>
              <Input defaultValue={field.value} readOnly className="bg-muted" />
            </div>
          ))}
        </div>
      </AppPanel>

      <AppPanel title={copy.facilities.title} bodyClassName="overflow-x-auto p-0">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              {copy.facilities.columns.map((col) => (
                <th key={col} className="px-6 py-4 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {copy.facilities.rows.map((row) => (
              <tr key={row.name} className="border-b border-border last:border-0">
                <td className="px-6 py-4 font-medium">{row.name}</td>
                <td className="px-6 py-4 text-muted-foreground">{row.type}</td>
                <td className="px-6 py-4 text-muted-foreground">{row.location}</td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-semibold",
                      row.impact === "Cao"
                        ? "bg-red-100 text-red-800"
                        : "bg-emerald-100 text-emerald-800",
                    )}
                  >
                    {row.impact}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-t border-border p-4">
          <Button variant="outline" size="sm">
            Thêm khung báo cáo
          </Button>
        </div>
      </AppPanel>
    </div>
  );
}
