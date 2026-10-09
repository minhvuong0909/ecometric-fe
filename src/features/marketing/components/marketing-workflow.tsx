import { FileCheck2, FileUp, ChartColumn } from "lucide-react";
import { Reveal } from "@/shared/components/reveal";
const steps = [
  { icon: FileUp, title: "Tập hợp dữ liệu", description: "Nhập dữ liệu hoạt động hoặc tải chứng từ. Tổ chức theo nguồn, cơ sở và kỳ kiểm kê." },
  { icon: FileCheck2, title: "Kiểm tra và tính toán", description: "Rà soát số liệu, đơn vị và hệ số phát thải trước khi sử dụng kết quả tính toán." },
  { icon: ChartColumn, title: "Theo dõi và báo cáo", description: "Xem nguồn phát thải lớn, so sánh theo kỳ và kiểm tra báo cáo trước khi xuất." },
];
export function MarketingWorkflow() {
  return <section id="workflow" className="home-section scroll-mt-20"><div className="home-container"><Reveal className="home-section-heading"><h2>Một quy trình rõ ràng.<br />Từ dữ liệu đến quyết định.</h2><p>Giữ chứng từ và kết quả trong cùng một không gian làm việc, để đội ngũ dễ theo dõi và đối chiếu.</p></Reveal><ol className="home-process">{steps.map(({ icon: Icon, title, description }, index) => <li key={title}><Reveal delay={index * 100}><div className="home-step-head"><span>{index + 1}</span><Icon size={24} aria-hidden /></div><h3>{title}</h3><p>{description}</p></Reveal></li>)}</ol></div></section>;
}
