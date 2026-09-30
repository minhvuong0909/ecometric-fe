import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  FileText,
  Download,
  Plus,
  Search,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  FileSpreadsheet,
  Share2,
  Trash2,
  Award,
  Globe,
  FileCheck,
  Zap,
  Loader2,
} from "lucide-react";
import { AppPageHeader } from "@/features/app/components/app-page-header";
import { AppPanel } from "@/features/app/components/app-panel";
import { MetricCard } from "@/features/app/components/metric-card";
import { REPORTS_COPY } from "@/features/app/constants/app-copy";
import {
  useCreateReport,
  useDeleteReport,
  useDownloadReport,
  useGenerateReport,
  useReports,
} from "@/features/app/hooks/use-reports";
import { useReportingPeriods } from "@/features/app/hooks/use-app-meta";
import { createReportingPeriod } from "@/features/app/api/meta.api";
import { useBusinessStore } from "@/shared/stores/business-store";
import type { ReportType } from "@/features/app/types/app.types";
import { Badge, badgeVariants } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils";
import type { VariantProps } from "class-variance-authority";

type ReportItem = {
  id: string;
  name: string;
  framework: string;
  period: string;
  date: string;
  size: string;
  format: "PDF" | "XLSX" | "JSON";
  status: "Sẵn sàng" | "Đã xuất" | "Bản nháp" | "Đang khởi tạo";
  downloads: number;
};

const INITIAL_REPORTS: ReportItem[] = [
  {
    id: "1",
    name: "Báo cáo Kiểm kê Carbon GHG Protocol 2026",
    framework: "GHG Protocol",
    period: "Q2 2026",
    date: "14/06/2026",
    size: "4.2 MB",
    format: "PDF",
    status: "Sẵn sàng",
    downloads: 12,
  },
  {
    id: "2",
    name: "Báo cáo Biến đổi Khí hậu CSRD (ESRS E1)",
    framework: "CSRD / ESRS E1",
    period: "Tháng 6 2026",
    date: "10/06/2026",
    size: "2.8 MB",
    format: "XLSX",
    status: "Đã xuất",
    downloads: 8,
  },
  {
    id: "3",
    name: "Báo cáo Công bố Rủi ro Khí hậu TCFD",
    framework: "TCFD Standard",
    period: "Năm 2025",
    date: "01/05/2026",
    size: "5.1 MB",
    format: "PDF",
    status: "Sẵn sàng",
    downloads: 24,
  },
  {
    id: "4",
    name: "Báo cáo Phát thải theo Chi nhánh (Draft)",
    framework: "ISO 14064-1",
    period: "Q1 2026",
    date: "28/04/2026",
    size: "1.5 MB",
    format: "PDF",
    status: "Bản nháp",
    downloads: 0,
  },
];

const REPORT_TEMPLATES: Array<{
  id: string;
  title: string;
  tag: string;
  badgeVariant: VariantProps<typeof badgeVariants>["variant"];
  desc: string;
  icon: typeof ShieldCheck;
  framework: string;
}> = [
  {
    id: "ghg",
    title: "Báo cáo GHG Protocol",
    tag: "Khuyên dùng",
    badgeVariant: "success",
    desc: "Báo cáo tiêu chuẩn quốc tế cho Phạm vi 1, 2, 3 sẵn sàng cho bên thứ ba thẩm định và kiểm toán.",
    icon: ShieldCheck,
    framework: "GHG Corporate Standard",
  },
  {
    id: "csrd",
    title: "Báo cáo CSRD (ESRS E1)",
    tag: "Bắt buộc EU",
    badgeVariant: "info",
    desc: "Đáp ứng chỉ thị báo cáo bền vững doanh nghiệp Châu Âu cho các doanh nghiệp có chuỗi cung ứng toàn cầu.",
    icon: Globe,
    framework: "EU ESRS E1 Climate Change",
  },
  {
    id: "tcfd",
    title: "Công bố Rủi ro TCFD",
    tag: "Tài chính & ĐT",
    badgeVariant: "accent",
    desc: "Đánh giá rủi ro tài chính và cơ hội chuyển đổi carbon thấp dành cho hội đồng quản trị và nhà đầu tư.",
    icon: Award,
    framework: "TCFD Recommendations",
  },
  {
    id: "iso",
    title: "Tiêu chuẩn ISO 14064",
    tag: "Kiểm toán độc lập",
    badgeVariant: "warning",
    desc: "Cấu trúc định lượng và báo cáo phát thải khí nhà kính đáp ứng tiêu chuẩn chứng nhận ISO.",
    icon: FileCheck,
    framework: "ISO 14064-1:2018",
  },
];

