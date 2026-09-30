import { useEffect, useState } from "react";
import { useUser } from "@clerk/react";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  Trash2,
  Plus,
  Key,
  HelpCircle,
  Sparkles,
  Bell,
  Check,
  ShieldAlert,
  Globe,
  Loader2,
  Activity,
} from "lucide-react";
import { Link } from "react-router";
import { AppPageHeader } from "@/features/app/components/app-page-header";
import { AppPanel } from "@/features/app/components/app-panel";
import { SETTINGS_COPY } from "@/features/app/constants/app-copy";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { useChangePassword } from "@/features/auth/hooks/use-change-password";
import { useUpdateProfile } from "@/features/auth/hooks/use-update-profile";
import type { AuthUser } from "@/features/auth/types/auth.types";
import {
  MANAGEABLE_ROLE_OPTIONS,
  MEMBER_ROLE_LABELS,
  MEMBER_STATUS_LABELS,
} from "@/features/businesses/constants/businesses-copy";
import { useBusinessMembers } from "@/features/businesses/hooks/use-business-members";
import { useCreateInvitation } from "@/features/businesses/hooks/use-create-invitation";
import { useRemoveBusinessMember } from "@/features/businesses/hooks/use-remove-business-member";
import type { ManageableRole } from "@/features/businesses/types/businesses.types";
import { useBusinessStore } from "@/shared/stores/business-store";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { GoogleIcon } from "@/shared/components/google-icon";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { ROUTES } from "@/shared/constants/routes";
import { isAuthenticated } from "@/shared/lib/auth-storage";
import { getApiErrorMessage } from "@/shared/lib/get-error-message";
import { cn } from "@/shared/lib/utils";

type NotificationPrefs = {
  threshold: boolean;
  reminder: boolean;
  report: boolean;
  audit: boolean;
};

const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  threshold: true,
  reminder: true,
  report: true,
  audit: false,
};

const NOTIFICATION_PREFS_KEY = "ecometric.notificationPrefs";

