import { AppPageHeader } from "@/features/app/components/app-page-header";
import { AppPanel } from "@/features/app/components/app-panel";
import { SETTINGS_COPY } from "@/features/app/constants/app-copy";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

export function SettingsPage() {
  const copy = SETTINGS_COPY;

  return (
    <div className="space-y-8">
      <AppPageHeader
        breadcrumbs={copy.breadcrumbs}
        title={copy.title}
        description={copy.description}
      />

      <div className="flex flex-wrap gap-2 border-b border-border pb-4">
        {copy.tabs.map((tab, index) => (
          <Button
            key={tab}
            variant={index === 0 ? "default" : "ghost"}
            size="sm"
            className={index === 0 ? "font-bold" : undefined}
          >
            {tab}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <AppPanel title="Hồ sơ cá nhân" className="lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            {copy.profileFields.map((field) => (
              <div key={field.label} className="space-y-1.5">
                <Label>{field.label}</Label>
                <Input defaultValue={field.value} />
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="mt-6">
            Thay ảnh đại diện
          </Button>
        </AppPanel>

        <AppPanel title="Hiệu suất sử dụng không gian làm việc">
          <p className="text-sm leading-relaxed text-muted-foreground">{copy.workspaceProgress}</p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[84%] rounded-full bg-primary" />
          </div>
          <span className="mt-3 inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-bold text-primary">
            Không gian làm việc hiệu quả cao
          </span>
        </AppPanel>
      </div>

      <AppPanel title="Đổi mật khẩu">
        <div className="grid max-w-xl gap-4">
          {["Mật khẩu hiện tại", "Mật khẩu mới", "Xác nhận mật khẩu mới"].map((label) => (
            <div key={label} className="space-y-1.5">
              <Label>{label}</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
          ))}
        </div>
      </AppPanel>

      <AppPanel title="Trạng thái hỗ trợ">
        <p className="font-semibold text-secondary-foreground">{copy.supportPlan}</p>
        <p className="mt-2 text-sm text-muted-foreground">Phản hồi ưu tiên • Thời gian chờ trung bình: &lt; 15 phút</p>
        <Button variant="outline" size="sm" className="mt-4">
          Liên hệ quản lý
        </Button>
      </AppPanel>

      <div className="flex justify-end">
        <Button className="font-bold">{copy.saveCta}</Button>
      </div>
    </div>
  );
}
