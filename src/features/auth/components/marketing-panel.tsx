import { EcoBrandScene } from "@/shared/components/eco-brand-scene";
import { AUTH_COPY } from "@/features/auth/constants/auth-content";
import { cn } from "@/shared/lib/utils";

export function MarketingPanel({
  className,
  variant = "login",
}: {
  className?: string;
  variant?: "login" | "register";
}) {
  return (
    <aside
      className={cn(
        "eco-auth-showcase flex flex-col justify-center",
        className,
      )}
    >
      <div className="eco-eyebrow">
        <span /> DỮ LIỆU CỦA BẠN. TƯƠNG LAI XANH HƠN.
      </div>
      <h2>
        {variant === "login" ? (
          <>
            Hiểu dấu chân carbon.
            <br />
            <span>Mở lối tương lai xanh.</span>
          </>
        ) : (
          <>
            Bắt đầu hành trình
            <br />
            <span>chuyển đổi xanh.</span>
          </>
        )}
      </h2>
      <EcoBrandScene compact />
      {variant === "register" ? (
        <ol className="eco-auth-steps">
          {AUTH_COPY.registerMarketingPanel.steps.map((step, i) => (
            <li key={step.label}>
              <span>0{i + 1}</span>
              <strong>{step.title}</strong>
            </li>
          ))}
        </ol>
      ) : (
        <p className="eco-auth-caption">
          Kết nối dữ liệu hoạt động. Theo dõi phát thải.
          <br />
          Cùng doanh nghiệp tạo nên thay đổi bền vững.
        </p>
      )}
    </aside>
  );
}
