import { useState } from "react";
import { toast } from "sonner";
import {
  Edit2,
  Save,
  X,
  Plus,
  Building2,
  FileText,
  Mail,
  Phone,
  MapPin,
  Users,
  Globe,
  CheckCircle2,
  ShieldCheck,
  Award,
  Factory,
  Pencil,
  Trash2,
} from "lucide-react";
import { AppPageHeader } from "@/features/app/components/app-page-header";
import { AppPanel } from "@/features/app/components/app-panel";
import { COMPANY_COPY } from "@/features/app/constants/app-copy";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/lib/utils";

type FacilityItem = {
  id: string;
  name: string;
  type: string;
  location: string;
  status: "Hoạt động" | "Bảo trì";
  impact: "Cao" | "Trung bình" | "Thấp";
  emissionShare: string;
};

const INITIAL_FACILITIES: FacilityItem[] = [
  {
    id: "1",
    name: "Nhà máy Chế biến Trung tâm",
    type: "Sản xuất & Chế biến",
    location: "Quận 1, TP. Hồ Chí Minh",
    status: "Hoạt động",
    impact: "Cao",
    emissionShare: "62%",
  },
  {
    id: "2",
    name: "Trung tâm Phân phối Logistics",
    type: "Kho vận & Phân phối",
    location: "KCN Sóng Thần, Bình Dương",
    status: "Hoạt động",
    impact: "Trung bình",
    emissionShare: "28%",
  },
  {
    id: "3",
    name: "Văn phòng Điều hành miền Bắc",
    type: "Văn phòng",
    location: "Quận Cầu Giấy, Hà Nội",
    status: "Hoạt động",
    impact: "Thấp",
    emissionShare: "10%",
  },
];

