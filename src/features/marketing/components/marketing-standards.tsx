import { Fuel, Truck, Zap } from "lucide-react";
const sources = [
  { icon: Zap, title: "Điện năng", description: "Theo dõi lượng điện sử dụng từ hóa đơn và số liệu hoạt động." },
  { icon: Fuel, title: "Nhiên liệu", description: "Ghi nhận nhiên liệu phục vụ vận hành và sản xuất." },
  { icon: Truck, title: "Vận chuyển", description: "Tập hợp dữ liệu vận chuyển cho kỳ kiểm kê của doanh nghiệp." },
];
export function MarketingStandards() {
  return <section className="home-sources" aria-label="Dữ liệu hoạt động doanh nghiệp"><div className="home-container home-source-grid">{sources.map(({ icon: Icon, title, description }) => <div key={title} className="home-source"><Icon size={25} aria-hidden /><div><h2>{title}</h2><p>{description}</p></div></div>)}</div></section>;
}