/** Chỉ là tiện ích lưu trên trình duyệt hiện tại — backend chưa có API lưu cấu hình thông báo. */
function readNotificationPrefs(): NotificationPrefs {
  try {
    const raw = localStorage.getItem(NOTIFICATION_PREFS_KEY);
    if (!raw) return DEFAULT_NOTIFICATION_PREFS;
    return { ...DEFAULT_NOTIFICATION_PREFS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_NOTIFICATION_PREFS;
  }
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function SettingsPage() {
  const copy = SETTINGS_COPY;
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="space-y-8">
      <AppPageHeader breadcrumbs={copy.breadcrumbs} title={copy.title} description={copy.description} />

      <div className="flex border-b border-border gap-6">
        {copy.tabs.map((tab, index) => (
          <button
            key={tab}
            onClick={() => setActiveTab(index)}
            className={cn(
              "pb-3.5 text-sm font-semibold transition-all relative outline-none focus:outline-none",
              activeTab === index ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab}
            {activeTab === index && <div className="absolute bottom-0 inset-x-0 h-[2.5px] bg-primary rounded-full" />}
          </button>
        ))}
      </div>

      <div className="transition-all duration-300">
        {activeTab === 0 && <AccountTab />}
        {activeTab === 1 && <TeamTab />}
        {activeTab === 2 && <NotificationsTab />}
      </div>
    </div>
  );
}

function AccountTab() {
  const user = useAuthStore((state) => state.user);
  const { user: clerkUser, isSignedIn } = useUser();

  // Đăng nhập qua Google (Clerk) chưa từng gọi /auth/external/exchange nên
  // tài khoản này không có access token backend — không thể gọi updateProfile/
  // changePassword. Phân biệt rõ để không hiển thị form sẽ luôn báo lỗi 401.
  const isGoogleOnly = !isAuthenticated() && Boolean(isSignedIn);

  const displayName = isGoogleOnly
    ? clerkUser?.fullName || clerkUser?.firstName || "Người dùng"
    : user?.fullName || "Người dùng";
  const displayEmail = isGoogleOnly ? clerkUser?.primaryEmailAddress?.emailAddress ?? "" : user?.email ?? "";
  const avatarUrl = isGoogleOnly ? clerkUser?.imageUrl : undefined;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        {/* Thẻ định danh: ảnh/khởi tự + tên + email + nguồn đăng nhập */}
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              className="size-14 shrink-0 rounded-full border border-border object-cover"
            />
          ) : (
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-lg font-bold border border-primary/20">
              {getInitials(displayName)}
            </div>
          )}
          <div className="min-w-0 space-y-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-bold text-foreground truncate">{displayName}</p>
              {isGoogleOnly ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  <GoogleIcon className="size-3" />
                  Google
                </span>
              ) : null}
            </div>
            <p className="text-sm text-muted-foreground truncate">{displayEmail || "Chưa có email"}</p>
          </div>
        </div>

        {isGoogleOnly ? (
          <AppPanel>
            <div className="flex items-start gap-4">
              <GoogleIcon className="size-8 shrink-0" />
              <div className="space-y-3">
                <p className="font-bold text-foreground">Hồ sơ được quản lý bởi Google</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Bạn đang đăng nhập bằng tài khoản Google, nên EcoMetric không lưu mật khẩu riêng cho bạn. Để đổi
                  tên, ảnh đại diện hoặc mật khẩu, hãy quản lý trực tiếp trong tài khoản Google của bạn.
                </p>
                <Button asChild variant="outline" size="sm">
                  <a href="https://myaccount.google.com/" target="_blank" rel="noopener noreferrer">
                    Mở quản lý tài khoản Google
                  </a>
                </Button>
              </div>
            </div>
          </AppPanel>
        ) : (
          <AccountEditForm user={user} />
        )}
      </div>

      <div className="space-y-6">
        <AppPanel title="Dịch vụ hỗ trợ">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-indigo-500 shrink-0" />
              <p className="font-bold text-secondary-foreground text-sm">{SETTINGS_COPY.supportPlan}</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Đội ngũ cố vấn và kiểm toán carbon luôn trực tuyến hỗ trợ bạn.
            </p>
            <Button variant="outline" size="sm" className="w-full">
              <HelpCircle className="size-4 mr-1.5" />
              Yêu cầu hỗ trợ ngay
            </Button>
          </div>
        </AppPanel>
      </div>
    </div>
  );
}

function AccountEditForm({ user }: { user: AuthUser | null }) {
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");

  useEffect(() => {
    setFullName(user?.fullName ?? "");
    setPhone(user?.phone ?? "");
  }, [user]);

  const updateProfileMutation = useUpdateProfile();

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(
      { fullName, phone: phone || null },
      {
        onSuccess: () => toast.success("Cập nhật thông tin tài khoản thành công!"),
        onError: (err) => toast.error(getApiErrorMessage(err)),
      },
    );
  };

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const changePasswordMutation = useChangePassword();

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Vui lòng điền đầy đủ các trường mật khẩu.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Xác nhận mật khẩu mới không trùng khớp.");
      return;
    }
    changePasswordMutation.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          toast.success("Đổi mật khẩu thành công!");
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
        onError: (err) => toast.error(getApiErrorMessage(err)),
      },
    );
  };

  return (
    <div className="space-y-6">
      <AppPanel title="Hồ sơ cá nhân">
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <User className="size-3.5" />
                Họ và tên
              </Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Mail className="size-3.5" />
                Email đăng nhập
              </Label>
              <Input value={user?.email ?? ""} disabled title="Email đăng nhập không thể thay đổi" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Phone className="size-3.5" />
                Số điện thoại
              </Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="VD: 090 123 4567" />
            </div>
          </div>
          <div className="flex justify-end border-t border-border pt-4">
            <Button type="submit" disabled={updateProfileMutation.isPending}>
              {updateProfileMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : SETTINGS_COPY.saveCta}
            </Button>
          </div>
        </form>
      </AppPanel>

      <AppPanel title="Bảo mật & Đổi mật khẩu">
        <form onSubmit={handleChangePassword} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Key className="size-3.5" />
                Mật khẩu hiện tại
              </Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Key className="size-3.5" />
                Mật khẩu mới
              </Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Key className="size-3.5" />
                Xác nhận mật khẩu mới
              </Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end border-t border-border pt-4">
            <Button type="submit" variant="outline" disabled={changePasswordMutation.isPending}>
              {changePasswordMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : "Cập nhật mật khẩu"}
            </Button>
          </div>
        </form>
      </AppPanel>
    </div>
  );
}