const STATUS_VARIANTS: Record<ReportItem["status"], VariantProps<typeof badgeVariants>["variant"]> = {
  "Sẵn sàng": "success",
  "Đã xuất": "info",
  "Bản nháp": "neutral",
  "Đang khởi tạo": "warning",
};

export function ReportsPage() {
  const copy = REPORTS_COPY;
  const { activeBusinessId } = useBusinessStore();

  const { data: reportsData, refetch: refetchReports } = useReports(activeBusinessId);
  const { data: periodsData } = useReportingPeriods(activeBusinessId);

  const createReportMutation = useCreateReport();
  const generateReportMutation = useGenerateReport();
  const downloadReportMutation = useDownloadReport();
  const deleteReportMutation = useDeleteReport();

  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("Tất cả");
  const [searchTerm, setSearchTerm] = useState("");
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  // Map dữ liệu từ API hoặc fallback INITIAL_REPORTS
  const reports: ReportItem[] = useMemo(() => {
    if (reportsData && reportsData.items.length > 0) {
      return reportsData.items.map((r) => {
        let status: ReportItem["status"] = "Bản nháp";
        if (r.status === "COMPLETED") status = "Sẵn sàng";
        else if (r.status === "GENERATING") status = "Đang khởi tạo";

        const framework =
          r.type === "GHG_PROTOCOL"
            ? "GHG Protocol"
            : r.type === "CSRD_ESRS_E1"
            ? "CSRD / ESRS E1"
            : r.type === "ISO_14064"
            ? "ISO 14064"
            : "Tổng hợp ESG";

        return {
          id: r.id,
          name: r.title,
          framework,
          period: "Năm 2026",
          date: r.createdAt ? new Date(r.createdAt).toLocaleDateString("vi-VN") : "Gần đây",
          size: "2.5 MB",
          format: "PDF",
          status,
          downloads: 1,
        };
      });
    }
    return INITIAL_REPORTS;
  }, [reportsData]);

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.framework.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatusFilter === "Tất cả" || report.status === selectedStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleGenerateReport = async (templateTitle: string, templateId: string) => {
    if (!activeBusinessId) {
      toast.error("Vui lòng chọn doanh nghiệp trước khi khởi tạo báo cáo");
      return;
    }

    setGeneratingId(templateId);
    toast.loading(`Đang khởi tạo ${templateTitle}...`, { id: "gen-toast" });

    try {
      let periodId = periodsData?.items?.[0]?.id;
      if (!periodId) {
        const newPeriod = await createReportingPeriod({
          businessId: activeBusinessId,
          name: "Năm 2026",
          startDate: new Date("2026-01-01T00:00:00.000Z").toISOString(),
          endDate: new Date("2026-12-31T23:59:59.000Z").toISOString(),
        });
        periodId = newPeriod.id;
      }

      let type: ReportType = "GHG_PROTOCOL";
      if (templateId === "csrd") type = "CSRD_ESRS_E1";
      else if (templateId === "iso") type = "ISO_14064";
      else if (templateId === "tcfd") type = "INTERNAL_SUMMARY";

      const created = await createReportMutation.mutateAsync({
        businessId: activeBusinessId,
        reportingPeriodId: periodId,
        title: `${templateTitle} - ${new Date().toLocaleDateString("vi-VN")}`,
        type,
      });

      await generateReportMutation.mutateAsync(created.id);
      await refetchReports();
      toast.success(`Khởi tạo ${templateTitle} thành công! Worker đang biên soạn dữ liệu.`, { id: "gen-toast" });
    } catch (err: any) {
      toast.error(err?.message || "Khởi tạo báo cáo thất bại", { id: "gen-toast" });
    } finally {
      setGeneratingId(null);
    }
  };

  const handleDownload = async (reportId: string, name: string) => {
    toast.loading(`Đang tải file ${name}...`, { id: "dl-toast" });
    try {
      if (reportId === "sample" || reportId === "latest" || !reportsData?.items?.some((r) => r.id === reportId)) {
        toast.info("Đã xuất bản mẫu báo cáo tiêu chuẩn.", { id: "dl-toast" });
        return;
      }
      await downloadReportMutation.mutateAsync({ id: reportId, fileName: `${name}.json` });
      toast.success(`Tải file ${name} thành công!`, { id: "dl-toast" });
    } catch (err: any) {
      toast.error(err?.message || "Tải xuống thất bại", { id: "dl-toast" });
    }
  };

  const handleDeleteReport = async (id: string, name: string) => {
    try {
      await deleteReportMutation.mutateAsync(id);
      toast.success(`Đã xóa báo cáo ${name}`);
    } catch (err: any) {
      toast.error(err?.message || "Xóa báo cáo thất bại");
    }
  };


  return (
    <div className="space-y-8">
      <AppPageHeader
        breadcrumbs={copy.breadcrumbs}
        title="Trung tâm Báo cáo Phát thải ESG"
        description="Khởi tạo, tự động định dạng và xuất các báo cáo kiểm kê carbon tuân thủ các chuẩn báo cáo quốc tế hàng đầu."
        actions={
          <Button
            onClick={() => handleGenerateReport("Báo cáo ESG Tổng hợp", "global")}
            className="bg-primary text-primary-foreground font-bold hover:bg-primary/95 shadow-md gap-2"
          >
            <Plus className="size-4" />
            Khởi tạo báo cáo mới
          </Button>
        }
      />

      {/* Thẻ Thống kê Trung tâm Báo cáo */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={FileText}
          label="Tổng báo cáo đã xuất"
          value={`${reports.length} báo cáo`}
          hint="Lưu trữ an toàn trên Sổ cái ESG"
        />

        <MetricCard
          icon={ShieldCheck}
          label="Tiêu chuẩn báo cáo hỗ trợ"
          value="4 khung chuẩn"
          hint="GHG Protocol, CSRD, TCFD, ISO"
          hintClassName="text-emerald-600 dark:text-emerald-400 font-semibold"
        />

        <MetricCard
          icon={Zap}
          label="Định dạng xuất"
          value="PDF, XLSX"
          hint="Tự động kết xuất báo cáo"
          hintClassName="text-primary font-semibold"
        />

        <MetricCard
          icon={Award}
          label="Trạng thái tuân thủ"
          value="Sẵn sàng kiểm toán"
          hint="Theo chuẩn GHG Protocol, ISO 14064"
          hintClassName="text-blue-600 dark:text-blue-400 font-semibold"
        />
      </div>

      {/* Header Banner: Các Khung Tiêu chuẩn Báo cáo */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="size-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary uppercase tracking-wide">
                  Kết xuất tự động
                </span>
                <h3 className="text-base font-bold text-foreground">Xuất báo cáo đa định dạng chuẩn kiểm toán</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                EcoMetric hỗ trợ tự động bóc tách và tổng hợp dữ liệu carbon thành các file PDF đồ họa sắc nét hoặc bản tính toán Excel hỗ trợ kiểm toán viên.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {["GHG Protocol", "CSRD ESRS", "TCFD", "ISO 14064"].map((std) => (
              <span
                key={std}
                className="rounded-md bg-muted px-3 py-1 text-xs font-medium text-muted-foreground border border-border"
              >
                {std}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Grid 4 Mẫu Báo cáo Tiêu chuẩn */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-secondary-foreground flex items-center gap-2">
          <FileCheck className="size-5 text-primary" />
          Chọn mẫu báo cáo cần khởi tạo
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {REPORT_TEMPLATES.map((tmpl) => {
            const Icon = tmpl.icon;
            const isGen = generatingId === tmpl.id;

            return (
              <AppPanel
                key={tmpl.id}
                className="flex flex-col justify-between space-y-4 hover:border-primary/50 transition-all duration-200 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/15 transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                      <Icon className="size-5" />
                    </div>
                    <Badge variant={tmpl.badgeVariant} className="uppercase">
                      {tmpl.tag}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-secondary-foreground group-hover:text-primary transition-colors">
                      {tmpl.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {tmpl.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-border">
                  <Button
                    type="button"
                    onClick={() => handleGenerateReport(tmpl.title, tmpl.id)}
                    disabled={isGen}
                    variant="outline"
                    size="sm"
                    className="w-full font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-all gap-1.5"
                  >
                    {isGen ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin" />
                        Đang khởi tạo...
                      </>
                    ) : (
                      "Khởi tạo ngay"
                    )}
                  </Button>
                </div>
              </AppPanel>
            );
          })}
        </div>
      </div>

      {/* Bảng Báo cáo Gần đây & Preview Panel */}
      <div className="grid gap-6 lg:grid-cols-3">
        <AppPanel
          title="Lịch sử xuất báo cáo gần đây"
          className="lg:col-span-2"
          bodyClassName="p-0"
        >
          {/* Toolbar Tìm kiếm & Filter */}
          <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm tên báo cáo..."
                className="pl-9"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {["Tất cả", "Sẵn sàng", "Đã xuất", "Bản nháp"].map((status) => {
                const active = selectedStatusFilter === status;
                return (
                  <button
                    type="button"
                    key={status}
                    onClick={() => setSelectedStatusFilter(status)}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-semibold transition-colors focus-ring",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Table Báo cáo */}
          {filteredReports.length === 0 ? (
            <p className="p-10 text-center text-sm text-muted-foreground">
              Không tìm thấy báo cáo nào phù hợp.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-6 py-3.5 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                      Tên báo cáo
                    </th>
                    <th className="px-6 py-3.5 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                      Kỳ báo cáo
                    </th>
                    <th className="px-6 py-3.5 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                      Ngày khởi tạo
                    </th>
                    <th className="px-6 py-3.5 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3.5 text-right text-xs font-bold tracking-wide text-muted-foreground uppercase">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report) => {
                    return (
                      <tr
                        key={report.id}
                        className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/15">
                              {report.format === "PDF" ? (
                                <FileText className="size-4" />
                              ) : (
                                <FileSpreadsheet className="size-4" />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-foreground">{report.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {report.framework} • {report.size}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 font-semibold text-muted-foreground">
                          {report.period}
                        </td>

                        <td className="px-6 py-4 text-muted-foreground">
                          {report.date}
                        </td>

                        <td className="px-6 py-4">
                          <Badge variant={STATUS_VARIANTS[report.status]} className="font-bold">
                            {report.status}
                          </Badge>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(report.id, report.name)}
                              className="gap-1 text-xs font-semibold"
                            >
                              <Download className="size-3.5" />
                              Tải về
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              title="Chia sẻ"
                              onClick={() => toast.info(`Đã sao chép link chia sẻ ${report.name}`)}
                            >
                              <Share2 className="size-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="text-muted-foreground hover:text-destructive"
                              title="Xóa"
                              onClick={() => handleDeleteReport(report.id, report.name)}
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </AppPanel>

        {/* Panel Xem trước & Cấu trúc Báo cáo */}
        <AppPanel title="Cấu trúc Báo cáo Chuẩn" className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-inner">
            <div className="flex items-center gap-3 border-b border-border pb-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary border border-primary/25 font-bold text-sm">
                PDF
              </div>
              <div>
                <h4 className="text-xs font-bold text-secondary-foreground">Cấu trúc Hồ sơ Báo cáo</h4>
                <p className="text-[11px] text-muted-foreground">Chuẩn ISO 14064-1 & GHG Protocol</p>
              </div>
            </div>

            <ul className="space-y-2 text-xs text-muted-foreground">
              {copy.previewSections.map((section, idx) => (
                <li key={section} className="flex items-center gap-2">
                  <span className="flex size-4 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-foreground">{section}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 space-y-2">
            <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
              Chữ ký số & Xác thực Hash
            </p>
            <p className="text-[11px] text-emerald-900/80 dark:text-emerald-400/70 leading-relaxed">
              Mỗi báo cáo được cấp mã Hash SHA-256 duy nhất trên Sổ cái EcoMetric nhằm tránh giả mạo dữ liệu.
            </p>
          </div>

          <Button
            onClick={() => handleDownload("sample", "Bao_cao_Chuan_GHG_Protocol")}
            className="w-full bg-primary text-primary-foreground font-bold shadow-md gap-2"
          >
            <Download className="size-4" />
            Tải mẫu Báo cáo PDF (Bản đầy đủ)
          </Button>
        </AppPanel>
      </div>
    </div>
  );
}
