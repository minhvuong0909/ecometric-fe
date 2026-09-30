import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Edit2,
  Save,
  X,
  Plus,
  Building2,
  FileText,
  MapPin,
  Globe,
  CheckCircle2,
  ShieldCheck,
  Award,
  Factory,
  Trash2,
  Loader2,
} from "lucide-react";
import { Link } from "react-router";
import { AppPageHeader } from "@/features/app/components/app-page-header";
import { AppPanel } from "@/features/app/components/app-panel";
import { COMPANY_COPY } from "@/features/app/constants/app-copy";
import { useBranches, useCreateBranch, useDeleteBranch } from "@/features/app/hooks/use-app-meta";
import { updateBusiness } from "@/features/businesses/api/businesses.api";
import { useBusinessStore } from "@/shared/stores/business-store";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { ROUTES } from "@/shared/constants/routes";
import { getApiErrorMessage } from "@/shared/lib/get-error-message";

const NOT_SET = "Chưa cập nhật";

function formatDate(value?: string | null): string {
  if (!value) return NOT_SET;
  return new Date(value).toLocaleDateString("vi-VN");
}

export function CompanyPage() {
  const copy = COMPANY_COPY;
  const activeBusiness = useBusinessStore((state) => state.activeBusiness);

  if (!activeBusiness) {
    return (
      <div className="space-y-8">
        <AppPageHeader breadcrumbs={copy.breadcrumbs} title="Hồ sơ doanh nghiệp & Cơ sở" />
        <AppPanel>
          <EmptyState
            icon={Building2}
            title={copy.noBusiness.title}
            description={copy.noBusiness.description}
            action={
              <Button asChild className="bg-primary text-primary-foreground font-bold">
                <Link to={ROUTES.app.onboarding}>{copy.noBusiness.cta}</Link>
              </Button>
            }
          />
        </AppPanel>
      </div>
    );
  }

  return <CompanyProfile />;
}

