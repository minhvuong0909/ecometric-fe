import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/shared/components/reveal";
export function MarketingFeatures() {
  return <section id="features" className="home-section home-product scroll-mt-20"><div className="home-container home-product-grid">
    <Reveal className="home-product-copy"><h2>Dữ liệu có thể đọc.<br />Kết quả có thể kiểm tra.</h2><p>Bảng điều khiển EcoMetric giúp đội ngũ nhìn thấy nguồn phát thải và biết dữ liệu nào cần bổ sung.</p><ul><li><Check size={18} />Phát thải theo thời gian và kỳ kiểm kê</li><li><Check size={18} />Nguồn phát thải xếp theo mức đóng góp</li><li><Check size={18} />So sánh Scope 1, 2 và 3 cùng đơn vị</li></ul><a href="#pricing" className="home-text-link">Chọn gói phù hợp <ArrowRight size={16} /></a></Reveal>
    <Reveal className="home-product-preview"><figure><div className="home-dashboard-crop"><img src="/images/ecometric-dashboard.png" alt="Màn hình EcoMetric hiển thị phát thải và biểu đồ từ tài khoản thử nghiệm" width="1265" height="712" loading="lazy" /></div><figcaption>Giao diện EcoMetric với dữ liệu tài khoản thử nghiệm. Kết quả phụ thuộc dữ liệu doanh nghiệp nhập vào.</figcaption></figure></Reveal>
  </div></section>;
}
