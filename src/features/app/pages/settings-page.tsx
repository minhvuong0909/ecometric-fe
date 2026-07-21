import { useState } from "react";
import { toast } from "sonner";
import {
  User,
  Mail,
  Briefcase,
  Trash2,
  Plus,
  Key,
  HelpCircle,
  Award,
  Sparkles,
  Bell,
  Check,
  ShieldAlert,
  Globe,
  Loader2,
  Activity,
} from "lucide-react";
import { AppPageHeader } from "@/features/app/components/app-page-header";
import { AppPanel } from "@/features/app/components/app-panel";
import { SETTINGS_COPY } from "@/features/app/constants/app-copy";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/lib/utils";

type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Viewer";
  status: "Đang hoạt động" | "Chờ xác nhận";
};

export function SettingsPage() {
  const copy = SETTINGS_COPY;
  const [activeTab, setActiveTab] = useState(0);

  // States cho Tab 0: Tài khoản
  const [fullName, setFullName] = useState("Alex Morgan");
  const [workEmail, setWorkEmail] = useState("alex@company.com");
  const [jobTitle, setJobTitle] = useState("Trưởng phòng ESG");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // States cho Tab 1: Thành viên nhóm
  const [members, setMembers] = useState<TeamMember[]>([
    { id: "1", name: "Alex Morgan", email: "alex@company.com", role: "Admin", status: "Đang hoạt động" },
    { id: "2", name: "Sarah Connor", email: "sarah@company.com", role: "Editor", status: "Đang hoạt động" },
    { id: "3", name: "John Doe", email: "john@company.com", role: "Viewer", status: "Chờ xác nhận" },
  ]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"Admin" | "Editor" | "Viewer">("Editor");
  const [inviteName, setInviteName] = useState("");
  const [isInviting, setIsInviting] = useState(false);

  // States cho Tab 2: Thông báo
  const [notifThreshold, setNotifThreshold] = useState(true);
  const [notifReport, setNotifReport] = useState(true);
  const [notifAudit, setNotifAudit] = useState(false);
  const [notifReminder, setNotifReminder] = useState(true);

  // Handlers
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Cập nhật thông tin tài khoản thành công!");
  };

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
    toast.success("Đổi mật khẩu thành công!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteName) {
      toast.error("Vui lòng nhập đầy đủ Tên và Email để mời.");
      return;
    }
    setIsInviting(true);
    setTimeout(() => {
      const newMember: TeamMember = {
        id: Date.now().toString(),
        name: inviteName,
        email: inviteEmail,
        role: inviteRole,
        status: "Chờ xác nhận",
      };
      setMembers((prev) => [...prev, newMember]);
      toast.success(`Đã gửi thư mời tham gia không gian làm việc tới ${inviteEmail}!`);
      setInviteEmail("");
      setInviteName("");
      setInviteRole("Editor");
      setIsInviting(false);
    }, 800);
  };

  const handleDeleteMember = (id: string, email: string) => {
    if (email === "alex@company.com") {
      toast.error("Bạn không thể xóa chính mình khỏi không gian làm việc.");
      return;
    }
    if (window.confirm(`Bạn có chắc chắn muốn xóa thành viên ${email} khỏi không gian làm việc?`)) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
      toast.success("Đã xóa thành viên thành công.");
    }
  };

  const handleSaveNotifications = () => {
    toast.success("Đã lưu các cài đặt cấu hình thông báo!");
  };

  // Viết tắt avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-8">
      <AppPageHeader
        breadcrumbs={copy.breadcrumbs}
        title={copy.title}
        description={copy.description}
      />

      {/* Tabs phong cách tối giản (Vercel-style) */}
      <div className="flex border-b border-border gap-6">
        {copy.tabs.map((tab, index) => (
          <button
            key={tab}
            onClick={() => setActiveTab(index)}
            className={cn(
              "pb-3.5 text-sm font-semibold transition-all relative outline-none focus:outline-none",
              activeTab === index
                ? "text-primary font-bold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
            {activeTab === index && (
              <div className="absolute bottom-0 inset-x-0 h-[2.5px] bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Nội dung */}
      <div className="transition-all duration-300">
        {activeTab === 0 && (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Cột trái: Thông tin & Đổi mật khẩu */}
            <div className="space-y-6 lg:col-span-2">
              {/* Form Hồ sơ cá nhân */}
              <AppPanel title="Hồ sơ cá nhân">
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-center gap-5 pb-2">
                    <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-bold border border-primary/20">
                      {getInitials(fullName)}
                    </div>
                    <div className="space-y-1 text-center sm:text-left">
                      <Button type="button" variant="outline" size="sm" className="font-semibold">
                        Thay ảnh đại diện
                      </Button>
                      <p className="text-[11px] text-muted-foreground">Định dạng JPEG, PNG tối đa 2MB</p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold tracking-wide text-muted-foreground uppercase flex items-center gap-1.5">
                        <User className="size-3.5" />
                        Họ và tên
                      </Label>
                      <Input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="bg-background border-border"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold tracking-wide text-muted-foreground uppercase flex items-center gap-1.5">
                        <Mail className="size-3.5" />
                        Email công việc
                      </Label>
                      <Input
                        type="email"
                        value={workEmail}
                        onChange={(e) => setWorkEmail(e.target.value)}
                        className="bg-background border-border"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className="text-xs font-bold tracking-wide text-muted-foreground uppercase flex items-center gap-1.5">
                        <Briefcase className="size-3.5" />
                        Chức vụ
                      </Label>
                      <Input
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        className="bg-background border-border"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end border-t border-border pt-4">
                    <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/95 font-bold shadow-sm">
                      {copy.saveCta}
                    </Button>
                  </div>
                </form>
              </AppPanel>

              {/* Form Đổi mật khẩu */}
              <AppPanel title="Bảo mật & Đổi mật khẩu">
                <form onSubmit={handleChangePassword} className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold tracking-wide text-muted-foreground uppercase flex items-center gap-1.5">
                        <Key className="size-3.5" />
                        Mật khẩu hiện tại
                      </Label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="bg-background border-border"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold tracking-wide text-muted-foreground uppercase flex items-center gap-1.5">
                        <Key className="size-3.5" />
                        Mật khẩu mới
                      </Label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="bg-background border-border"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold tracking-wide text-muted-foreground uppercase flex items-center gap-1.5">
                        <Key className="size-3.5" />
                        Xác nhận mật khẩu mới
                      </Label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-background border-border"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end border-t border-border pt-4">
                    <Button type="submit" variant="outline" className="font-bold border-primary text-primary hover:bg-primary/5">
                      Cập nhật mật khẩu
                    </Button>
                  </div>
                </form>
              </AppPanel>
            </div>

            {/* Cột phải: Hiệu suất & Trạng thái hỗ trợ */}
            <div className="space-y-6">
              {/* Thẻ hiệu suất */}
              <AppPanel title="Không gian làm việc" interactive>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Award className="size-5 text-emerald-500 shrink-0" />
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Hiệu quả cao
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground/90 font-medium">
                    {copy.workspaceProgress}
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                      <span>Báo cáo GHG</span>
                      <span>84%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted border border-border/10">
                      <div className="h-full w-[84%] rounded-full bg-gradient-to-r from-emerald-400 to-teal-500" />
                    </div>
                  </div>
                </div>
              </AppPanel>

              {/* Thẻ hỗ trợ */}
              <AppPanel title="Dịch vụ hỗ trợ">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-5 text-indigo-500 shrink-0" />
                    <p className="font-bold text-secondary-foreground text-sm">{copy.supportPlan}</p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Đội ngũ cố vấn và kiểm toán carbon luôn trực tuyến hỗ trợ bạn. Thời gian phản hồi trung bình ít hơn 15 phút.
                  </p>
                  <Button variant="outline" size="sm" className="w-full font-bold border-indigo-200 text-indigo-600 hover:bg-indigo-50/50">
                    <HelpCircle className="size-4 mr-1.5" />
                    Yêu cầu hỗ trợ ngay
                  </Button>
                </div>
              </AppPanel>
            </div>
          </div>
        )}

        {/* Tab 1: Thành viên nhóm */}
        {activeTab === 1 && (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Cột trái: Danh sách thành viên */}
            <div className="lg:col-span-2">
              <AppPanel title="Thành viên không gian làm việc" bodyClassName="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[500px] text-left text-sm">
                    <thead className="border-b border-border bg-muted/50">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold tracking-wide text-muted-foreground uppercase">Họ tên & Email</th>
                        <th className="px-6 py-4 text-xs font-bold tracking-wide text-muted-foreground uppercase">Vai trò</th>
                        <th className="px-6 py-4 text-xs font-bold tracking-wide text-muted-foreground uppercase">Trạng thái</th>
                        <th className="px-6 py-4 text-right text-xs font-bold tracking-wide text-muted-foreground uppercase">Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((member) => (
                        <tr key={member.id} className="border-b border-border last:border-0 hover:bg-muted/10 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-semibold text-secondary-foreground">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.email}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={cn(
                                "rounded-full px-2.5 py-0.5 text-xs font-bold border",
                                member.role === "Admin"
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : member.role === "Editor"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-gray-50 text-gray-700 border-gray-200"
                              )}
                            >
                              {member.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={cn(
                                "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                                member.status === "Đang hoạt động"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                  : "bg-amber-50 text-amber-700 border border-amber-100"
                              )}
                            >
                              {member.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleDeleteMember(member.id, member.email)}
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
              </AppPanel>
            </div>

            {/* Cột phải: Form mời thành viên */}
            <div>
              <AppPanel title="Mời thành viên mới">
                <form onSubmit={handleInviteMember} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold tracking-wide text-muted-foreground uppercase">Họ và tên</Label>
                    <Input
                      placeholder="Nguyễn Văn A"
                      value={inviteName}
                      onChange={(e) => setInviteName(e.target.value)}
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold tracking-wide text-muted-foreground uppercase">Email liên hệ</Label>
                    <Input
                      type="email"
                      placeholder="user@company.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold tracking-wide text-muted-foreground uppercase">Quyền hạn</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["Admin", "Editor", "Viewer"] as const).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setInviteRole(r)}
                          className={cn(
                            "py-2 text-xs font-bold border rounded-lg transition-all",
                            inviteRole === r
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={isInviting}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/95 font-bold shadow-sm mt-2 flex items-center justify-center gap-1.5"
                  >
                    {isInviting ? (
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
          </div>
        )}

        {/* Tab 2: Thông báo */}
        {activeTab === 2 && (
          <div className="max-w-2xl">
            <AppPanel title="Cấu hình nhận thông báo">
              <div className="space-y-6">
                <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Email Alerts</p>
                
                <div className="space-y-4">
                  {/* Option 1 */}
                  <div
                    onClick={() => setNotifThreshold(!notifThreshold)}
                    className="flex items-start gap-4 p-3 rounded-lg border border-border/40 hover:border-primary/20 hover:bg-muted/5 transition-all cursor-pointer"
                  >
                    <div className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded border transition-colors mt-0.5",
                      notifThreshold ? "bg-primary border-primary text-primary-foreground" : "border-border bg-background"
                    )}>
                      {notifThreshold && <Check className="size-3.5 stroke-[3]" />}
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-secondary-foreground cursor-pointer flex items-center gap-1.5">
                        <ShieldAlert className="size-4 text-red-500" />
                        Cảnh báo vượt hạn mức phát thải
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        Gửi email khẩn cấp cho tôi khi lượng tiêu thụ năng lượng hoặc phát thải vượt ngưỡng mục tiêu đã cấu hình của cơ sở.
                      </p>
                    </div>
                  </div>

                  {/* Option 2 */}
                  <div
                    onClick={() => setNotifReminder(!notifReminder)}
                    className="flex items-start gap-4 p-3 rounded-lg border border-border/40 hover:border-primary/20 hover:bg-muted/5 transition-all cursor-pointer"
                  >
                    <div className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded border transition-colors mt-0.5",
                      notifReminder ? "bg-primary border-primary text-primary-foreground" : "border-border bg-background"
                    )}>
                      {notifReminder && <Check className="size-3.5 stroke-[3]" />}
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-secondary-foreground cursor-pointer flex items-center gap-1.5">
                        <Bell className="size-4 text-emerald-500" />
                        Nhắc nhở nhập số liệu hàng tháng
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        Gửi email thông báo nhắc việc định kỳ hàng tháng để đảm bảo tính liên tục của dữ liệu carbon.
                      </p>
                    </div>
                  </div>

                  {/* Option 3 */}
                  <div
                    onClick={() => setNotifReport(!notifReport)}
                    className="flex items-start gap-4 p-3 rounded-lg border border-border/40 hover:border-primary/20 hover:bg-muted/5 transition-all cursor-pointer"
                  >
                    <div className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded border transition-colors mt-0.5",
                      notifReport ? "bg-primary border-primary text-primary-foreground" : "border-border bg-background"
                    )}>
                      {notifReport && <Check className="size-3.5 stroke-[3]" />}
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-secondary-foreground cursor-pointer flex items-center gap-1.5">
                        <Globe className="size-4 text-blue-500" />
                        Báo cáo GHG hàng quý / năm mới sẵn sàng
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        Thông báo khi bản báo cáo ESG tóm tắt chính thức hoàn thành và sẵn sàng xuất bản hoặc chia sẻ.
                      </p>
                    </div>
                  </div>

                  {/* Option 4 */}
                  <div
                    onClick={() => setNotifAudit(!notifAudit)}
                    className="flex items-start gap-4 p-3 rounded-lg border border-border/40 hover:border-primary/20 hover:bg-muted/5 transition-all cursor-pointer"
                  >
                    <div className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded border transition-colors mt-0.5",
                      notifAudit ? "bg-primary border-primary text-primary-foreground" : "border-border bg-background"
                    )}>
                      {notifAudit && <Check className="size-3.5 stroke-[3]" />}
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-secondary-foreground cursor-pointer flex items-center gap-1.5">
                        <Activity className="size-4 text-indigo-500" />
                        Yêu cầu kiểm toán dữ liệu từ đối tác
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        Nhận cảnh báo khi có các yêu cầu xác thực hoặc audit dữ liệu phát thải Scope 3 từ chuỗi cung ứng.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end border-t border-border pt-4">
                  <Button onClick={handleSaveNotifications} className="bg-primary text-primary-foreground hover:bg-primary/95 font-bold shadow-sm">
                    Lưu cấu hình thông báo
                  </Button>
                </div>
              </div>
            </AppPanel>
          </div>
        )}
      </div>
    </div>
  );
}