function TeamTab() {
  const activeBusiness = useBusinessStore((state) => state.activeBusiness);

  if (!activeBusiness) {
    return (
      <AppPanel>
        <EmptyState
          title="Chưa có doanh nghiệp hoạt động"
          description={SETTINGS_COPY.noBusiness}
          action={
            <Button asChild className="bg-primary text-primary-foreground font-bold">
              <Link to={ROUTES.app.onboarding}>Chọn gói để bắt đầu</Link>
            </Button>
          }
        />
      </AppPanel>
    );
  }

  return <TeamTabContent businessId={activeBusiness.id} />;
}

function TeamTabContent({ businessId }: { businessId: string }) {
  const { data, isLoading } = useBusinessMembers(businessId, { limit: 50 });
  const members = data?.items ?? [];

  const createInvitationMutation = useCreateInvitation(businessId);
  const removeMemberMutation = useRemoveBusinessMember(businessId);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<ManageableRole>("VIEWER");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string } | null>(null);

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) {
      toast.error("Vui lòng nhập email để mời.");
      return;
    }
    createInvitationMutation.mutate(
      { email: inviteEmail, role: inviteRole },
      {
        onSuccess: () => {
          toast.success(`Đã gửi thư mời tham gia không gian làm việc tới ${inviteEmail}!`);
          setInviteEmail("");
          setInviteRole("VIEWER");
        },
        onError: (err) => toast.error(getApiErrorMessage(err)),
      },
    );
  };

  const handleDeleteMember = () => {
    if (!deleteTarget) return;
    removeMemberMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success("Đã gỡ thành viên khỏi doanh nghiệp.");
        setDeleteTarget(null);
      },
      onError: (err) => {
        toast.error(getApiErrorMessage(err));
        setDeleteTarget(null);
      },
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <AppPanel
          title="Thành viên doanh nghiệp"
          bodyClassName="p-0 overflow-hidden"
          badge={
            <Button asChild variant="ghost" size="sm" className="text-xs font-semibold text-primary">
              <Link to={ROUTES.app.businessInvitations(businessId)}>Xem lời mời đang chờ</Link>
            </Button>
          }
        >
          {isLoading ? (
            <div className="p-6 text-sm text-muted-foreground">Đang tải danh sách thành viên…</div>
          ) : members.length === 0 ? (
            <div className="p-6">
              <EmptyState title="Chưa có thành viên nào." />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] text-left text-sm">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-medium text-muted-foreground">Họ tên & Email</th>
                    <th className="px-6 py-4 text-xs font-medium text-muted-foreground">Vai trò</th>
                    <th className="px-6 py-4 text-xs font-medium text-muted-foreground">Trạng thái</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-muted-foreground">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => (
                    <tr key={member.id} className="border-b border-border last:border-0 hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-secondary-foreground">
                          {member.user.fullName || "Chưa đặt tên"}
                        </p>
                        <p className="text-xs text-muted-foreground">{member.user.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="primary">{MEMBER_ROLE_LABELS[member.role]}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={member.status === "ACTIVE" ? "success" : "neutral"}>
                          {MEMBER_STATUS_LABELS[member.status]}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() =>
                            setDeleteTarget({ id: member.id, label: member.user.email })
                          }
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </AppPanel>
      </div>

      <div>
        <AppPanel title="Mời thành viên mới">
          <form onSubmit={handleInviteMember} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Email liên hệ</Label>
              <Input
                type="email"
                placeholder="user@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Quyền hạn</Label>
              <div className="grid grid-cols-2 gap-2">
                {MANAGEABLE_ROLE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setInviteRole(option.value)}
                    className={cn(
                      "py-2 text-xs font-medium border rounded-lg transition-colors",
                      inviteRole === option.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <Button type="submit" disabled={createInvitationMutation.isPending} className="w-full gap-1.5 mt-2">
              {createInvitationMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Đang mời...
                </>
              ) : (
                <>
                  <Plus className="size-4" />
                  Gửi thư mời
                </>
              )}
            </Button>
          </form>
        </AppPanel>
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Xác nhận gỡ thành viên"
        description={
          deleteTarget
            ? `Bạn có chắc chắn muốn gỡ thành viên ${deleteTarget.label} khỏi doanh nghiệp?`
            : ""
        }
        confirmText="Gỡ thành viên"
        cancelText="Hủy"
        variant="destructive"
        isLoading={removeMemberMutation.isPending}
        onConfirm={handleDeleteMember}
      />
    </div>
  );
}

