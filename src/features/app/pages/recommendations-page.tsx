import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppPageHeader } from "@/features/app/components/app-page-header";
import { AppPanel } from "@/features/app/components/app-panel";
import {
  useRecommendations,
  useGenerateRecommendations,
  useUpdateRecommendationStatus,
} from "@/features/app/hooks/use-recommendations";
import { useReportingPeriods } from "@/features/app/hooks/use-app-meta";
import { useBusinessRole } from "@/features/businesses/hooks/use-business-role";
import { useBusinessStore } from "@/shared/stores/business-store";
import { Button } from "@/shared/components/ui/button";
import type { RecommendationStatus } from "@/features/app/types/app.types";
const statusLabels: Record<RecommendationStatus, string> = {
  OPEN: "Chưa thực hiện",
  IN_PROGRESS: "Đang thực hiện",
  COMPLETED: "Hoàn thành",
  DISMISSED: "Bỏ qua",
};
export function RecommendationsPage() {
  const { activeBusinessId } = useBusinessStore();
  const { role } = useBusinessRole(activeBusinessId ?? "");
  const canManage =
    role === "COMPANY_ADMIN" ||
    role === "SYSTEM_ADMIN" ||
    role === "BRANCH_MANAGER";
  const periods = useReportingPeriods(activeBusinessId);
  const rec = useRecommendations(activeBusinessId);
  const generate = useGenerateRecommendations();
  const update = useUpdateRecommendationStatus();
  const [periodId, setPeriodId] = useState("");
  useEffect(() => setPeriodId(""), [activeBusinessId]);
  async function create() {
    const period = periods.data?.items.find((p) => p.id === periodId);
    if (!period || !activeBusinessId) return;
    try {
      await generate.mutateAsync({
        businessId: activeBusinessId,
        periodStart: period.startDate,
        periodEnd: period.endDate,
      });
      toast.success("Đã tạo khuyến nghị từ dữ liệu thực tế.");
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Không thể tạo khuyến nghị.",
      );
    }
  }
  return (
    <div className="space-y-6">
      <AppPageHeader
        title="Khuyến nghị giảm phát thải"
        description="Khuyến nghị dựa trên kết quả CO₂e và chất lượng dữ liệu. Không có dữ liệu thì chưa có khuyến nghị."
      />
      {canManage && (
        <AppPanel title="Phân tích theo kỳ">
          <div className="flex flex-wrap gap-3">
            <select
              aria-label="Kỳ phân tích khuyến nghị"
              className="h-10 rounded-md border bg-background px-3"
              value={periodId}
              onChange={(e) => setPeriodId(e.target.value)}
            >
              <option value="">Chọn kỳ báo cáo</option>
              {periods.data?.items.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <Button disabled={!periodId || generate.isPending} onClick={create}>
              Tạo khuyến nghị
            </Button>
          </div>
        </AppPanel>
      )}
      {rec.error && (
        <p role="alert" className="text-destructive">
          {rec.error.message}
        </p>
      )}
      {rec.isLoading && <p>Đang tải…</p>}
      {rec.data?.items.length === 0 && (
        <AppPanel>
          <p>
            Chưa có khuyến nghị. Duyệt và tính phát thải trước khi phân tích.
          </p>
        </AppPanel>
      )}
      {rec.data?.items.map((r) => (
        <AppPanel
          key={r.id}
          title={r.title}
          description={`${r.priority} · ${statusLabels[r.status]} · ${r.branch?.name ?? "Toàn doanh nghiệp"}`}
        >
          <p className="text-sm leading-relaxed">{r.description}</p>
          {r.impactEstimateKgCo2e && (
            <p className="mt-2 text-sm">
              Tiềm năng giảm:{" "}
              {(Number(r.impactEstimateKgCo2e) / 1000).toLocaleString("vi-VN")}{" "}
              tCO₂e
            </p>
          )}
          {canManage && (
            <div className="mt-4 flex flex-wrap gap-2">
              {(["IN_PROGRESS", "COMPLETED", "DISMISSED"] as const)
                .filter((status) => status !== r.status)
                .map((status) => (
                  <Button
                    key={status}
                    variant="outline"
                    disabled={update.isPending}
                    onClick={() =>
                      update.mutate(
                        { id: r.id, status },
                        { onError: (e) => toast.error(e.message) },
                      )
                    }
                  >
                    {statusLabels[status]}
                  </Button>
                ))}
            </div>
          )}
        </AppPanel>
      ))}
    </div>
  );
}
