import { DataEntryMethods } from "@/features/app/components/data-entry-methods";
import { FileCheck2, Send, Calculator, Info } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { AppPageHeader } from "@/features/app/components/app-page-header";
import { AppPanel } from "@/features/app/components/app-panel";
import { ActivityEntryForm } from "@/features/app/components/activity-entry-form";
import { useCreateActivityData } from "@/features/app/hooks/use-activity-data";
import { useBusinessStore } from "@/shared/stores/business-store";
import { ROUTES } from "@/shared/constants/routes";
export function DataInputPage() {
  const { activeBusinessId, activeBusiness } = useBusinessStore();
  const mutation = useCreateActivityData();
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <AppPageHeader
        title="Nhập dữ liệu hoạt động"
        description={`Ghi nhận lượng điện, nhiên liệu, nước, vận tải hoặc chất thải cho ${activeBusiness?.name ?? "doanh nghiệp"}.`}
      />
      <DataEntryMethods />
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <AppPanel
          title="Thông tin hoạt động"
          description="Ghi nhận lượng tiêu thụ thực tế trong kỳ báo cáo."
        >
          {activeBusinessId ? (
            <ActivityEntryForm
              key={activeBusinessId}
              businessId={activeBusinessId}
              disabled={mutation.isPending}
              onSave={async (input) => {
                await mutation.mutateAsync({ ...input, inputMethod: "MANUAL" });
                toast.success("Đã lưu bản nháp. Gửi duyệt để tính phát thải.");
                navigate(ROUTES.app.emissionDetail);
              }}
            />
          ) : (
            <p>Chọn doanh nghiệp trước khi nhập dữ liệu.</p>
          )}
        </AppPanel>
        <aside className="space-y-5 xl:sticky xl:top-24">
          <AppPanel title="Sau khi nhập dữ liệu">
            <ol className="space-y-6">
              {[
                {
                  icon: FileCheck2,
                  title: "Lưu bản nháp",
                  text: "Kiểm tra thông tin trước khi gửi cho quản lý.",
                },
                {
                  icon: Send,
                  title: "Gửi duyệt",
                  text: "Mở danh sách hoạt động và gửi bản ghi đã hoàn tất.",
                },
                {
                  icon: Calculator,
                  title: "Xác nhận & tính phát thải",
                  text: "Quản lý duyệt, hệ thống tính CO₂e và cập nhật tổng phát thải.",
                },
              ].map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </AppPanel>
          <div className="flex gap-3 rounded-xl border border-primary/15 bg-primary/5 p-5">
            <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
            <p className="text-sm leading-relaxed text-muted-foreground">
              Nhập kWh, lít, kg hoặc đơn vị của nguồn phát thải. Tổng tiền hóa
              đơn không thay thế lượng tiêu thụ.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