function NotificationsTab() {
  const [prefs, setPrefs] = useState<NotificationPrefs>(readNotificationPrefs);

  const toggle = (key: keyof NotificationPrefs) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    try {
      localStorage.setItem(NOTIFICATION_PREFS_KEY, JSON.stringify(prefs));
    } catch {
      // localStorage có thể bị chặn (chế độ ẩn danh…) — vẫn báo lưu tạm cho phiên hiện tại.
    }
    toast.success(SETTINGS_COPY.notificationsSaved);
  };

  const OPTIONS: {
    key: keyof NotificationPrefs;
    icon: typeof ShieldAlert;
    iconClassName: string;
    title: string;
    description: string;
  }[] = [
    {
      key: "threshold",
      icon: ShieldAlert,
      iconClassName: "text-red-500",
      title: "Cảnh báo vượt hạn mức phát thải",
      description:
        "Gửi email khẩn cấp cho tôi khi lượng tiêu thụ năng lượng hoặc phát thải vượt ngưỡng mục tiêu đã cấu hình của cơ sở.",
    },
    {
      key: "reminder",
      icon: Bell,
      iconClassName: "text-emerald-500",
      title: "Nhắc nhở nhập số liệu hàng tháng",
      description: "Gửi email thông báo nhắc việc định kỳ hàng tháng để đảm bảo tính liên tục của dữ liệu carbon.",
    },
    {
      key: "report",
      icon: Globe,
      iconClassName: "text-blue-500",
      title: "Báo cáo GHG hàng quý / năm mới sẵn sàng",
      description: "Thông báo khi bản báo cáo ESG tóm tắt chính thức hoàn thành và sẵn sàng xuất bản hoặc chia sẻ.",
    },
    {
      key: "audit",
      icon: Activity,
      iconClassName: "text-indigo-500",
      title: "Yêu cầu kiểm toán dữ liệu từ đối tác",
      description: "Nhận cảnh báo khi có các yêu cầu xác thực hoặc audit dữ liệu phát thải Scope 3 từ chuỗi cung ứng.",
    },
  ];

  return (
    <div className="max-w-2xl">
      <AppPanel title="Cấu hình nhận thông báo">
        <div className="space-y-6">
          <p className="text-xs font-medium tracking-wide text-muted-foreground">
            Lưu trên trình duyệt này — chưa đồng bộ giữa các thiết bị.
          </p>

          <div className="space-y-4">
            {OPTIONS.map(({ key, icon: Icon, iconClassName, title, description }) => (
              <div
                key={key}
                onClick={() => toggle(key)}
                className="flex items-start gap-4 p-3 rounded-lg border border-border/40 hover:border-primary/20 hover:bg-muted/5 transition-all cursor-pointer"
              >
                <div
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded border transition-colors mt-0.5",
                    prefs[key] ? "bg-primary border-primary text-primary-foreground" : "border-border bg-background",
                  )}
                >
                  {prefs[key] && <Check className="size-3.5 stroke-[3]" />}
                </div>
                <div>
                  <Label className="text-sm font-semibold text-secondary-foreground cursor-pointer flex items-center gap-1.5">
                    <Icon className={cn("size-4", iconClassName)} />
                    {title}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end border-t border-border pt-4">
            <Button onClick={handleSave}>Lưu cấu hình thông báo</Button>
          </div>
        </div>
      </AppPanel>
    </div>
  );
}
