import type { ReactNode } from "react";
import { AlertCircle, BarChart3, Loader2 } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/shared/components/ui/button";
import { ROUTES } from "@/shared/constants/routes";
export function ChartState({
  loading,
  error,
  empty,
  retry,
  children,
}: {
  loading: boolean;
  error: boolean;
  empty: boolean;
  retry: () => void;
  children: ReactNode;
}) {
  if (loading)
    return (
      <div
        role="status"
        className="flex min-h-60 items-center justify-center gap-2 text-sm text-muted-foreground"
      >
        <Loader2 className="size-4 animate-spin" />
        Đang tải dữ liệu…
      </div>
    );
  if (error)
    return (
      <div
        role="alert"
        className="flex min-h-60 flex-col items-center justify-center gap-3 text-sm text-muted-foreground"
      >
        <AlertCircle className="size-5" />
        <p>Không tải được dữ liệu biểu đồ.</p>
        <Button type="button" variant="outline" size="sm" onClick={retry}>
          Thử lại
        </Button>
      </div>
    );
  if (empty)
    return (
      <div className="flex min-h-60 flex-col items-center justify-center gap-3 text-center">
        <BarChart3 className="size-7 text-muted-foreground" />
        <p className="text-sm font-medium">Chưa có kết quả trong kỳ này</p>
        <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
          Thêm dữ liệu hoạt động hoặc chọn kỳ báo cáo khác để xem phát thải.
        </p>
        <Button asChild variant="outline" size="sm">
          <Link to={ROUTES.app.dataInput}>Nhập dữ liệu</Link>
        </Button>
      </div>
    );
  return children;
}
