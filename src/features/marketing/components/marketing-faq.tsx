import { HelpCircle, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/shared/lib/utils";

export function MarketingFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Doanh nghiệp SME quy mô vừa và nhỏ có bắt buộc phải kiểm kê phát thải không?",
      a: "Theo Nghị định 06/2022/NĐ-CP và Quyết định 01/2022/QĐ-TTg, các cơ sở phát thải lớn bắt buộc kiểm kê. Tuy nhiên, nếu doanh nghiệp của bạn tham gia chuỗi cung ứng xuất khẩu (sang EU theo cơ chế CBAM, Mỹ, Nhật Bản) hoặc muốn tiếp cận vốn tín dụng xanh từ các ngân hàng, đối tác mua hàng sẽ yêu cầu cung cấp dữ liệu phát thải Scope 1, 2 và 3.",
    },
    {
      q: "Báo cáo xuất từ EcoMetric có giá trị pháp lý và được các bên kiểm toán chấp nhận không?",
      a: "Hoàn toàn có. Hệ thống tính toán của EcoMetric tuân thủ nghiêm ngặt theo GHG Protocol Corporate Standard và ISO 14064-1:2018, đồng thời sử dụng bộ hệ số phát thải lưới điện Việt Nam được công bố chính thức bởi Cục Biến đổi khí hậu (Bộ TN&MT). Báo cáo kèm theo bảng diễn giải nguồn dữ liệu minh bạch sẵn sàng phục vụ kiểm toán bên thứ ba.",
    },
    {
      q: "Doanh nghiệp chúng tôi chỉ có hóa đơn tiền điện giấy và phiếu xăng dầu viết tay thì có dùng được không?",
      a: "Có. Tính năng OCR AI của EcoMetric được huấn luyện đặc biệt trên các mẫu hóa đơn phổ biến tại Việt Nam (EVN, Petrolimex, hóa đơn nước, vé máy bay...). Bạn chỉ cần dùng điện thoại chụp ảnh hoặc quét scan tải lên, AI sẽ tự động đọc đúng lượng tiêu thụ mà không cần nhập tay.",
    },
    {
      q: "Dữ liệu chi phí và thông tin kinh doanh của doanh nghiệp được bảo mật như thế nào?",
      a: "Toàn bộ dữ liệu của doanh nghiệp được mã hóa đa lớp (AES-256) ở cả trạng thái lưu trữ và truyền tải. Chúng tôi cam kết tuyệt đối không chia sẻ dữ liệu kinh doanh của bạn cho bên thứ ba hoặc sử dụng vào mục đích thương mại ngoài phạm vi hỗ trợ kiểm kê của bạn.",
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
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
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
                className="rounded-2xl border border-border/80 bg-card transition-all duration-200 overflow-hidden shadow-sm hover:border-primary/30"
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
                  <div className="border-t border-border/40 px-5 pb-5 pt-3 text-sm leading-relaxed text-muted-foreground">
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
