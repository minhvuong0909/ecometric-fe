import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import {
  Upload,
  FileText,
  FileSpreadsheet,
  FileCode,
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Trash2,
  RefreshCw,
  Eye,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { AppPageHeader } from "@/features/app/components/app-page-header";
import { AppPanel } from "@/features/app/components/app-panel";
import { MetricCard } from "@/features/app/components/metric-card";
import { UPLOAD_DOC_COPY } from "@/features/app/constants/app-copy";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils";

type FileItem = {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
  status: "Chờ kiểm tra" | "Đã trích xuất" | "Cần xác nhận" | "Lỗi";
  confidence?: string;
};

const INITIAL_FILES: FileItem[] = [
  {
    id: "1",
    name: "hoa-don-dien-t6.pdf",
    type: "Hóa đơn tiền điện",
    size: "2.4 MB",
    date: "14/06/2026",
    status: "Chờ kiểm tra",
    confidence: "92%",
  },
  {
    id: "2",
    name: "nhien-lieu-xe-tai.xlsx",
    type: "Biên lai nhiên liệu",
    size: "1.1 MB",
    date: "13/06/2026",
    status: "Đã trích xuất",
    confidence: "98%",
  },
  {
    id: "3",
    name: "van-tai-q2.pdf",
    type: "Báo cáo vận tải",
    size: "3.8 MB",
    date: "12/06/2026",
    status: "Cần xác nhận",
    confidence: "85%",
  },
  {
    id: "4",
    name: "chat-thai-thang-6.csv",
    type: "Báo cáo chất thải",
    size: "450 KB",
    date: "11/06/2026",
    status: "Lỗi",
  },
];

const STATUS_CONFIG: Record<
  FileItem["status"],
  { label: string; className: string; icon: typeof CheckCircle2 }
> = {
  "Đã trích xuất": {
    label: "Đã trích xuất",
    className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    icon: CheckCircle2,
  },
  "Cần xác nhận": {
    label: "Cần xác nhận",
    className: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    icon: AlertTriangle,
  },
  "Chờ kiểm tra": {
    label: "Chờ kiểm tra",
    className: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    icon: Clock,
  },
  Lỗi: {
    label: "Lỗi trích xuất",
    className: "bg-red-500/10 text-red-700 border-red-500/20",
    icon: AlertTriangle,
  },
};

export function UploadDocPage() {
  const copy = UPLOAD_DOC_COPY;
  const navigate = useNavigate();

  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);
  const [selectedCategory, setSelectedCategory] = useState("Hóa đơn tiền điện");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("Tất cả");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Lọc danh sách tệp tin
  const filteredFiles = files.filter((file) => {
    const matchesSearch =
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatusFilter === "Tất cả" || file.status === selectedStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSimulateUpload = () => {
    setIsUploading(true);
    toast.loading("Đang tải tệp lên hệ thống và gửi mô hình AI bóc tách...", { id: "upload-toast" });

    setTimeout(() => {
      const newFile: FileItem = {
        id: Date.now().toString(),
        name: `hoa-don-${selectedCategory.toLowerCase().replace(/\s+/g, "-")}-moi.pdf`,
        type: selectedCategory,
        size: "1.8 MB",
        date: "Hôm nay",
        status: "Chờ kiểm tra",
        confidence: "95%",
      };
      setFiles((prev) => [newFile, ...prev]);
      setIsUploading(false);
      toast.success("Tải tệp thành công! AI đã sẵn sàng trích xuất.", { id: "upload-toast" });
    }, 1200);
  };

  const handleDeleteFile = (id: string, name: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    toast.success(`Đã xóa tệp ${name}`);
  };

  return (
    <div className="space-y-8">
      <AppPageHeader
        breadcrumbs={copy.breadcrumbs}
        title="Tải lên Tài liệu & Hóa đơn"
        description={copy.description}
      />

      {/* Thanh tiến trình luồng xử lý */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md">
              1
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary">Bước 1 / 3</p>
              <h2 className="text-sm font-bold text-secondary-foreground">Tải lên chứng từ & Hóa đơn</h2>
            </div>
          </div>

          <div className="hidden h-px flex-1 bg-border md:block mx-4" />

          <div className="flex items-center gap-3 opacity-60">
            <span className="flex size-9 items-center justify-center rounded-xl bg-muted text-muted-foreground font-bold text-sm">
              2
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Bước 2</p>
              <h2 className="text-sm font-bold text-muted-foreground">AI Trích xuất & Xác nhận</h2>
            </div>
          </div>

          <div className="hidden h-px flex-1 bg-border md:block mx-4" />

          <div className="flex items-center gap-3 opacity-60">
            <span className="flex size-9 items-center justify-center rounded-xl bg-muted text-muted-foreground font-bold text-sm">
              3
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Bước 3</p>
              <h2 className="text-sm font-bold text-muted-foreground">Tính toán lượng CO₂e</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Các thẻ thống kê nhanh */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={FileText}
          label="Tổng tài liệu đã tải"
          value={`${files.length} tệp`}
          hint="Bao gồm PDF, Excel & Ảnh chứng từ"
        />
        <MetricCard
          icon={CheckCircle2}
          label="Đã trích xuất thành công"
          value={`${files.filter((f) => f.status === "Đã trích xuất").length} tệp`}
          hint="Sẵn sàng chuyển thành dữ liệu phát thải"
          hintClassName="text-emerald-600 font-semibold"
        />
        <MetricCard
          icon={AlertTriangle}
          label="Cần xác nhận thủ công"
          value={`${files.filter((f) => f.status === "Cần xác nhận" || f.status === "Chờ kiểm tra").length} tệp`}
          hint="Biến động lớn hoặc chưa duyệt"
          hintClassName="text-amber-600 font-semibold"
        />
        <MetricCard
          icon={Sparkles}
          label="Độ chính xác AI trung bình"
          value="95.4%"
          hint="Mô hình EcoMetric OCR v2.4"
          hintClassName="text-primary font-semibold"
        />
      </div>

      {/* Khu vực Upload tệp & Bảng AI Side Panel */}
      <div className="grid gap-6 lg:grid-cols-3">
        <AppPanel className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-secondary-foreground flex items-center gap-2">
              <Upload className="size-5 text-primary" />
              Khu vực tải tài liệu
            </h2>
            <span className="text-xs font-medium text-muted-foreground">Hỗ trợ tối đa 25MB / file</span>
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              handleSimulateUpload();
            }}
            className={cn(
              "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-200 cursor-pointer group",
              isDragOver
                ? "border-primary bg-primary/5 scale-[1.01]"
                : "border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50",
            )}
          >
            <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
              <Upload className="size-8" />
            </div>

            <h3 className="text-lg font-bold text-secondary-foreground">
              {copy.uploadTitle}
            </h3>
            <p className="mt-2 max-w-md text-xs text-muted-foreground leading-relaxed">
              {copy.uploadHint}
            </p>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {["PDF", "PNG", "JPG", "XLSX", "CSV"].map((ext) => (
                <span
                  key={ext}
                  className="rounded-md border border-border bg-background px-2.5 py-1 text-[10px] font-bold text-muted-foreground uppercase"
                >
                  {ext}
                </span>
              ))}
            </div>

            <Button
              type="button"
              onClick={handleSimulateUpload}
              disabled={isUploading}
              className="mt-6 bg-primary text-primary-foreground font-bold hover:bg-primary/95 shadow-md px-6"
            >
              {isUploading ? "Đang tải lên..." : "Chọn tệp tin từ máy tính"}
            </Button>
          </div>

          {/* Chọn Loại Tài liệu trước khi tải */}
          <div className="space-y-3 pt-2 border-t border-border">
            <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
              Phân loại danh mục tài liệu tải lên
            </p>
            <div className="flex flex-wrap gap-2">
              {copy.docTypes.map((type) => {
                const isActive = selectedCategory === type;
                return (
                  <button
                    type="button"
                    key={type}
                    onClick={() => setSelectedCategory(type)}
                    className={cn(
                      "rounded-lg px-3.5 py-2 text-xs font-semibold transition-all duration-150 border focus-ring",
                      isActive
                        ? "bg-secondary-foreground text-primary-foreground border-secondary-foreground shadow-sm"
                        : "bg-muted/60 text-muted-foreground border-border hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>
        </AppPanel>

        {/* Panel AI Engine & Action */}
        <div className="space-y-6">
          <AppPanel className="bg-gradient-to-br from-secondary-foreground to-slate-900 text-white space-y-5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 rounded-full bg-accent/20 px-3 py-1 text-xs font-bold text-accent border border-accent/30">
                <Sparkles className="size-3.5" />
                Mô hình AI bóc tách
              </span>
              <span className="text-[11px] font-medium text-slate-300">v2.4 Pro</span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">AI Engine đã sẵn sàng</h3>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                Tự động nhận diện thông tin hóa đơn tiền điện (EVN), hóa đơn xăng dầu, dịch vụ vận tải và lập sổ cái carbon.
              </p>
            </div>

            <div className="space-y-3 border-t border-white/10 pt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-emerald-400" />
                  Độ chính xác nhận diện:
                </span>
                <span className="font-bold text-emerald-400">99.2%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Zap className="size-4 text-amber-400" />
                  Thời gian xử lý trung bình:
                </span>
                <span className="font-bold text-white">1.2 giây/file</span>
              </div>
            </div>

            <Button
              asChild
              className="w-full bg-accent text-accent-foreground font-bold hover:bg-accent/90 shadow-lg py-5"
            >
              <Link to={ROUTES.app.aiReview} className="flex items-center justify-center gap-2">
                Trích xuất & Kiểm tra bằng AI
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </AppPanel>

          <AppPanel title="Lưu ý khi tải lên">
            <ul className="space-y-3 text-xs text-muted-foreground leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span>Hóa đơn nên rõ nét, không bị mờ mã số đồng hồ hoặc tổng chi phí.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span>Bạn có thể chỉnh sửa lại dữ liệu trích xuất trước khi ghi chính thức.</span>
              </li>
            </ul>
          </AppPanel>
        </div>
      </div>

      {/* Bảng Danh sách Tệp tin đã Tải lên */}
      <AppPanel bodyClassName="p-0">
        {/* Toolbar lọc và tìm kiếm */}
        <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên file hoặc loại..."
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {["Tất cả", "Chờ kiểm tra", "Đã trích xuất", "Cần xác nhận", "Lỗi"].map((status) => {
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

        {/* Table View */}
        {filteredFiles.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">
            Không tìm thấy tệp tin phù hợp với bộ lọc.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-6 py-3.5 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                    Tên tệp tin
                  </th>
                  <th className="px-6 py-3.5 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                    Loại tài liệu
                  </th>
                  <th className="px-6 py-3.5 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                    Ngày tải lên
                  </th>
                  <th className="px-6 py-3.5 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                    Trạng thái AI
                  </th>
                  <th className="px-6 py-3.5 text-right text-xs font-bold tracking-wide text-muted-foreground uppercase">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((file) => {
                  const statusInfo = STATUS_CONFIG[file.status];
                  const StatusIcon = statusInfo.icon;
                  const isPdf = file.name.endsWith(".pdf");
                  const isExcel = file.name.endsWith(".xlsx") || file.name.endsWith(".csv");
                  const FileIconComponent = isPdf ? FileText : isExcel ? FileSpreadsheet : FileCode;

                  return (
                    <tr
                      key={file.id}
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/15">
                            <FileIconComponent className="size-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{file.size}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-medium text-foreground">
                        {file.type}
                      </td>

                      <td className="px-6 py-4 text-muted-foreground">
                        {file.date}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
                              statusInfo.className,
                            )}
                          >
                            <StatusIcon className="size-3.5" />
                            {statusInfo.label}
                          </span>
                          {file.confidence ? (
                            <span className="text-[11px] font-semibold text-muted-foreground">
                              ({file.confidence})
                            </span>
                          ) : null}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(ROUTES.app.aiReview)}
                            className="gap-1 text-xs"
                          >
                            <Eye className="size-3.5" />
                            Xem trích xuất
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            title="Tải lại"
                            onClick={() => toast.info(`Đang tải lại ${file.name}...`)}
                          >
                            <RefreshCw className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-muted-foreground hover:text-destructive"
                            title="Xóa"
                            onClick={() => handleDeleteFile(file.id, file.name)}
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
    </div>
  );
}
