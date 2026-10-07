import { formatDate } from "@/shared/lib/date-format";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { AppPageHeader } from "@/features/app/components/app-page-header";
import { AppPanel } from "@/features/app/components/app-panel";
import {
  useEcoScores,
  useCalculateEcoScore,
} from "@/features/app/hooks/use-eco-score";
import { useReportingPeriods } from "@/features/app/hooks/use-app-meta";
import { useBusinessRole } from "@/features/businesses/hooks/use-business-role";
import { useBusinessStore } from "@/shared/stores/business-store";
import { Button } from "@/shared/components/ui/button";
import { ROUTES } from "@/shared/constants/routes";
export function EcoScorePage() {
  const { activeBusinessId } = useBusinessStore();
  const { role } = useBusinessRole(activeBusinessId ?? "");
  const canManage =
    role === "COMPANY_ADMIN" ||
    role === "SYSTEM_ADMIN" ||
    role === "BRANCH_MANAGER";
  const periods = useReportingPeriods(activeBusinessId);
  const scores = useEcoScores(activeBusinessId);
  const calculate = useCalculateEcoScore();
  const [periodId, setPeriodId] = useState("");
  useEffect(() => setPeriodId(""), [activeBusinessId]);
  const score = scores.data?.items.find(
    (s) => !periodId || s.reportingPeriodId === periodId,
  );
  async function compute() {
    if (!activeBusinessId || !periodId) return;
    try {
      await calculate.mutateAsync({
        businessId: activeBusinessId,
        reportingPeriodId: periodId,
      });
      toast.success("Đã tính Eco Score.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Không thể tính điểm.");
    }
  }
  return (
    <div className="space-y-6">
      <AppPageHeader
        title="Eco Score"
        description="Điểm được tính từ phát thải, xu hướng, độ đầy đủ dữ liệu và tiến độ hành động của kỳ đã đóng."
        actions={
          <Button asChild variant="outline">
            <Link to={ROUTES.app.reports}>Quản lý kỳ báo cáo</Link>
          </Button>
        }
      />
      <AppPanel title="Kỳ đánh giá">
        <div className="flex flex-wrap gap-3">
          <select
            aria-label="Kỳ đánh giá Eco Score"
            className="h-10 rounded-md border bg-background px-3"
            value={periodId}
            onChange={(e) => setPeriodId(e.target.value)}
          >
            <option value="">Chọn kỳ đã đóng</option>
            {periods.data?.items
              .filter((p) => p.status === "CLOSED")
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
          </select>
          {canManage && (
            <Button
              disabled={!periodId || calculate.isPending}
              onClick={compute}
            >
              Tính Eco Score
            </Button>
          )}
        </div>
      </AppPanel>
      {scores.error && (
        <p role="alert" className="text-destructive">
          {scores.error.message}
        </p>
      )}
      {scores.isLoading && <p>Đang tải…</p>}
      <AppPanel title="Kết quả đánh giá">
        {score ? (
          <>
            <p className="text-5xl font-bold text-primary">
              {Number(score.score).toFixed(2)}
              <span className="text-xl text-muted-foreground"> / 100</span>
            </p>
            <p className="mt-3">
              {score.level} · {formatDate(score.periodStart)} -{" "}
              {formatDate(score.periodEnd)}
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                { name: "Phát thải", value: score.emissionScore, max: 40 },
                { name: "Xu hướng", value: score.trendScore, max: 25 },
                {
                  name: "Độ đầy đủ dữ liệu",
                  value: score.dataCompletenessScore,
                  max: 25,
                },
                {
                  name: "Kế hoạch hành động",
                  value: score.actionScore,
                  max: 10,
                },
              ].map((m) => (
                <div key={m.name} className="eco-score-component">
                  <p>
                    <span>{m.name}</span><strong className="tabular-nums">{m.value}/{m.max}</strong>
                  </p>
                  <progress
                    className="mt-2 w-full"
                    value={m.value}
                    max={m.max}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <p>Chưa có điểm cho kỳ này. Đóng kỳ và tính điểm để xem kết quả.</p>
        )}
      </AppPanel>
      <Button asChild>
        <Link to={ROUTES.app.recommendations}>Xem khuyến nghị</Link>
      </Button>
    </div>
  );
}
