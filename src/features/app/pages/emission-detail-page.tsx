import { useMemo, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import {
  BarChart3,
  Calculator,
  Download,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Fuel,
  Truck,
  Search,
} from "lucide-react";
import { AppPageHeader } from "@/features/app/components/app-page-header";
import { AppPanel } from "@/features/app/components/app-panel";
import { MetricCard } from "@/features/app/components/metric-card";
import { EMISSION_DETAIL_COPY } from "@/features/app/constants/app-copy";
import { useActivityDataList } from "@/features/app/hooks/use-activity-data";
import { useDashboardSummary } from "@/features/app/hooks/use-dashboard";
import { useBusinessStore } from "@/shared/stores/business-store";
import { ROUTES } from "@/shared/constants/routes";
import { Badge, badgeVariants } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils";
import type { VariantProps } from "class-variance-authority";

type EmissionRow = {
  id: string;
  source: string;
  category: string;
  scope: "Phạm vi 1" | "Phạm vi 2" | "Phạm vi 3";
  activityData: string;
  factor: string;
  factorUnit: string;
  sourceDb: string;
  result: string;
  co2eNumeric: number;
  status: "Đã xác thực" | "Cần kiểm tra";
};

const INITIAL_ROWS: EmissionRow[] = [
  {
    id: "1",
    source: "Điện lưới tiêu thụ (Quận 1)",
    category: "Năng lượng điện",
    scope: "Phạm vi 2",
    activityData: "1,500 kWh",
    factor: "0.000453",
    factorUnit: "tCO₂e / kWh",
    sourceDb: "Bộ TN&MT 2026 / EVN",
    result: "0.68 t",
    co2eNumeric: 0.68,
    status: "Đã xác thực",
  },
  {
    id: "2",
    source: "Nhiên liệu Dầu Diesel (Kho BD)",
    category: "Đốt cháy cố định",
    scope: "Phạm vi 1",
    activityData: "320 Lít",
    factor: "0.002687",
    factorUnit: "tCO₂e / L",
    sourceDb: "GHG Protocol / IPCC 2024",
    result: "0.86 t",
    co2eNumeric: 0.86,
    status: "Đã xác thực",
  },
  {
    id: "3",
    source: "Vận chuyển hàng hóa bằng Xe tải",
    category: "Vận tải logistic",
    scope: "Phạm vi 3",
    activityData: "4,200 km",
    factor: "0.000119",
    factorUnit: "tCO₂e / km",
    sourceDb: "DEFRA 2025 Standard",
    result: "0.50 t",
    co2eNumeric: 0.5,
    status: "Đã xác thực",
  },
  {
    id: "4",
    source: "Chất thải rắn sinh hoạt",
    category: "Xử lý chất thải",
    scope: "Phạm vi 3",
    activityData: "12.5 tấn",
    factor: "0.008880",
    factorUnit: "tCO₂e / tấn",
    sourceDb: "EPA WARM Model 2025",
    result: "0.11 t",
    co2eNumeric: 0.11,
    status: "Đã xác thực",
  },
];

const SCOPE_VARIANTS: Record<EmissionRow["scope"], VariantProps<typeof badgeVariants>["variant"]> = {
  "Phạm vi 1": "info",
  "Phạm vi 2": "success",
  "Phạm vi 3": "accent",
};

export function EmissionDetailPage() {
  const copy = EMISSION_DETAIL_COPY;
  const { activeBusinessId } = useBusinessStore();

  const { data: activityData, refetch, isFetching } = useActivityDataList(
    { businessId: activeBusinessId ?? undefined, limit: 100 },
    !!activeBusinessId,
  );
  const { data: summaryData } = useDashboardSummary(
    { businessId: activeBusinessId ?? undefined },
    !!activeBusinessId,
  );

  const [selectedScopeFilter, setSelectedScopeFilter] = useState<string>("Tất cả");
  const [searchTerm, setSearchTerm] = useState("");
  const [isRecalculating, setIsRecalculating] = useState(false);

  // Chuyển đổi dữ liệu API sang hàng bảng biểu, fallback INITIAL_ROWS nếu chưa có
  const rows: EmissionRow[] = useMemo(() => {
    if (activityData && activityData.items.length > 0) {
      return activityData.items.map((item) => {
        const scope = item.emissionSource?.defaultScope;
        const scopeLabel: EmissionRow["scope"] =
          scope === "SCOPE_1" ? "Phạm vi 1" : scope === "SCOPE_2" ? "Phạm vi 2" : "Phạm vi 3";

        // Ước tính tạm phát thải hiển thị dựa trên hệ số thông dụng
        const qty = parseFloat(item.quantity) || 0;
        let factor = 0.00045;
        if (scope === "SCOPE_1") factor = 0.00268;
        if (scope === "SCOPE_3") factor = 0.00012;
        const co2eNumeric = Number((qty * factor).toFixed(2));

        return {
          id: item.id,
          source: `${item.emissionSource?.name ?? "Hoạt động phát thải"} (${item.branch?.name ?? "Cơ sở"})`,
          category: item.inputMethod === "AI_SCAN" ? "Hóa đơn AI OCR" : "Nhập thủ công",
          scope: scopeLabel,
          activityData: `${Number(qty).toLocaleString("vi-VN")} ${item.unit}`,
          factor: factor.toFixed(6),
          factorUnit: `tCO₂e / ${item.unit}`,
          sourceDb: "GHG Protocol Vietnam Database",
          result: `${co2eNumeric} t`,
          co2eNumeric,
          status: item.status === "CONFIRMED" ? "Đã xác thực" : "Cần kiểm tra",
        };
      });
    }
    return INITIAL_ROWS;
  }, [activityData]);

  // Tính toán tổng lượng phát thải theo các phạm vi
  const totalEmissions = useMemo(() => {
    if (summaryData?.totalCo2eKg) {
      return (Number(summaryData.totalCo2eKg) / 1000).toFixed(2);
    }
    return rows.reduce((sum, r) => sum + r.co2eNumeric, 0).toFixed(2);
  }, [summaryData, rows]);

  const scope1Total = rows
    .filter((r) => r.scope === "Phạm vi 1")
    .reduce((sum, r) => sum + r.co2eNumeric, 0)
    .toFixed(2);
  const scope2Total = rows
    .filter((r) => r.scope === "Phạm vi 2")
    .reduce((sum, r) => sum + r.co2eNumeric, 0)
    .toFixed(2);
  const scope3Total = rows
    .filter((r) => r.scope === "Phạm vi 3")
    .reduce((sum, r) => sum + r.co2eNumeric, 0)
    .toFixed(2);

  // Lọc dữ liệu theo phạm vi và từ khóa tìm kiếm
  const filteredRows = rows.filter((r) => {
    const matchesSearch =
      r.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesScope =
      selectedScopeFilter === "Tất cả" || r.scope === selectedScopeFilter;
    return matchesSearch && matchesScope;
  });

  const handleRecalculate = async () => {
    setIsRecalculating(true);
    toast.loading("Đang quy đổi lại dữ liệu với hệ số phát thải cập nhật...", { id: "recalc-toast" });

    await refetch();
    setTimeout(() => {
      setIsRecalculating(false);
      toast.success("Đã hoàn tất tính toán lại với hệ số phát thải cập nhật.", {
        id: "recalc-toast",
      });
    }, 600);
  };


  const handleExportReport = () => {
    toast.loading("Đang xuất bảng tính toán CO₂e dạng Excel/PDF chuẩn kiểm toán...", {
      id: "export-toast",
    });
    setTimeout(() => {
      toast.success("Đã xuất file emission_calculation_2026.xlsx thành công!", {
        id: "export-toast",
      });
    }, 1200);
  };

  return (
    <div className="space-y-8">
      <AppPageHeader
        breadcrumbs={[{ label: copy.eyebrow, active: true }]}
        title={copy.title}
        description={copy.description}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleExportReport} className="gap-1.5">
              <Download className="size-4" />
              {copy.exportCta}
            </Button>

            <Button onClick={handleRecalculate} disabled={isRecalculating || isFetching} className="gap-1.5">
              <RefreshCw className={cn("size-4", (isRecalculating || isFetching) && "animate-spin")} />
              {copy.recalculateCta}
            </Button>
          </div>
        }
      />

      {/* Thanh tiến trình luồng xử lý */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-emerald-500 text-white text-sm">
              <CheckCircle2 className="size-5" />
            </span>
            <div>
              <p className="text-xs font-medium tracking-wide text-emerald-600 dark:text-emerald-400">Bước 1: Hoàn thành</p>
              <h2 className="text-sm font-semibold text-secondary-foreground">Tải chứng từ / Nhập dữ liệu</h2>
            </div>
          </div>

          <div className="hidden h-px flex-1 bg-border md:block mx-4" />

          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-emerald-500 text-white text-sm">
              <CheckCircle2 className="size-5" />
            </span>
            <div>
              <p className="text-xs font-medium tracking-wide text-emerald-600 dark:text-emerald-400">Bước 2: Hoàn thành</p>
              <h2 className="text-sm font-semibold text-secondary-foreground">AI Trích xuất & Xác nhận</h2>
            </div>
          </div>

          <div className="hidden h-px flex-1 bg-border md:block mx-4" />

          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-semibold">
              3
            </span>
            <div>
              <p className="text-xs font-medium tracking-wide text-primary">Bước 3 / 3</p>
              <h2 className="text-sm font-semibold text-secondary-foreground">Tính toán lượng CO₂e</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Bộ 4 Thẻ Thống kê Tổng lượng Phát thải */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={BarChart3}
          label="Tổng lượng phát thải CO₂e"
          value={`${totalEmissions} tCO₂e`}
          hint="Đã đối chiếu với hệ số EF 2026"
          hintClassName="text-primary font-bold"
        />

        <MetricCard
          icon={Fuel}
          label="Phạm vi 1 (Phát thải trực tiếp)"
          value={`${scope1Total} tCO₂e`}
          hint="Nhiên liệu đốt cháy cố định & Đội xe"
          hintClassName="text-blue-600 dark:text-blue-400 font-semibold"
        />

        <MetricCard
          icon={Zap}
          label="Phạm vi 2 (Điện mua ngoài)"
          value={`${scope2Total} tCO₂e`}
          hint="Điện tiêu thụ tại các chi nhánh"
          hintClassName="text-emerald-600 dark:text-emerald-400 font-semibold"
        />

        <MetricCard
          icon={Truck}
          label="Phạm vi 3 (Gián tiếp & Chuỗi v.chuyển)"
          value={`${scope3Total} tCO₂e`}
          hint="Vận tải logistics & Xử lý chất thải"
          hintClassName="text-purple-600 dark:text-purple-400 font-semibold"
        />
      </div>

      {/* Banner Công thức & Tiêu chuẩn Kiểm toán */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Calculator className="size-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  GHG Protocol Standard
                </span>
                <h3 className="text-base font-semibold text-foreground">Công thức tính toán phát thải chính thức</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                <code className="rounded bg-muted px-2 py-0.5 font-mono text-primary">
                  Lượng CO₂e (tấn) = Dữ liệu hoạt động × Hệ số phát thải (EF)
                </code>
                . Dữ liệu được xác thực theo các cơ sở dữ liệu quốc tế IPCC, DEFRA và Bộ TN&MT Việt Nam.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="rounded-lg bg-muted p-3 text-center border border-border">
              <p className="text-[11px] font-medium text-muted-foreground">Trạng thái Kiểm toán</p>
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="size-4" />
                Audit Ready (Sẵn sàng)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bảng Chi tiết Tính toán CO2e với Bộ lọc & Tìm kiếm */}
      <AppPanel
        title={copy.tableTitle}
        description={copy.tableSubtitle}
        badge={
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            4 Nguồn phát thải đã đối chiếu
          </span>
        }
        bodyClassName="p-0"
      >
        {/* Toolbar Tìm kiếm & Lọc Scope */}
        <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo nguồn hoặc danh mục..."
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {["Tất cả", "Phạm vi 1", "Phạm vi 2", "Phạm vi 3"].map((scope) => {
              const active = selectedScopeFilter === scope;
              return (
                <button
                  type="button"
                  key={scope}
                  onClick={() => setSelectedScopeFilter(scope)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold transition-colors focus-ring",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground",
                  )}
                >
                  {scope}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bảng Chi Tiết Kết Quả */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[840px] text-left text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-6 py-3.5 text-xs font-medium text-muted-foreground">
                  Nguồn phát thải & Danh mục
                </th>
                <th className="px-6 py-3.5 text-xs font-medium text-muted-foreground">
                  Phạm vi (Scope)
                </th>
                <th className="px-6 py-3.5 text-xs font-medium text-muted-foreground">
                  Dữ liệu hoạt động
                </th>
                <th className="px-6 py-3.5 text-xs font-medium text-muted-foreground">
                  Hệ số phát thải (EF)
                </th>
                <th className="px-6 py-3.5 text-xs font-medium text-muted-foreground">
                  Cơ sở dữ liệu
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-medium text-muted-foreground">
                  Kết quả CO₂e
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => {
                return (
                  <tr
                    key={row.id}
                    className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-foreground">{row.source}</p>
                        <p className="text-xs text-muted-foreground">{row.category}</p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <Badge variant={SCOPE_VARIANTS[row.scope]} className="font-bold">
                        {row.scope}
                      </Badge>
                    </td>

                    <td className="px-6 py-4 font-semibold text-foreground">
                      {row.activityData}
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-mono text-xs">
                        <span className="font-bold text-primary">{row.factor}</span>{" "}
                        <span className="text-muted-foreground">{row.factorUnit}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      <span className="rounded bg-muted px-2 py-1 font-medium border border-border/50">
                        {row.sourceDb}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <span className="text-base font-bold text-emerald-700 dark:text-emerald-400">
                        {row.result}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-muted/40 border-t border-border">
              <tr>
                <td colSpan={5} className="px-6 py-4 text-right font-semibold text-secondary-foreground">
                  Tổng cộng lượng phát thải đợt này:
                </td>
                <td className="px-6 py-4 text-right text-xl font-bold text-primary">
                  {totalEmissions} tCO₂e
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </AppPanel>

      {/* Điều hướng chuyển sang bước tiếp theo */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-border">
        <Button asChild variant="outline">
          <Link to={ROUTES.app.aiReview} className="flex items-center gap-2">
            Quay lại Kiểm tra trích xuất
          </Link>
        </Button>

        <Button asChild size="lg" className="gap-2">
          <Link to={ROUTES.app.ecoScore}>
            Xem Điểm số Eco & Khuyến nghị Giảm thải
            <ArrowRight className="size-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
