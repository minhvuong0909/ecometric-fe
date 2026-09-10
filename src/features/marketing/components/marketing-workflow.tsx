import { ArrowRight, Bot, FileSpreadsheet, FileUp, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/components/ui/button";

export function MarketingWorkflow() {
  const steps = [
    {
      step: "01",
      title: "Tải lên Hóa đơn & Chứng từ",
      desc: "Kéo thả ảnh chụp hoặc file PDF hóa đơn tiền điện EVN, hóa đơn xăng dầu Petrolimex, nước hoặc phiếu nhiên liệu. Không cần nhập tay thủ công.",
      icon: FileUp,
      tag: "OCR Thông minh",
    },
    {
      step: "02",
      title: "AI Bóc tách & Tính toán",
      desc: "Trí tuệ nhân tạo nhận diện số kWh, lít xăng, khối nước và tự động tra cứu hệ số phát thải (EF) Việt Nam theo chuẩn GHG Protocol Scope 1, 2, 3.",
      icon: Bot,
      tag: "Chuẩn xác 99.4%",
    },
    {
      step: "03",
      title: "Xuất Báo cáo & Lộ trình Giảm",
      desc: "Nhận hồ sơ kiểm kê sẵn sàng nộp cho đối tác kiểm toán, ngân hàng xanh hoặc đối tác quốc tế (CBAM). Kèm khuyến nghị tiết kiệm chi phí năng lượng.",
      icon: FileSpreadsheet,
      tag: "Sẵn sàng Kiểm toán",
    },
  ];

  return (
    <section id="workflow" className="scroll-mt-16 bg-card py-24 border-b border-border/80">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
            <Sparkles className="size-3.5" />
            Đơn giản hóa cho doanh nghiệp SME
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Kiểm Kê Khí Nhà Kính Chỉ Trong 3 Bước
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Doanh nghiệp không cần thuê chuyên gia môi trường đắt đỏ hay loay hoay với hàng trăm bảng tính Excel phức tạp.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-background p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl"
              >
                {/* Step badge */}
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-primary/25 group-hover:text-primary transition-colors">
                    {item.step}
                  </span>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">
                    {item.tag}
                  </span>
                </div>

                <div className="my-6 space-y-3">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                </div>

                {index < steps.length - 1 ? (
                  <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                    <div className="flex size-8 items-center justify-center rounded-full bg-card border border-border text-muted-foreground shadow-sm">
                      <ArrowRight className="size-4" />
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Button
            asChild
            size="lg"
            className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 font-bold text-white shadow-lg shadow-emerald-600/20 hover:from-emerald-700 hover:to-teal-700"
          >
            <Link to={ROUTES.register}>
              Trải nghiệm thử quy trình ngay
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
