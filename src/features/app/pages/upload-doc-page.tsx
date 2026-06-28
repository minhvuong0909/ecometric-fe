import { Link } from "react-router";
import { Upload } from "lucide-react";
import { AppPageHeader } from "@/features/app/components/app-page-header";
import { AppPanel } from "@/features/app/components/app-panel";
import { UPLOAD_DOC_COPY } from "@/features/app/constants/app-copy";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  "Chờ kiểm tra": "bg-amber-100 text-amber-800",
  "Đã trích xuất": "bg-emerald-100 text-emerald-800",
  "Cần xác nhận": "bg-blue-100 text-blue-800",
  Lỗi: "bg-red-100 text-red-800",
};

export function UploadDocPage() {
  const copy = UPLOAD_DOC_COPY;

  return (
    <div className="space-y-8">
      <AppPageHeader breadcrumbs={copy.breadcrumbs} title="Tải tài liệu" description={copy.description} />

      <div className="grid gap-6 lg:grid-cols-3">
        <AppPanel className="lg:col-span-2">
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/40 px-6 py-16 text-center">
            <Upload className="mb-4 size-10 text-primary" aria-hidden />
            <h2 className="text-lg font-semibold text-secondary-foreground">{copy.uploadTitle}</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">{copy.uploadHint}</p>
            <Button className="mt-6">Chọn tệp tin</Button>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold">Loại tài liệu</p>
            <div className="flex flex-wrap gap-2">
              {copy.docTypes.map((type) => (
                <Button key={type} variant="outline" size="sm">
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </AppPanel>

        <AppPanel title="AI đã sẵn sàng trích xuất">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Vui lòng kiểm tra lại dữ liệu trích xuất trước khi ghi vào sổ cái carbon.
          </p>
          <Button asChild className="mt-6 w-full font-bold">
            <Link to={ROUTES.app.aiReview}>{copy.extractCta}</Link>
          </Button>
        </AppPanel>
      </div>

      <AppPanel
        title={copy.tableTitle}
        description={copy.tableSubtitle}
        badge={
          <span className="rounded-md bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 uppercase">
            Cần kiểm tra
          </span>
        }
        bodyClassName="overflow-x-auto p-0"
      >
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              {copy.columns.map((col) => (
                <th key={col} className="px-6 py-4 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {copy.files.map((file) => (
              <tr key={file.name} className="border-b border-border last:border-0">
                <td className="px-6 py-4 font-medium">{file.name}</td>
                <td className="px-6 py-4 text-muted-foreground">{file.type}</td>
                <td className="px-6 py-4 text-muted-foreground">{file.date}</td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-semibold",
                      STATUS_STYLES[file.status],
                    )}
                  >
                    {file.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AppPanel>
    </div>
  );
}
