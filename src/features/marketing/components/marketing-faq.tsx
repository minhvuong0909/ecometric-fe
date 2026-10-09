import { HelpCircle, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/shared/lib/utils";

export function MarketingFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Nên chuẩn bị dữ liệu gì khi bắt đầu?",
      a: "Bắt đầu với hóa đơn điện, số liệu nhiên liệu và dữ liệu hoạt động trong kỳ kiểm kê. Tập hợp chứng từ theo cơ sở và thời gian để dễ đối chiếu khi nhập dữ liệu.",
    },
    {
      q: "Báo cáo xuất từ EcoMetric có giá trị pháp lý và được các bên kiểm toán chấp nhận không?",
      a: "EcoMetric hỗ trợ tập hợp dữ liệu và chuẩn bị báo cáo. Việc chấp nhận phụ thuộc yêu cầu của bên nhận và quá trình rà soát, xác minh. Doanh nghiệp cần kiểm tra phạm vi, hệ số và chứng từ trước khi sử dụng báo cáo chính thức.",
    },
    {
      q: "Doanh nghiệp chúng tôi chỉ có hóa đơn tiền điện giấy và phiếu xăng dầu viết tay thì có dùng được không?",
      a: "Bạn có thể tải ảnh hoặc tài liệu để trích xuất dữ liệu, hoặc nhập số liệu thủ công. Chất lượng nhận diện phụ thuộc chứng từ; hãy kiểm tra lượng tiêu thụ và đơn vị trước khi xác nhận.",
    },
    {
      q: "Biểu đồ trên trang chủ có phải kết quả của doanh nghiệp tôi không?",
      a: "Không. Ảnh trên trang chủ sử dụng dữ liệu tài khoản thử nghiệm để giới thiệu giao diện. Trong không gian làm việc, kết quả được tính từ dữ liệu hoạt động của doanh nghiệp bạn.",
    },
  ];

  return (
    <section id="faq" className="scroll-mt-16 bg-muted/20 py-24 border-t border-border/80">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
            <HelpCircle className="size-3.5" />
            Giải đáp thắc mắc
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Câu Hỏi Thường Gặp Của Doanh Nghiệp
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Những điều chủ doanh nghiệp và phụ trách ESG thường quan tâm nhất khi bắt đầu kiểm kê khí nhà kính.
          </p>
        </div>

        <div className="mt-12 space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.q}
                className="rounded-xl border border-border bg-card overflow-hidden shadow-sm transition-colors hover:border-primary/30"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left font-bold text-foreground hover:text-primary transition-colors"
                >
                  <span className="text-base">{faq.q}</span>
                  <ChevronDown
                    className={cn(
                      "size-5 shrink-0 text-muted-foreground transition-transform duration-200",
                      isOpen ? "rotate-180 text-primary" : "",
                    )}
                  />
                </button>
                {isOpen ? (
                  <div className="border-t border-border px-5 pb-5 pt-3 text-sm leading-relaxed text-muted-foreground">
                    {faq.a}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
