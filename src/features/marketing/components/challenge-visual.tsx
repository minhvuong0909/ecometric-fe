import { Factory, Zap, Truck, Search, Leaf, ChartColumn, ArrowUpRight, Droplets, Fuel } from "lucide-react";

const DOCUMENT_SOURCES = [
  { icon: Zap, label: "Điện" },
  { icon: Droplets, label: "Nước" },
  { icon: Fuel, label: "Nhiên liệu" },
  { icon: Truck, label: "Logistics" },
];
const SCOPES = [
  { icon: Factory, scope: "Scope 1", text: "Phát thải trực tiếp" },
  { icon: Zap, scope: "Scope 2", text: "Năng lượng mua vào" },
  { icon: Truck, scope: "Scope 3", text: "Chuỗi giá trị" },
];
const FACTOR_UNITS = [
  { label: "Điện", unit: "kgCO₂e / kWh" },
  { label: "Nhiên liệu", unit: "kgCO₂e / lít" },
  { label: "Vận chuyển", unit: "kgCO₂e / tấn.km" },
];
const REPORT_BAR_HEIGHTS = [28, 45, 38, 68, 86];

function DocumentsVisual() {
  return (
    <div className="workflow-art workflow-documents">
      <p className="workflow-art-eyebrow">Dữ liệu đầu vào</p>
      <h4>Nhiều chứng từ.<br />Một nơi tập hợp.</h4>
      <div className="workflow-document-tags">
        {DOCUMENT_SOURCES.map(({ icon: Icon, label }) => (
          <span key={label}><Icon aria-hidden="true" />{label}</span>
        ))}
      </div>
      <div className="workflow-document-crop">
        <img src="/images/workflow-01-documents.png" alt="Các tập hóa đơn và chứng từ hoạt động của doanh nghiệp" width={1200} height={1200} loading="lazy" />
      </div>
    </div>
  );
}

function ScopesVisual() {
  return (
    <div className="workflow-art workflow-scopes">
      <p className="workflow-art-eyebrow">Phân loại & đối chiếu</p>
      <div className="workflow-scope-layout">
        <div className="workflow-scope-list">
          {SCOPES.map(({ icon: Icon, scope, text }) => (
            <div className="workflow-scope-card" key={scope}>
              <Icon aria-hidden="true" />
              <div><strong>{scope}</strong><p>{text}</p></div>
            </div>
          ))}
        </div>
        <div className="workflow-factor-card">
          <h4><Search aria-hidden="true" />Hệ số phát thải</h4>
          {FACTOR_UNITS.map(({ label, unit }) => (
            <div key={label}><span>{label}</span><strong>{unit}</strong></div>
          ))}
          <p>Đối chiếu nguồn, năm và đơn vị trước khi tính toán.</p>
        </div>
      </div>
    </div>
  );
}

function ActionsVisual() {
  return (
    <div className="workflow-art workflow-actions">
      <p className="workflow-art-eyebrow">Từ kết quả đến ưu tiên</p>
      <div className="workflow-action-layout">
        <div className="workflow-report">
          <Leaf aria-hidden="true" />
          <h4>Kết quả kiểm kê</h4>
          <p>Phân tích theo nguồn<br />và kỳ báo cáo</p>
          <div className="workflow-report-bars" aria-hidden="true">
            {REPORT_BAR_HEIGHTS.map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}
          </div>
          <small>Minh họa báo cáo</small>
          <div className="workflow-report-lines" aria-hidden="true"><i /><i /><i /></div>
        </div>
        <div className="workflow-question-list">
          <div><ArrowUpRight aria-hidden="true" /><span>Bắt đầu từ đâu?</span></div>
          <div><Leaf aria-hidden="true" /><span>Ưu tiên nguồn<br />phát thải nào?</span></div>
          <div><ChartColumn aria-hidden="true" /><span>Cải thiện vận hành<br />ra sao?</span></div>
        </div>
      </div>
    </div>
  );
}

export function ChallengeVisual({ index }: { index: number }) {
  switch (index) {
    case 0: return <DocumentsVisual />;
    case 1: return <ScopesVisual />;
    default: return <ActionsVisual />;
  }
}
