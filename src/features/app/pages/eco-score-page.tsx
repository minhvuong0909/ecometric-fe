import { useMemo } from "react";
import { Link } from "react-router";
import {
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Award,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { AppPageHeader } from "@/features/app/components/app-page-header";
import { AppPanel } from "@/features/app/components/app-panel";
import { ECO_SCORE_COPY } from "@/features/app/constants/app-copy";
import { useCalculateEcoScore, useEcoScores } from "@/features/app/hooks/use-eco-score";
import { useReportingPeriods } from "@/features/app/hooks/use-app-meta";
import { useBusinessStore } from "@/shared/stores/business-store";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

export function EcoScorePage() {
  const copy = ECO_SCORE_COPY;
  const { activeBusinessId } = useBusinessStore();

  const { data: scoresData, refetch, isFetching } = useEcoScores(activeBusinessId);
  const { data: periodsData } = useReportingPeriods(activeBusinessId);
  const calculateMutation = useCalculateEcoScore();

  const latestScore = scoresData?.items?.[0];

  const scoreNum = latestScore ? Math.round(Number(latestScore.score)) : parseInt(copy.score, 10) || 72;
  const levelText = latestScore ? `Hạng ${latestScore.level}` : copy.efficiency;

  // Tính toán thông số cho vòng tròn SVG đo chỉ số
  const radius = 55;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius; // ~345.57
  const strokeDashoffset = circumference - (scoreNum / 100) * circumference;

  const handleRecalculate = async () => {
    if (!activeBusinessId) {
      toast.error("Vui lòng chọn doanh nghiệp");
      return;
    }

    const periodId = periodsData?.items?.[0]?.id;
    if (!periodId) {
      toast.info("Cần có kỳ báo cáo để tính Eco-Score");
      return;
    }

    toast.loading("Đang tính toán lại Eco-Score...", { id: "score-toast" });
    try {
      await calculateMutation.mutateAsync({
        businessId: activeBusinessId,
        reportingPeriodId: periodId,
      });
      await refetch();
      toast.success("Tính điểm Eco-score thành công!", { id: "score-toast" });
    } catch (err: any) {
      toast.error(err?.message || "Không thể tính toán Eco-Score", { id: "score-toast" });
    }
  };

  // Cấu hình icons cho mục Thay đổi
  const changesWithIcons = [
    { text: copy.changes[0], icon: TrendingUp, color: "text-red-600 dark:text-red-400 border-red-500/20 bg-red-500/10" },
    { text: copy.changes[1], icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400 border-emerald-500/20 bg-emerald-500/10" },
    { text: copy.changes[2], icon: AlertCircle, color: "text-amber-600 dark:text-amber-400 border-amber-500/20 bg-amber-500/10" },
    { text: copy.changes[3], icon: Sparkles, color: "text-indigo-600 dark:text-indigo-400 border-indigo-500/20 bg-indigo-500/10" },
  ];

  // 4 chỉ số phụ từ API nếu có
  const subMetrics = useMemo(() => {
    if (latestScore) {
      return [
        { title: "Cường độ phát thải", progress: Math.round(Number(latestScore.emissionScore)), target: "Mục tiêu: 80%" },
        { title: "Xu hướng suy giảm", progress: Math.round(Number(latestScore.trendScore)), target: "Mục tiêu: 75%" },
        { title: "Độ đầy đủ của dữ liệu", progress: Math.round(Number(latestScore.dataCompletenessScore)), target: "Mục tiêu: 90%" },
        { title: "Kế hoạch hành động", progress: Math.round(Number(latestScore.actionScore)), target: "Mục tiêu: 70%" },
      ];
    }
    return copy.subMetrics;
  }, [latestScore, copy.subMetrics]);

  // Màu cho 4 chỉ số phụ
  const progressBarColors = ["bg-emerald-500", "bg-blue-500", "bg-amber-500", "bg-purple-500"];


  return (
    <div className="space-y-8">
      <AppPageHeader
        breadcrumbs={copy.breadcrumbs}
        title={copy.title}
        description={copy.description}
        actions={
          <div className="flex items-center gap-2">
            <Button
              onClick={handleRecalculate}
              disabled={calculateMutation.isPending || isFetching}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className={cn("size-4", (calculateMutation.isPending || isFetching) && "animate-spin")} />
              Tính toán lại
            </Button>
            <Button asChild>
              <Link to={ROUTES.app.recommendations}>{copy.improveCta}</Link>
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Vòng đo điểm số tròn SVG động */}
        <AppPanel className="flex flex-col items-center justify-center text-center py-8 lg:col-span-1" interactive>
          <p className="text-xs font-medium tracking-wide text-muted-foreground flex items-center gap-1.5">
            <Award className="size-4 text-emerald-500" />
            Điểm Eco chung
          </p>
          <div className="relative mt-6 flex size-40 items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="size-full -rotate-90">
              {/* Vòng tròn nền */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-muted"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {/* Vòng tiến trình chạy hiệu ứng */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-primary transition-all duration-1000 ease-out"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <p className="text-5xl font-bold tracking-tight text-secondary-foreground">
                {scoreNum}
              </p>
              <p className="text-xs font-medium text-muted-foreground mt-0.5">
                {copy.scoreMax}
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm font-semibold text-primary flex items-center gap-1">
            <Sparkles className="size-3.5" />
            {levelText}
          </p>
        </AppPanel>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
          {subMetrics.map((metric, idx) => (
            <AppPanel key={metric.title} title={metric.title} bodyClassName="space-y-4" interactive>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-secondary-foreground">{metric.progress}%</span>
                <span className="text-xs text-muted-foreground/80">{metric.target}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn("h-full rounded-full transition-all duration-700 ease-out", progressBarColors[idx])}
                  style={{ width: `${metric.progress}%` }}
                />
              </div>
              <p className="text-[11px] font-medium text-muted-foreground/75">Tiến trình đạt được so với mục tiêu tối đa</p>
            </AppPanel>
          ))}
        </div>
      </div>

      <AppPanel
        title={copy.changesTitle}
        badge={
          <span className="rounded-full bg-secondary border border-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {copy.changesBadge}
          </span>
        }
      >
        <ul className="grid gap-3 sm:grid-cols-2">
          {changesWithIcons.map((change, idx) => {
            const IconComponent = change.icon;
            return (
              <li
                key={idx}
                className="flex items-start gap-3.5 rounded-xl border border-border/50 bg-card p-4 transition-all duration-300 hover:shadow-sm hover:border-primary/20 hover:bg-muted/5 group"
              >
                <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg border transition-all duration-300 group-hover:scale-105", change.color)}>
                  <IconComponent className="size-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-secondary-foreground leading-relaxed">
                    {change.text}
                  </p>
                  <p className="text-xs text-muted-foreground/80">
                    Đã ghi nhận trong kỳ báo cáo tháng này
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </AppPanel>

      <div className="flex justify-end gap-3">
        <Button asChild variant="outline">
          <Link to={ROUTES.app.dashboard}>Quay lại Tổng quan</Link>
        </Button>
        <Button asChild>
          <Link to={ROUTES.app.recommendations}>Xem khuyến nghị giảm thiểu</Link>
        </Button>
      </div>
    </div>
  );
}
