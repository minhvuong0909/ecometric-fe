import { Link } from "react-router";
import {
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Award,
} from "lucide-react";
import { AppPageHeader } from "@/features/app/components/app-page-header";
import { AppPanel } from "@/features/app/components/app-panel";
import { ECO_SCORE_COPY } from "@/features/app/constants/app-copy";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

export function EcoScorePage() {
  const copy = ECO_SCORE_COPY;
  const scoreNum = parseInt(copy.score, 10) || 72;

  // Tính toán thông số cho vòng tròn SVG đo chỉ số
  const radius = 55;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius; // ~345.57
  const strokeDashoffset = circumference - (scoreNum / 100) * circumference;

  // Cấu hình icons cho mục Thay đổi
  const changesWithIcons = [
    { text: copy.changes[0], icon: TrendingUp, color: "text-red-500 border-red-100 bg-red-50/50" },
    { text: copy.changes[1], icon: CheckCircle2, color: "text-emerald-500 border-emerald-100 bg-emerald-50/50" },
    { text: copy.changes[2], icon: AlertCircle, color: "text-amber-500 border-amber-100 bg-amber-50/50" },
    { text: copy.changes[3], icon: Sparkles, color: "text-indigo-500 border-indigo-100 bg-indigo-50/50" },
  ];

  // Dải màu cho 4 chỉ số phụ
  const gradientStyles = [
    "bg-gradient-to-r from-emerald-400 to-teal-500 shadow-sm shadow-emerald-400/20",
    "bg-gradient-to-r from-blue-400 to-indigo-500 shadow-sm shadow-blue-400/20",
    "bg-gradient-to-r from-amber-400 to-orange-500 shadow-sm shadow-amber-400/20",
    "bg-gradient-to-r from-purple-400 to-pink-500 shadow-sm shadow-purple-400/20",
  ];

  return (
    <div className="space-y-8">
      <AppPageHeader
        breadcrumbs={copy.breadcrumbs}
        title={copy.title}
        description={copy.description}
        actions={
          <Button asChild className="bg-accent font-bold text-accent-foreground hover:bg-accent/90 shadow-md">
            <Link to={ROUTES.app.recommendations}>{copy.improveCta}</Link>
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Vòng đo điểm số tròn SVG động */}
        <AppPanel className="flex flex-col items-center justify-center text-center py-8 lg:col-span-1" interactive>
          <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-1.5">
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
                {copy.score}
              </p>
              <p className="text-xs font-bold text-muted-foreground/80 uppercase mt-0.5">
                {copy.scoreMax}
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm font-bold text-primary flex items-center gap-1">
            <Sparkles className="size-3.5 animate-pulse" />
            {copy.efficiency}
          </p>
        </AppPanel>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
          {copy.subMetrics.map((metric, idx) => (
            <AppPanel key={metric.title} title={metric.title} bodyClassName="space-y-4" interactive>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-secondary-foreground">{metric.progress}%</span>
                <span className="text-xs text-muted-foreground/80">{metric.target}</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-muted/60 border border-border/10">
                <div
                  className={cn("h-full rounded-full transition-all duration-1000 ease-out", gradientStyles[idx])}
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
          <span className="rounded-full bg-secondary border border-primary/10 px-3 py-1 text-xs font-bold text-primary">
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
        <Button asChild variant="outline" className="font-semibold shadow-sm">
          <Link to={ROUTES.app.dashboard}>Quay lại Tổng quan</Link>
        </Button>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/95 font-semibold shadow-sm">
          <Link to={ROUTES.app.recommendations}>Xem khuyến nghị giảm thiểu</Link>
        </Button>
      </div>
    </div>
  );
}