export function CompanyPage() {
  const copy = COMPANY_COPY;
  const [isEditing, setIsEditing] = useState(false);
  const [facilities, setFacilities] = useState<FacilityItem[]>(INITIAL_FACILITIES);

  // Form states cho thông tin chung
  const [companyName, setCompanyName] = useState("Northstar Foods Co., Ltd");
  const [taxCode, setTaxCode] = useState("0123456789");
  const [email, setEmail] = useState("contact@northstarfoods.com");
  const [phone, setPhone] = useState("+84 28 1234 5678");
  const [address, setAddress] = useState("Tầng 12, Tòa nhà Bitexco, Quận 1, TP. HCM");
  const [website, setWebsite] = useState("https://northstarfoods.com");

  // Form states cho thông tin vận hành
  const [industry, setIndustry] = useState("Vận tải & Chế biến Thực phẩm");
  const [employees, setEmployees] = useState("145 nhân viên");
  const [frameworks, setFrameworks] = useState("GHG Protocol, CSRD, ISO 14064");
  const [reportingPeriod, setReportingPeriod] = useState("Hàng tháng (Tháng 1 - Tháng 12)");

  // State tạm thời khi hủy sửa
  const [backupState, setBackupState] = useState<Record<string, string>>({});

  const handleStartEdit = () => {
    setBackupState({
      companyName,
      taxCode,
      email,
      phone,
      address,
      website,
      industry,
      employees,
      frameworks,
      reportingPeriod,
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (backupState.companyName) {
      setCompanyName(backupState.companyName);
      setTaxCode(backupState.taxCode);
      setEmail(backupState.email);
      setPhone(backupState.phone);
      setAddress(backupState.address);
      setWebsite(backupState.website);
      setIndustry(backupState.industry);
      setEmployees(backupState.employees);
      setFrameworks(backupState.frameworks);
      setReportingPeriod(backupState.reportingPeriod);
    }
    setIsEditing(false);
    toast.info("Đã hủy các thay đổi.");
  };

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Cập nhật hồ sơ doanh nghiệp thành công!");
  };

  const handleAddFacility = () => {
    const newFacility: FacilityItem = {
      id: Date.now().toString(),
      name: "Chi nhánh Mới",
      type: "Văn phòng / Kho",
      location: "Đà Nẵng",
      status: "Hoạt động",
      impact: "Thấp",
      emissionShare: "5%",
    };
    setFacilities((prev) => [...prev, newFacility]);
    toast.success("Đã thêm cơ sở vận hành mới!");
  };

  const handleDeleteFacility = (id: string, name: string) => {
    setFacilities((prev) => prev.filter((f) => f.id !== id));
    toast.success(`Đã xóa cơ sở ${name}`);
  };

  return (
    <div className="space-y-8">
      <AppPageHeader
        breadcrumbs={copy.breadcrumbs}
        title="Hồ sơ doanh nghiệp & Cơ sở"
        description="Quản lý thông tin pháp lý, ranh giới báo cáo tổ chức và danh mục các chi nhánh cơ sở vận hành."
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
                Hủy bỏ
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                className="bg-primary text-primary-foreground hover:bg-primary/95 gap-1.5 font-bold shadow-md"
              >
                <Save className="size-4" />
                Lưu thay đổi
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleStartEdit}
              className="bg-accent text-accent-foreground hover:bg-accent/90 gap-1.5 font-bold shadow-sm"
            >
              <Edit2 className="size-4" />
              Chỉnh sửa hồ sơ
            </Button>
          )
        }
      />

      {/* Header Banner: Thẻ danh tính Doanh nghiệp cao cấp */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-secondary-foreground via-slate-900 to-slate-950 p-6 text-white shadow-md">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground font-black text-2xl shadow-lg border-2 border-white/20">
              NF
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-white">{companyName}</h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="size-3.5" />
                  Đã xác thực ESG
                </span>
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1">
                  <Building2 className="size-3.5 text-accent" />
                  MST: {taxCode}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5 text-accent" />
                  Quận 1, TP. HCM
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Globe className="size-3.5 text-accent" />
                  {website}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 border-t border-white/10 pt-4 md:border-t-0 md:pt-0">
            <div className="rounded-xl bg-white/5 px-4 py-2.5 text-center border border-white/10 min-w-[100px]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Chi nhánh</p>
              <p className="text-lg font-bold text-accent">{facilities.length} cơ sở</p>
            </div>
            <div className="rounded-xl bg-white/5 px-4 py-2.5 text-center border border-white/10 min-w-[100px]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Xếp loại ESG</p>
              <p className="text-lg font-bold text-emerald-400 flex items-center justify-center gap-1">
                <Award className="size-4" />
                Hạng A+
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid 2 Cột: Thông tin Chung & Độ tin cậy Kiểm kê */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Cột Trái (2 phần): Thông tin pháp lý & Liên hệ */}
        <AppPanel
          title={copy.generalInfo.title}
          className="lg:col-span-2 space-y-6"
          badge={
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-500/20">
              <CheckCircle2 className="size-3.5" />
              Đồng bộ dữ liệu sổ cái
            </span>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Tên công ty */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-1">
                <Building2 className="size-3.5 text-primary" />
                Tên công ty đăng ký
              </Label>
              {isEditing ? (
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="bg-background border-border"
                />
              ) : (
                <div className="rounded-lg border border-border/40 bg-muted/20 px-3.5 py-2.5 font-semibold text-sm text-foreground">
                  {companyName}
                </div>
              )}
            </div>

            {/* Mã số thuế */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-1">
                <FileText className="size-3.5 text-primary" />
                Mã số thuế (TIN)
              </Label>
              {isEditing ? (
                <Input
                  value={taxCode}
                  onChange={(e) => setTaxCode(e.target.value)}
                  className="bg-background border-border"
                />
              ) : (
                <div className="rounded-lg border border-border/40 bg-muted/20 px-3.5 py-2.5 font-semibold text-sm text-foreground">
                  {taxCode}
                </div>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-1">
                <Mail className="size-3.5 text-primary" />
                Email liên hệ chính thức
              </Label>
              {isEditing ? (
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background border-border"
                />
              ) : (
                <div className="rounded-lg border border-border/40 bg-muted/20 px-3.5 py-2.5 font-semibold text-sm text-foreground">
                  {email}
                </div>
              )}
            </div>

            {/* Số điện thoại */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-1">
                <Phone className="size-3.5 text-primary" />
                Số điện thoại
              </Label>
              {isEditing ? (
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-background border-border"
                />
              ) : (
                <div className="rounded-lg border border-border/40 bg-muted/20 px-3.5 py-2.5 font-semibold text-sm text-foreground">
                  {phone}
                </div>
              )}
            </div>

            {/* Địa chỉ trụ sở */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-1">
                <MapPin className="size-3.5 text-primary" />
                Địa chỉ trụ sở chính
              </Label>
              {isEditing ? (
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="bg-background border-border"
                />
              ) : (
                <div className="rounded-lg border border-border/40 bg-muted/20 px-3.5 py-2.5 font-semibold text-sm text-foreground">
                  {address}
                </div>
              )}
            </div>
          </div>
        </AppPanel>

        {/* Cột Phải: Thống kê Độ tin cậy & Tuân thủ ESG */}
        <AppPanel title="Độ tin cậy & Tuân thủ ESG" className="space-y-4">
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Trạng thái kiểm kê
            </p>
            <p className="mt-1 text-lg font-bold text-emerald-700">Đã xác minh đầy đủ</p>
            <p className="mt-1 text-xs text-emerald-800/80 leading-relaxed">
              Mọi ranh giới báo cáo tổ chức đã được thiết lập theo tiêu chuẩn GHG Protocol Corporate Standard.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {copy.integrity.checks.map((check) => (
              <div
                key={check.title}
                className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/10 p-3 hover:border-border transition-colors"
              >
                <CheckCircle2 className="size-4 shrink-0 text-emerald-600 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-secondary-foreground">{check.title}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground leading-relaxed">
                    {check.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </AppPanel>
      </div>

      {/* Thông tin Vận hành & Tiêu chuẩn Báo cáo */}
      <AppPanel title={copy.operational.title} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-1">
              <Factory className="size-3.5 text-primary" />
              Ngành kinh doanh chính
            </Label>
            {isEditing ? (
              <Input
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="bg-background border-border"
              />
            ) : (
              <div className="rounded-lg border border-border/40 bg-muted/20 px-3.5 py-2.5 font-semibold text-sm text-foreground">
                {industry}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-1">
              <Users className="size-3.5 text-primary" />
              Quy mô nhân sự (FTE)
            </Label>
            {isEditing ? (
              <Input
                value={employees}
                onChange={(e) => setEmployees(e.target.value)}
                className="bg-background border-border"
              />
            ) : (
              <div className="rounded-lg border border-border/40 bg-muted/20 px-3.5 py-2.5 font-semibold text-sm text-foreground">
                {employees}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-1">
              <Award className="size-3.5 text-primary" />
              Khung báo cáo áp dụng
            </Label>
            {isEditing ? (
              <Input
                value={frameworks}
                onChange={(e) => setFrameworks(e.target.value)}
                className="bg-background border-border"
              />
            ) : (
              <div className="rounded-lg border border-border/40 bg-muted/20 px-3.5 py-2.5 font-semibold text-sm text-foreground">
                {frameworks}
              </div>
            )}
          </div>
        </div>
      </AppPanel>

      {/* Bảng Danh sách Các Cơ sở Vận hành (Facilities / Branches) */}
      <AppPanel
        title={copy.facilities.title}
        badge={
          <span className="text-xs font-bold text-muted-foreground">
            Tổng số: {facilities.length} cơ sở
          </span>
        }
        bodyClassName="overflow-x-auto p-0"
      >
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-6 py-3.5 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                Tên cơ sở
              </th>
              <th className="px-6 py-3.5 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                Loại hình
              </th>
              <th className="px-6 py-3.5 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                Địa điểm
              </th>
              <th className="px-6 py-3.5 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                Tỷ trọng phát thải
              </th>
              <th className="px-6 py-3.5 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                Mức độ tác động
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-bold tracking-wide text-muted-foreground uppercase">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {facilities.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="size-4 text-primary shrink-0" />
                    <span className="font-bold text-foreground">{row.name}</span>
                  </div>
                </td>

                <td className="px-6 py-4 text-muted-foreground font-medium">
                  {row.type}
                </td>

                <td className="px-6 py-4 text-muted-foreground">
                  {row.location}
                </td>

                <td className="px-6 py-4 font-bold text-primary">
                  {row.emissionShare}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold border",
                      row.impact === "Cao"
                        ? "bg-red-500/10 text-red-700 border-red-500/20"
                        : row.impact === "Trung bình"
                          ? "bg-amber-500/10 text-amber-700 border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
                    )}
                  >
                    {row.impact}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      title="Sửa cơ sở"
                      onClick={() => toast.info(`Chỉnh sửa cơ sở ${row.name}`)}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-muted-foreground hover:text-destructive"
                      title="Xóa cơ sở"
                      onClick={() => handleDeleteFacility(row.id, row.name)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer bảng cơ sở */}
        <div className="border-t border-border p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            onClick={handleAddFacility}
            variant="outline"
            size="sm"
            className="gap-1.5 font-bold text-primary border-primary/30 hover:bg-primary/5"
          >
            <Plus className="size-4" />
            Thêm cơ sở / chi nhánh mới
          </Button>

          <span className="text-xs text-muted-foreground">
            Đang hiển thị {facilities.length} cơ sở vận hành thuộc ranh giới báo cáo
          </span>
        </div>
      </AppPanel>
    </div>
  );
}
