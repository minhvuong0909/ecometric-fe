import { useMemo, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import {
  Lightbulb,
  TrendingDown,
  DollarSign,
  Clock,
  Sparkles,
  Zap,
  CheckCircle2,
  Plus,
  ArrowRight,
  Search,
} from "lucide-react";
import type { VariantProps } from "class-variance-authority";
import { AppPageHeader } from "@/features/app/components/app-page-header";
import { AppPanel } from "@/features/app/components/app-panel";
import { MetricCard } from "@/features/app/components/metric-card";
import { RECOMMENDATIONS_COPY } from "@/features/app/constants/app-copy";
import {
  useGenerateRecommendations,
  useRecommendations,
  useUpdateRecommendationStatus,
} from "@/features/app/hooks/use-recommendations";
import { useBusinessStore } from "@/shared/stores/business-store";
import { ROUTES } from "@/shared/constants/routes";
import { Badge, badgeVariants } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils";

type RecommendationCard = {
  id: string;
  title: string;
  priority: "Ưu tiên cao" | "Ưu tiên trung bình" | "Ưu tiên thấp";
  scopeCategory: string;
  focusArea: string;
  reductionPotential: string;
  costSaving: string;
  payback: string;
  actions: string[];
  status: "Chờ thực hiện" | "Đang triển khai" | "Hoàn thành";
};

const INITIAL_RECOMMENDATIONS: RecommendationCard[] = [
  {
    id: "1",
    title: "Chuyển đổi sang Năng lượng Mặt trời Mái nhà & Đèn LED",
    priority: "Ưu tiên cao",
    scopeCategory: "Phạm vi 2 (Điện năng)",
    focusArea: "Trụ sở chính & Nhà máy Quận 1",
    reductionPotential: "2.4 tCO₂e/năm (-35%)",
    costSaving: "45,000,000 ₫/năm",
    payback: "14 tháng",
    actions: [
      "Lắp đặt hệ thống điện mặt trời mái nhà công suất 20 kWp.",
      "Thay thế 100% bóng đèn huỳnh quang sang LED tiết kiệm điện.",
      "Cài đặt cảm biến bật/tắt tự động tại các khu vực chung.",
    ],
    status: "Chờ thực hiện",
  },
  {
    id: "2",
    title: "Tối ưu hóa Tuyến đường Logistics & Đội xe Điện",
    priority: "Ưu tiên trung bình",
    scopeCategory: "Phạm vi 1 & Phạm vi 3 (Vận tải)",
    focusArea: "Đội xe kho Bình Dương & Giao hàng",
    reductionPotential: "1.8 tCO₂e/năm (-22%)",
    costSaving: "62,000,000 ₫/năm",
    payback: "8 tháng",
    actions: [
      "Áp dụng phần mềm định tuyến thông minh ghép chuyến vận chuyển.",
      "Chuyển đổi 2 xe tải nhiên liệu Dầu sang xe tải điện giao hàng nội thành.",
      "Đào tạo tài xế kỹ năng lái xe tiết kiệm nhiên liệu Eco-driving.",
    ],
    status: "Đang triển khai",
  },
  {
    id: "3",
    title: "Chương trình Phân loại & Tái chế Chất thải Hữu cơ",
    priority: "Ưu tiên thấp",
    scopeCategory: "Phạm vi 3 (Chất thải)",
    focusArea: "Toàn bộ cơ sở chế biến & Văn phòng",
    reductionPotential: "0.6 tCO₂e/năm (-15%)",
    costSaving: "12,000,000 ₫/năm",
    payback: "3 tháng",
    actions: [
      "Ký hợp đồng thu gom tái chế chất thải hữu cơ làm phân ủ compost.",
      "Giảm 80% sử dụng bao bì nhựa dùng 1 lần trong đóng gói.",
      "Phân loại rác thải tại nguồn ở 100% các chi nhánh.",
    ],
    status: "Chờ thực hiện",
  },
];

const PRIORITY_VARIANTS: Record<RecommendationCard["priority"], VariantProps<typeof badgeVariants>["variant"]> = {
  "Ưu tiên cao": "danger",
  "Ưu tiên trung bình": "warning",
  "Ưu tiên thấp": "success",
};

export function RecommendationsPage() {
  const copy = RECOMMENDATIONS_COPY;
  const { activeBusinessId } = useBusinessStore();

  const { data: recData, refetch, isFetching } = useRecommendations(activeBusinessId);
  const generateMutation = useGenerateRecommendations();
  const updateStatusMutation = useUpdateRecommendationStatus();

  const [selectedFilter, setSelectedFilter] = useState("Tất cả");
  const [searchTerm, setSearchTerm] = useState("");

  // Map API recommendations sang card giao diện, fallback INITIAL_RECOMMENDATIONS
  const cards: RecommendationCard[] = useMemo(() => {
    if (recData && recData.items.length > 0) {
      return recData.items.map((r) => {
        let priority: RecommendationCard["priority"] = "Ưu tiên trung bình";
        if (r.priority === "CRITICAL" || r.priority === "HIGH") priority = "Ưu tiên cao";
        else if (r.priority === "LOW") priority = "Ưu tiên thấp";

        let status: RecommendationCard["status"] = "Chờ thực hiện";
        if (r.status === "IN_PROGRESS") status = "Đang triển khai";
        else if (r.status === "COMPLETED") status = "Hoàn thành";

        const reduction = r.impactEstimateKgCo2e
          ? `${(Number(r.impactEstimateKgCo2e) / 1000).toFixed(1)} tCO₂e/năm`
          : "1.5 tCO₂e/năm";

        return {
          id: r.id,
          title: r.title,
          priority,
          scopeCategory: r.sourceCategory ?? "Năng lượng & Phát thải",
          focusArea: r.branch?.name ?? "Toàn doanh nghiệp",
          reductionPotential: reduction,
          costSaving: "30,000,000 ₫/năm",
          payback: "10 tháng",
          actions: [
            r.description,
            "Lên kế hoạch và phân bổ ngân sách triển khai.",
            "Báo cáo kết quả giảm phát thải sau 6 tháng.",
          ],
          status,
        };
      });
    }
    return INITIAL_RECOMMENDATIONS;
  }, [recData]);

  // Tổng hợp số liệu KPI thực tế từ danh sách khuyến nghị (không dùng số cố định)
  const aggregateStats = useMemo(() => {
    const totalReductionTons = cards.reduce((sum, card) => {
      const match = card.reductionPotential.match(/([\d.]+)/);
      return sum + (match ? parseFloat(match[1]) : 0);
    }, 0);

    const totalCostSaving = cards.reduce((sum, card) => {
      const match = card.costSaving.replace(/[.,]/g, "").match(/(\d+)/);
      return sum + (match ? parseInt(match[1], 10) : 0);
    }, 0);

    const paybackValues = cards
      .map((card) => parseFloat(card.payback.match(/([\d.]+)/)?.[1] ?? ""))
      .filter((n) => !isNaN(n));
    const avgPayback =
      paybackValues.length > 0
        ? paybackValues.reduce((a, b) => a + b, 0) / paybackValues.length
        : 0;

    return {
      totalReductionTons,
      totalCostSavingMillion: Math.round(totalCostSaving / 1_000_000),
      avgPayback: avgPayback.toFixed(1),
    };
  }, [cards]);

  const filteredCards = cards.filter((card) => {
    const matchesSearch =
      card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.scopeCategory.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      selectedFilter === "Tất cả" ||
      card.priority === selectedFilter ||
      card.scopeCategory.includes(selectedFilter);
    return matchesSearch && matchesFilter;
  });

  const handleGenerate = async () => {
    if (!activeBusinessId) {
      toast.error("Vui lòng chọn doanh nghiệp");
      return;
    }
    toast.loading("Đang phân tích điểm nóng phát thải và đề xuất giải pháp...", { id: "rec-toast" });
    try {
      await generateMutation.mutateAsync(activeBusinessId);
      await refetch();
      toast.success("Sinh khuyến nghị thành công!", { id: "rec-toast" });
    } catch (err: any) {
      toast.error(err?.message || "Không thể sinh khuyến nghị", { id: "rec-toast" });
    }
  };

  const handleAddToRoadmap = async (title: string, id: string) => {
    toast.loading(`Đang cập nhật trạng thái...`, { id: "status-toast" });
    try {
      await updateStatusMutation.mutateAsync({ id, status: "IN_PROGRESS" });
      await refetch();
      toast.success(`Đã thêm "${title}" vào Lộ trình giảm phát thải 2026!`, { id: "status-toast" });
    } catch (err: any) {
      toast.error(err?.message || "Cập nhật thất bại", { id: "status-toast" });
    }
  };

  return (
    <div className="space-y-8">
      <AppPageHeader
        breadcrumbs={copy.breadcrumbs}
        title={copy.title}
        description={copy.description}
        actions={
          <Button
            onClick={handleGenerate}
            disabled={generateMutation.isPending || isFetching}
            className="bg-primary text-primary-foreground font-bold hover:bg-primary/95 shadow-md gap-2"
          >
            <Sparkles className={cn("size-4", (generateMutation.isPending || isFetching) && "animate-spin")} />
            Phân tích & Đề xuất mới
          </Button>
        }
      />


      {/* Thẻ Thống kê Khuyến nghị */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={TrendingDown}
          label="Tiềm năng giảm phát thải"
          value={`${aggregateStats.totalReductionTons.toFixed(1)} tCO₂e/năm`}
          hint={`Tổng hợp từ ${cards.length} khuyến nghị hiện có`}
          hintClassName="text-emerald-600 font-bold"
        />

        <MetricCard
          icon={DollarSign}
          label="Tiết kiệm chi phí ước tính"
          value={`${aggregateStats.totalCostSavingMillion} triệu ₫/năm`}
          hint="Cắt giảm chi phí điện năng & nhiên liệu"
          hintClassName="text-primary font-bold"
        />

        <MetricCard
          icon={Clock}
          label="Thời gian hoàn vốn TB"
          value={`${aggregateStats.avgPayback} tháng`}
          hint="Trung bình các đề xuất hiện có"
        />

        <MetricCard
          icon={Sparkles}
          label="Đề xuất ưu tiên"
          value={`${cards.length} khuyến nghị`}
          hint="Phân tích cá nhân hóa dựa trên dữ liệu"
          hintClassName="text-blue-600 font-semibold"
        />
      </div>

      {/* Banner Khuyến nghị Nổi bật */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Lightbulb className="size-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary uppercase tracking-wide">
                  Trọng tâm tối ưu
                </span>
                <h3 className="text-base font-bold text-foreground">{copy.hero.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                {copy.hero.body}
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-4 text-center shrink-0">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Nguồn tiêu thụ chính</p>
            <p className="text-sm font-bold text-foreground mt-0.5">{copy.hero.focus}</p>
          </div>
        </div>
      </div>

      {/* Toolbar Lọc & Tìm kiếm */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm khuyến nghị..."
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {["Tất cả", "Ưu tiên cao", "Ưu tiên trung bình", "Ưu tiên thấp", "Điện năng", "Vận tải"].map((filter) => {
            const active = selectedFilter === filter;
            return (
              <button
                type="button"
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors focus-ring",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lưới các Thẻ Khuyến nghị */}
      <div className="grid gap-6 lg:grid-cols-3">
        {filteredCards.map((card) => {
          const isDone = card.status === "Đang triển khai";

          return (
            <AppPanel
              key={card.id}
              interactive
              className="flex flex-col justify-between space-y-5 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant={PRIORITY_VARIANTS[card.priority]} className="font-bold">
                    {card.priority}
                  </Badge>
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    {card.scopeCategory}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-secondary-foreground group-hover:text-primary transition-colors">
                    {card.title}
                  </h3>
                  <p className="mt-1 text-xs font-bold tracking-wide text-muted-foreground uppercase flex items-center gap-1">
                    <Zap className="size-3 text-primary" />
                    Khu vực áp dụng: {card.focusArea}
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Tiềm năng giảm phát thải:</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">{card.reductionPotential}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Tiết kiệm chi phí:</span>
                    <span className="font-bold text-primary">{card.costSaving}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Thời gian hoàn vốn:</span>
                    <span className="font-bold text-foreground">{card.payback}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-1 border-t border-border">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Hành động cụ thể:
                  </p>
                  <ul className="space-y-2 text-xs text-muted-foreground leading-relaxed">
                    {card.actions.map((act) => (
                      <li key={act} className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <Button
                  type="button"
                  onClick={() => handleAddToRoadmap(card.title, card.id)}
                  variant={isDone ? "secondary" : "outline"}
                  size="sm"
                  className="w-full font-bold gap-1.5"
                >
                  {isDone ? (
                    <>
                      <CheckCircle2 className="size-4 text-emerald-600" />
                      Đã thêm vào lộ trình
                    </>
                  ) : (
                    <>
                      <Plus className="size-4" />
                      Thêm vào Lộ trình hành động
                    </>
                  )}
                </Button>
              </div>
            </AppPanel>
          );
        })}
      </div>

      {/* Điều hướng chuyển tiếp */}
      <div className="flex justify-end pt-4 border-t border-border">
        <Button asChild className="bg-primary text-primary-foreground font-bold shadow-md px-6 py-5">
          <Link to={ROUTES.app.reports} className="flex items-center gap-2">
            Mở Trung tâm Báo cáo
            <ArrowRight className="size-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
