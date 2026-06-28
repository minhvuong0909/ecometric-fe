import { AppPageHeader } from "@/features/app/components/app-page-header";
import { AppPanel } from "@/features/app/components/app-panel";
import { REPORTS_COPY } from "@/features/app/constants/app-copy";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  "Sẵn sàng": "bg-emerald-100 text-emerald-800",
  "Đã xuất": "bg-blue-100 text-blue-800",
  "Bản nháp": "bg-muted text-muted-foreground",
};

export function ReportsPage() {
  const copy = REPORTS_COPY;

  return (
    <div className="space-y-8">
      <AppPageHeader
        breadcrumbs={copy.breadcrumbs}
        title={copy.title}
        description={copy.description}
        actions={<Button className="font-bold">Khởi tạo báo cáo</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {copy.reportTypes.map((type) => (
          <AppPanel key={type.title} title={type.title} bodyClassName="flex flex-col justify-between gap-4">
            <p className="text-sm text-muted-foreground">{type.desc}</p>
            <Button variant="outline" size="sm" className="w-full">
              Khởi tạo
            </Button>
          </AppPanel>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <AppPanel
          title="Báo cáo gần đây"
          className="lg:col-span-2"
          bodyClassName="overflow-x-auto p-0"
        >
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                {copy.tableColumns.map((col) => (
                  <th key={col} className="px-6 py-4 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                    {col}
                  </th>
                ))}
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody>
              {copy.reports.map((report) => (
                <tr key={report.name} className="border-b border-border last:border-0">
                  <td className="px-6 py-4 font-medium">{report.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{report.period}</td>
                  <td className="px-6 py-4 text-muted-foreground">{report.date}</td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-semibold",
                        STATUS_STYLES[report.status],
                      )}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm">
                      Xuất tệp
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AppPanel>

        <AppPanel title="Xem trước báo cáo">
          <ul className="space-y-3 text-sm text-muted-foreground">
            {copy.previewSections.map((section) => (
              <li key={section} className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-primary" aria-hidden />
                {section}
              </li>
            ))}
          </ul>
          <Button className="mt-6 w-full" variant="outline">
            Xuất báo cáo PDF
          </Button>
        </AppPanel>
      </div>
    </div>
  );
}