/** Tách riêng để TypeScript hẹp được `activeBusiness` thành non-null trong toàn bộ phần dưới. */
function CompanyProfile() {
  const copy = COMPANY_COPY;
  const { activeBusiness, setActiveBusiness } = useBusinessStore();
  const business = activeBusiness!;

  const { data: branchesData, isLoading: isLoadingBranches } = useBranches(business.id);
  const createBranchMutation = useCreateBranch(business.id);
  const deleteBranchMutation = useDeleteBranch(business.id);
  const branches = branchesData?.items ?? [];

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [companyName, setCompanyName] = useState(business.name);
  const [taxCode, setTaxCode] = useState(business.taxCode ?? "");
  const [industry, setIndustry] = useState(business.industry ?? "");
  const [website, setWebsite] = useState(business.website ?? "");
  const [country, setCountry] = useState(business.country);
  const [timezone, setTimezone] = useState(business.timezone);

  const [backupState, setBackupState] = useState<Record<string, string>>({});

  const [isAddingBranch, setIsAddingBranch] = useState(false);
  const [newBranchName, setNewBranchName] = useState("");
  const [newBranchAddress, setNewBranchAddress] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Đồng bộ lại form khi người dùng đổi doanh nghiệp đang làm việc (top bar).
  useEffect(() => {
    setCompanyName(business.name);
    setTaxCode(business.taxCode ?? "");
    setIndustry(business.industry ?? "");
    setWebsite(business.website ?? "");
    setCountry(business.country);
    setTimezone(business.timezone);
  }, [business]);

  const handleStartEdit = () => {
    setBackupState({ companyName, taxCode, industry, website, country, timezone });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (backupState.companyName !== undefined) {
      setCompanyName(backupState.companyName);
      setTaxCode(backupState.taxCode);
      setIndustry(backupState.industry);
      setWebsite(backupState.website);
      setCountry(backupState.country);
      setTimezone(backupState.timezone);
    }
    setIsEditing(false);
    toast.info("Đã hủy các thay đổi.");
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updated = await updateBusiness(business.id, {
        name: companyName,
        taxCode: taxCode || undefined,
        industry: industry || undefined,
        website: website || undefined,
        country,
        timezone,
      });
      setActiveBusiness(updated);
      toast.success("Cập nhật hồ sơ doanh nghiệp thành công!");
      setIsEditing(false);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddBranch = async () => {
    if (!newBranchName.trim()) {
      toast.error("Vui lòng nhập tên cơ sở.");
      return;
    }
    try {
      await createBranchMutation.mutateAsync({
        name: newBranchName.trim(),
        address: newBranchAddress.trim() || undefined,
      });
      toast.success("Đã thêm cơ sở vận hành mới!");
      setNewBranchName("");
      setNewBranchAddress("");
      setIsAddingBranch(false);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const handleDeleteBranch = async () => {
    if (!deleteTarget) return;
    try {
      await deleteBranchMutation.mutateAsync(deleteTarget.id);
      toast.success(`Đã xóa cơ sở ${deleteTarget.name}`);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setDeleteTarget(null);
    }
  };

  const tierLabel = business.subscriptionTier
    ? copy.subscription.tierLabels[business.subscriptionTier]
    : NOT_SET;
  const statusLabel = business.subscriptionStatus
    ? copy.subscription.statusLabels[business.subscriptionStatus]
    : NOT_SET;

  return (
    <div className="space-y-8">
      <AppPageHeader
        breadcrumbs={copy.breadcrumbs}
        title="Hồ sơ doanh nghiệp & Cơ sở"
        description="Quản lý thông tin pháp lý, ranh giới báo cáo tổ chức và danh mục các chi nhánh cơ sở vận hành."
        actions={
          isEditing ? (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCancelEdit} className="gap-1.5">
                <X className="size-4" />
                Hủy bỏ
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className="bg-primary text-primary-foreground hover:bg-primary/95 gap-1.5 font-bold shadow-md"
              >
                {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
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

      {/* Header Banner: Thẻ danh tính Doanh nghiệp */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xl">
              {companyName.slice(0, 2).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-foreground">{companyName}</h1>
                <Badge variant="success" className="gap-1 py-0.5">
                  <ShieldCheck className="size-3.5" />
                  Hồ sơ doanh nghiệp
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1">
                  <Building2 className="size-3.5 text-primary" />
                  MST: {taxCode || NOT_SET}
                </span>
                {website ? (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Globe className="size-3.5 text-primary" />
                      {website}
                    </span>
                  </>
                ) : null}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 border-t border-border pt-4 md:border-t-0 md:pt-0">
            <div className="rounded-lg bg-muted px-4 py-2.5 text-center min-w-[100px]">
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Chi nhánh</p>
              <p className="text-lg font-bold text-foreground">{branches.length} cơ sở</p>
            </div>
            <div className="rounded-lg bg-muted px-4 py-2.5 text-center min-w-[100px]">
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Gói dịch vụ</p>
              <p className="text-lg font-bold text-foreground flex items-center justify-center gap-1">
                <Award className="size-4 text-primary" />
                {tierLabel}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid 2 Cột: Thông tin Chung & Gói dịch vụ */}
      <div className="grid gap-6 lg:grid-cols-3">
        <AppPanel title={copy.generalInfo.title} className="lg:col-span-2 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase flex items-center gap-1">
                <Building2 className="size-3.5 text-primary" />
                Tên công ty đăng ký
              </Label>
              {isEditing ? (
                <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
              ) : (
                <div className="rounded-lg border border-border/40 bg-muted/20 px-3.5 py-2.5 font-semibold text-sm text-foreground">
                  {companyName}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase flex items-center gap-1">
                <FileText className="size-3.5 text-primary" />
                Mã số thuế (TIN)
              </Label>
              {isEditing ? (
                <Input value={taxCode} onChange={(e) => setTaxCode(e.target.value)} />
              ) : (
                <div className="rounded-lg border border-border/40 bg-muted/20 px-3.5 py-2.5 font-semibold text-sm text-foreground">
                  {taxCode || NOT_SET}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase flex items-center gap-1">
                <Globe className="size-3.5 text-primary" />
                Website
              </Label>
              {isEditing ? (
                <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://…" />
              ) : (
                <div className="rounded-lg border border-border/40 bg-muted/20 px-3.5 py-2.5 font-semibold text-sm text-foreground">
                  {website || NOT_SET}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase flex items-center gap-1">
                <Factory className="size-3.5 text-primary" />
                Ngành kinh doanh chính
              </Label>
              {isEditing ? (
                <Input value={industry} onChange={(e) => setIndustry(e.target.value)} />
              ) : (
                <div className="rounded-lg border border-border/40 bg-muted/20 px-3.5 py-2.5 font-semibold text-sm text-foreground">
                  {industry || NOT_SET}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase flex items-center gap-1">
                <MapPin className="size-3.5 text-primary" />
                Quốc gia (mã 2 ký tự)
              </Label>
              {isEditing ? (
                <Input value={country} onChange={(e) => setCountry(e.target.value.toUpperCase())} maxLength={2} />
              ) : (
                <div className="rounded-lg border border-border/40 bg-muted/20 px-3.5 py-2.5 font-semibold text-sm text-foreground">
                  {country}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase flex items-center gap-1">
                Múi giờ
              </Label>
              {isEditing ? (
                <Input value={timezone} onChange={(e) => setTimezone(e.target.value)} />
              ) : (
                <div className="rounded-lg border border-border/40 bg-muted/20 px-3.5 py-2.5 font-semibold text-sm text-foreground">
                  {timezone}
                </div>
              )}
            </div>
          </div>
        </AppPanel>

        <AppPanel title={copy.subscription.title} className="space-y-4">
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-400">
              Trạng thái
            </p>
            <p className="mt-1 text-lg font-bold text-emerald-700 dark:text-emerald-400">{statusLabel}</p>
            {business.subscriptionStatus === "TRIALING" && business.trialEndsAt ? (
              <p className="mt-1 text-xs text-emerald-800/80 dark:text-emerald-400/70 leading-relaxed">
                {copy.subscription.trialEndsAt(formatDate(business.trialEndsAt))}
              </p>
            ) : null}
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/10 p-3">
            <CheckCircle2 className="size-4 shrink-0 text-primary mt-0.5" />
            <div>
              <p className="text-xs font-bold text-secondary-foreground">Gói: {tierLabel}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground leading-relaxed">
                Trạng thái doanh nghiệp: {business.status}
              </p>
            </div>
          </div>
        </AppPanel>
      </div>

      {/* Bảng Danh sách Các Cơ sở Vận hành (Facilities / Branches) */}
      <AppPanel
        title={copy.facilities.title}
        badge={<span className="text-xs font-bold text-muted-foreground">Tổng số: {branches.length} cơ sở</span>}
        bodyClassName="overflow-x-auto p-0"
      >
        {isLoadingBranches ? (
          <div className="p-6 text-sm text-muted-foreground">Đang tải danh sách cơ sở…</div>
        ) : branches.length === 0 && !isAddingBranch ? (
          <div className="p-6">
            <EmptyState icon={Building2} title={copy.facilities.empty} />
          </div>
        ) : (
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-6 py-3.5 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                  Tên cơ sở
                </th>
                <th className="px-6 py-3.5 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                  Địa chỉ
                </th>
                <th className="px-6 py-3.5 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                  Trạng thái
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-bold tracking-wide text-muted-foreground uppercase">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {branches.map((branch) => (
                <tr key={branch.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="size-4 text-primary shrink-0" />
                      <span className="font-bold text-foreground">{branch.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{branch.address || NOT_SET}</td>
                  <td className="px-6 py-4">
                    <Badge variant={branch.isActive ? "success" : "neutral"}>
                      {branch.isActive ? "Hoạt động" : "Ngừng hoạt động"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-muted-foreground hover:text-destructive"
                      title="Xóa cơ sở"
                      onClick={() => setDeleteTarget({ id: branch.id, name: branch.name })}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Form thêm cơ sở mới */}
        <div className="border-t border-border p-4 space-y-3">
          {isAddingBranch ? (
            <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
              <Input
                value={newBranchName}
                onChange={(e) => setNewBranchName(e.target.value)}
                placeholder="Tên cơ sở *"
                autoFocus
              />
              <Input
                value={newBranchAddress}
                onChange={(e) => setNewBranchAddress(e.target.value)}
                placeholder="Địa chỉ (tuỳ chọn)"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleAddBranch}
                  disabled={createBranchMutation.isPending}
                  className="font-bold"
                >
                  {createBranchMutation.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    "Lưu"
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsAddingBranch(false);
                    setNewBranchName("");
                    setNewBranchAddress("");
                  }}
                >
                  Hủy
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                onClick={() => setIsAddingBranch(true)}
                variant="outline"
                size="sm"
                className="gap-1.5 font-bold text-primary border-primary/30 hover:bg-primary/5"
              >
                <Plus className="size-4" />
                Thêm cơ sở / chi nhánh mới
              </Button>
              <span className="text-xs text-muted-foreground">
                Đang hiển thị {branches.length} cơ sở vận hành thuộc ranh giới báo cáo
              </span>
            </div>
          )}
        </div>
      </AppPanel>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Xác nhận xóa cơ sở"
        description={deleteTarget ? `Xóa cơ sở "${deleteTarget.name}"? Hành động này không thể hoàn tác.` : ""}
        confirmText="Xóa cơ sở"
        cancelText="Hủy"
        variant="destructive"
        isLoading={deleteBranchMutation.isPending}
        onConfirm={handleDeleteBranch}
      />
    </div>
  );
}
