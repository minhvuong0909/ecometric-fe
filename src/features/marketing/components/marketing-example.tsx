import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, FileText, Zap } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

const steps = [
  { title: "Hóa đơn điện", description: "Lấy lượng điện tiêu thụ trên chứng từ của kỳ kiểm kê. Sử dụng kWh, không dùng số tiền thanh toán." },
  { title: "Kiểm tra dữ liệu", description: "Đối chiếu lượng tiêu thụ, đơn vị và kỳ dữ liệu. Kiểm tra hệ số áp dụng trước khi tính." },
  { title: "Xem kết quả", description: "Quy đổi lượng điện thành phát thải Scope 2. Giữ lại chứng từ để đối chiếu với báo cáo." },
];
const exampleFactor = 0.5;
const format = new Intl.NumberFormat("vi-VN");

/** Educational example only. This factor is illustrative, not an official grid factor. */
export function MarketingExample() {
  const [step, setStep] = useState(0);
  const [kwh, setKwh] = useState(1000);
  const reduced = useReducedMotion();

  return (
    <section id="example" className="home-section home-example scroll-mt-20" aria-labelledby="electricity-example-title">
      <div className="home-container">
        <div className="home-section-heading">
          <h2 id="electricity-example-title">Một hóa đơn điện.<br />Một điểm bắt đầu cụ thể.</h2>
          <p>Chọn từng bước để xem dữ liệu hoạt động trở thành kết quả phát thải như thế nào.</p>
        </div>
        <div className="home-example-layout">
          <div>
            <div className="home-example-steps" aria-label="Chọn bước minh họa">
              {steps.map((item, index) => (
                <button key={item.title} type="button" aria-pressed={step === index} aria-controls="electricity-example-panel" onClick={() => setStep(index)}>
                  <span>{index + 1}</span><strong>{item.title}</strong><ArrowRight size={18} aria-hidden />
                </button>
              ))}
            </div>
            <p className="home-example-explanation">{steps[step].description}</p>
            <label className="home-example-select">Thử lượng điện khác
              <select value={kwh} onChange={(event) => setKwh(Number(event.target.value))}>
                {[500, 1000, 1500].map((value) => <option key={value} value={value}>{format.format(value)} kWh</option>)}
              </select>
            </label>
          </div>
          <div className="home-example-panel" id="electricity-example-panel" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={step} initial={reduced ? false : { opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={reduced ? undefined : { opacity: 0, x: -12 }} transition={{ duration: 0.2 }}>
                <div className="home-example-panel-heading">{step === 0 ? <FileText size={22} /> : step === 1 ? <Check size={22} /> : <Zap size={22} />}<h3>{steps[step].title}</h3><span>Ví dụ minh họa</span></div>
                {step === 0 ? <>
                  <p className="home-example-period">Chứng từ điện năng · Tháng minh họa</p>
                  <dl><div><dt>Nguồn hoạt động</dt><dd>Điện mua vào</dd></div><div><dt>Điện tiêu thụ</dt><dd>{format.format(kwh)} kWh</dd></div><div><dt>Dữ liệu cần ghi nhận</dt><dd>Lượng tiêu thụ và kỳ hóa đơn</dd></div></dl>
                </> : step === 1 ? <>
                  <dl><div><dt>Lượng tiêu thụ</dt><dd>{format.format(kwh)} kWh</dd></div><div><dt>Phạm vi</dt><dd>Scope 2</dd></div><div><dt>Hệ số giả định</dt><dd>0,5 kgCO₂e/kWh</dd></div></dl>
                  <p className="home-example-note">Trong thực tế, chọn hệ số phù hợp nguồn điện, năm dữ liệu và phương pháp kiểm kê.</p>
                </> : <>
                  <p className="home-example-period">Phát thải từ điện mua vào</p>
                  <p className="home-example-result">{format.format(kwh * exampleFactor)} <span>kgCO₂e</span></p>
                  <p className="home-example-equation">{format.format(kwh)} kWh × 0,5 kgCO₂e/kWh</p>
                  <p className="home-example-note">Kết quả thay đổi theo lượng tiêu thụ và hệ số được áp dụng.</p>
                </>}
              </motion.div>
            </AnimatePresence>
            <div className="home-example-controls"><Button variant="outline" size="sm" disabled={step === 0} onClick={() => setStep(step - 1)}><ArrowLeft size={15} />Trước</Button><span>{step + 1} / {steps.length}</span><Button variant="outline" size="sm" disabled={step === steps.length - 1} onClick={() => setStep(step + 1)}>Tiếp<ArrowRight size={15} /></Button></div>
          </div>
        </div>
        <p className="home-example-disclaimer">Số liệu và hệ số 0,5 được giả định để giải thích cách tính. Đây không phải hóa đơn thật, hệ số điện lưới chính thức hay báo cáo của khách hàng.</p>
      </div>
    </section>
  );
}
