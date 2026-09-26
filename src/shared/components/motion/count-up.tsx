import { useEffect, useRef, useState } from "react";

type CountUpProps = {
  /** Giá trị kết thúc (số hoặc chuỗi có số) */
  value: number | string;
  /** Thời lượng chạy hiệu ứng (ms) */
  duration?: number;
  /** Số chữ số sau dấu phẩy */
  decimals?: number;
  /** Tiền tố (vd: "$") */
  prefix?: string;
  /** Hậu tố (vd: " t", " kg", "%") */
  suffix?: string;
  /** Định dạng có dấu phân cách hàng nghìn (1,000) */
  separator?: boolean;
  className?: string;
};

/**
 * Hiệu ứng chạy số từ 0 đến giá trị đích khi cuộn vào viewport.
 * Sử dụng requestAnimationFrame với hàm gia tốc easeOutExpo.
 */
export function CountUp({
  value,
  duration = 1400,
  decimals,
  prefix = "",
  suffix = "",
  separator = true,
  className,
}: CountUpProps) {
  // Trích xuất số thực từ value (vd: "150+" -> 150, "2,850.5" -> 2850.5)
  const numericValue = typeof value === "number" ? value : parseFloat(String(value).replace(/[^0-9.-]+/g, "")) || 0;
  
  // Tự động suy ra số chữ số thập phân nếu chưa chỉ định
  const inferredDecimals =
    decimals !== undefined
      ? decimals
      : String(value).includes(".")
      ? String(value).split(".")[1]?.replace(/[^0-9]/g, "").length ?? 0
      : 0;

  const [displayValue, setDisplayValue] = useState(0);
  const containerRef = useRef<HTMLSpanElement>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setDisplayValue(numericValue);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          observer.disconnect();

          let startTime: number | null = null;

          const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // Ease Out Expo: 1 - pow(2, -10 * progress)
            const easeOutProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = easeOutProgress * numericValue;

            setDisplayValue(current);

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setDisplayValue(numericValue);
            }
          };

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [numericValue, duration]);

  const formattedNumber = separator
    ? displayValue.toLocaleString("vi-VN", {
        minimumFractionDigits: inferredDecimals,
        maximumFractionDigits: inferredDecimals,
      })
    : displayValue.toFixed(inferredDecimals);

  return (
    <span ref={containerRef} className={className}>
      {prefix}
      {formattedNumber}
      {suffix}
    </span>
  );
}
