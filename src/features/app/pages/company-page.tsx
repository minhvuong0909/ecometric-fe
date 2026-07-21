import { useState } from "react";
import { toast } from "sonner";
import { Edit2, Save, X, Plus } from "lucide-react";
import { AppPageHeader } from "@/features/app/components/app-page-header";
import { AppPanel } from "@/features/app/components/app-panel";
import { COMPANY_COPY } from "@/features/app/constants/app-copy";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/lib/utils";

export function CompanyPage() {
  const copy = COMPANY_COPY;
  const [isEditing, setIsEditing] = useState(false);

  // Lưu trữ dữ liệu hồ sơ vào state cục bộ để hỗ trợ chỉnh sửa
  const [generalFields, setGeneralFields] = useState([
    { key: "companyName", label: "Tên công ty", value: "Northstar Foods" },
    { key: "taxCode", label: "Mã số thuế (TIN)", value: "0123456789" },
    { key: "email", label: "Địa chỉ email chính thức", value: "contact@northstarfoods.com" },
    { key: "phone", label: "Số điện thoại", value: "+84 28 1234 5678" },
    { key: "address", label: "Địa chỉ trụ sở chính", value: "Quận 1, TP. Hồ Chí Minh" },
  ]);

  const [operationalFields, setOperationalFields] = useState([
    { key: "industry", label: "Ngành kinh doanh chính", value: "Vận tải & Logistics" },
    { key: "employees", label: "Số lượng nhân viên (FTE)", value: "145" },
    { key: "frameworks", label: "Các khung báo cáo phát triển bền vững", value: "GHG Protocol, CSRD" },
  ]);

  // Tạo bản sao lưu tạm thời để hủy bỏ khi cần
  const [tempGeneral, setTempGeneral] = useState([...generalFields]);
  const [tempOperational, setTempOperational] = useState([...operationalFields]);

  const handleStartEdit = () => {
    setTempGeneral([...generalFields]);
    setTempOperational([...operationalFields]);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setGeneralFields([...tempGeneral]);
    setOperationalFields([...tempOperational]);
    setIsEditing(false);
    toast.info("Đã hủy bỏ các thay đổi.");
  };

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Cập nhật hồ sơ doanh nghiệp thành công!");
  };

  const handleGeneralChange = (key: string, value: string) => {
    setGeneralFields((prev) =>
      prev.map((f) => (f.key === key ? { ...f, value } : f))
    );
  };

  const handleOperationalChange = (key: string, value: string) => {
    setOperationalFields((prev) =>
      prev.map((f) => (f.key === key ? { ...f, value } : f))
    );
  };

  return (
    <div className="space-y-8">
      <AppPageHeader
        breadcrumbs={copy.breadcrumbs}
        title="Hồ sơ doanh nghiệp"
        actions={
          isEditing ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelEdit}
                className="gap-1.5"
              >
                <X className="size-4" />
                Hủy
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                className="bg-primary text-primary-foreground hover:bg-primary/95 gap-1.5"
              >
                <Save className="size-4" />
                Lưu thay đổi
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleStartEdit}
              className="bg-accent text-accent-foreground hover:bg-accent/90 gap-1.5 font-semibold"
            >
              <Edit2 className="size-4" />
              Chỉnh sửa hồ sơ
            </Button>
          )
        }
      />

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
            {generalFields.map((field) => (
              <div key={field.key} className="space-y-1.5">
                {isEditing ? (
                  <>
                    <Label className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
                      {field.label}
                    </Label>
                    <Input
                      value={field.value}
                      onChange={(e) => handleGeneralChange(field.key, e.target.value)}
                      className="bg-background border-border focus:border-primary/50 transition-colors"
                    />
                  </>
                ) : (
                  <div className="space-y-1 rounded-lg border border-border/30 bg-muted/10 px-3.5 py-2.5 transition-all hover:bg-muted/15">
                    <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                      {field.label}
                    </p>
                    <p className="text-sm font-semibold text-secondary-foreground">
                      {field.value || "—"}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </AppPanel>

        <AppPanel title={copy.integrity.title}>
          <p className="mb-4 text-sm font-bold text-primary">{copy.integrity.status}</p>
          <div className="space-y-4">
            {copy.integrity.checks.map((check) => (
              <div key={check.title} className="rounded-lg border border-border/60 bg-muted/5 p-3 hover:border-border transition-colors">
                <p className="text-sm font-semibold text-secondary-foreground">{check.title}</p>
                <p className="mt-1 text-xs text-muted-foreground/80 leading-relaxed">{check.note}</p>
              </div>
            ))}
          </div>
        </AppPanel>
      </div>

      <AppPanel title={copy.operational.title}>
        <div className="grid gap-4 sm:grid-cols-3">
          {operationalFields.map((field) => (
            <div key={field.key} className="space-y-1.5">
              {isEditing ? (
                <>
                  <Label className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
                    {field.label}
                  </Label>
                  <Input
                    value={field.value}
                    onChange={(e) => handleOperationalChange(field.key, e.target.value)}
                    className="bg-background border-border focus:border-primary/50 transition-colors"
                  />
                </>
              ) : (
                <div className="space-y-1 rounded-lg border border-border/30 bg-muted/10 px-3.5 py-2.5 transition-all hover:bg-muted/15">
                  <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                    {field.label}
                  </p>
                  <p className="text-sm font-semibold text-secondary-foreground">
                    {field.value || "—"}
                  </p>
                </div>
              )}
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
              <tr key={row.name} className="border-b border-border last:border-0 hover:bg-muted/10 transition-colors">
                <td className="px-6 py-4 font-semibold text-secondary-foreground">{row.name}</td>
                <td className="px-6 py-4 text-muted-foreground">{row.type}</td>
                <td className="px-6 py-4 text-muted-foreground">{row.location}</td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-bold transition-all",
                      row.impact === "Cao"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200",
                    )}
                  >
                    {row.impact}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-t border-border p-4 flex items-center justify-between">
          <Button variant="outline" size="sm" className="gap-1 font-semibold">
            <Plus className="size-4" />
            Thêm cơ sở mới
          </Button>
          <span className="text-xs text-muted-foreground">Đang hiển thị 2 cơ sở vận hành chính</span>
        </div>
      </AppPanel>
    </div>
  );
}
