import { motion, useReducedMotion } from "framer-motion";
import { Activity, Droplets, Leaf, Zap } from "lucide-react";

export function EcoBrandScene({ compact = false }: { compact?: boolean }) {
  const reduced = useReducedMotion();
  return (
    <div className={`eco-scene ${compact ? "eco-scene-compact" : ""}`}>
      <img
        src="/images/ecometric-carbon-core.png"
        alt="Lõi carbon EcoMetric: mầm xanh trong khối cầu kính kết nối dữ liệu môi trường"
        width="1024"
        height="1024"
        fetchPriority={compact ? "auto" : "high"}
      />
      <div className="eco-scene-orbit" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <motion.div
        className="eco-source eco-source-energy"
        initial={reduced ? false : { opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        <Zap size={18} />
        <div>
          <strong>Năng lượng</strong>
          <span>Dữ liệu đầu vào</span>
        </div>
        <i />
      </motion.div>
      <motion.div
        className="eco-source eco-source-water"
        initial={reduced ? false : { opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.7 }}
      >
        <Droplets size={18} />
        <div>
          <strong>Tài nguyên</strong>
          <span>Kết nối & chuẩn hóa</span>
        </div>
      </motion.div>
      <motion.div
        className="eco-result"
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.7 }}
      >
        <div className="eco-result-heading">
          <Leaf size={17} />
          <span>DẤU CHÂN CARBON</span>
          <Activity size={17} />
        </div>
        <div className="eco-result-value">
          CO₂e <span>Hiểu đúng. Giảm đúng.</span>
        </div>
        <div className="eco-mini-chart" aria-hidden="true">
          {[35, 58, 48, 76, 60, 43, 30, 22].map((height, i) => (
            <span
              key={i}
              style={{ height: `${height}%`, animationDelay: `${i * 90}ms` }}
            />
          ))}
        </div>
        <p>Minh họa luồng dữ liệu EcoMetric</p>
      </motion.div>
    </div>
  );
}
