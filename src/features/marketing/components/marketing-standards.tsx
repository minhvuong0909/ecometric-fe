import { Award, CheckCircle2, FileCheck2, Globe2, ShieldCheck } from "lucide-react";

export function MarketingStandards() {
  const standards = [
    {
      title: "GHG Protocol",
      desc: "Phạm vi Scope 1, 2, 3",
      icon: Globe2,
    },
    {
      title: "ISO 14064-1:2018",
      desc: "Chuẩn định lượng quốc tế",
      icon: Award,
    },
    {
      title: "Nghị định 06/2022/NĐ-CP",
      desc: "Khung pháp lý KNK Việt Nam",
      icon: FileCheck2,
    },
    {
      title: "CBAM EU Ready",
      desc: "Sẵn sàng xuất khẩu châu Âu",
      icon: CheckCircle2,
    },
    {
      title: "Hệ số phát thải EF Bộ TN&MT",
      desc: "Cập nhật lưới điện Việt Nam",
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="border-y border-border/80 bg-muted/30 py-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">
          Tuân thủ các khung tiêu chuẩn kiểm kê carbon uy tín hàng đầu
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {standards.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <Icon className="size-4.5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-foreground">{item.title}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
