import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Copy,
  CreditCard,
  Loader2,
  Mail,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { AppPageHeader } from "@/features/app/components/app-page-header";
import { AppPanel } from "@/features/app/components/app-panel";
import { WizardStepper } from "@/features/app/components/wizard-stepper";
import { TextField } from "@/features/businesses/components/text-field";
import { ONBOARDING_COPY } from "@/features/businesses/constants/businesses-copy";
import { useSubscribeBusiness } from "@/features/businesses/hooks/use-subscribe-business";
import {
  subscribeBusinessFormSchema,
  type SubscribeBusinessFormValues,
} from "@/features/businesses/schemas/subscribe-business-schema";
import { PRICING_TIERS } from "@/features/marketing/constants/marketing-content";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { ROUTES } from "@/shared/constants/routes";
import { getApiErrorMessage } from "@/shared/lib/get-error-message";
import { cn } from "@/shared/lib/utils";

// TODO: thay bằng email kinh doanh thật trước khi lên production
const ENTERPRISE_SALES_EMAIL = "sales@ecometric.vn";
const ENTERPRISE_CONTACT_SUBJECT = "Tư vấn gói Enterprise - EcoMetric";
const BANK_ACCOUNT_NUMBER = "0071 0012 3456";

type PlanId = (typeof PRICING_TIERS)[number]["id"];
type Step = "plan" | "business" | "payment";
type PaymentMethod = "card" | "qr";

function formatPrice(monthlyPrice: number) {
  return monthlyPrice.toLocaleString("vi-VN");
}

function formatCardNumber(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 16);
  return (digits.match(/.{1,4}/g) ?? []).join(" ");
}

function formatExpiry(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  return digits.length <= 2 ? digits : `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(ONBOARDING_COPY.payment.copied);
  } catch {
    toast.error("Không thể sao chép. Vui lòng chọn và sao chép thủ công.");
  }
}

/** Mã QR minh hoạ (không phải mã thật) — chỉ để giao diện trông giống trang thanh toán thật. */
function FakeQrPattern({ seed }: { seed: string }) {
  const size = 21;
  const cells = useMemo(() => {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    const next = () => {
      h = (Math.imul(h, 1103515245) + 12345) >>> 0;
      return (h >>> 16) / 65535;
    };
    return Array.from({ length: size * size }, () => next() > 0.55);
  }, [seed]);

  const finders: [number, number][] = [
    [0, 0],
    [size - 7, 0],
    [0, size - 7],
  ];

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="size-full" role="img" aria-label="Mã QR thanh toán minh hoạ">
      <rect width={size} height={size} fill="white" />
      {cells.map((on, i) => {
        const x = i % size;
        const y = Math.floor(i / size);
        const insideFinder = finders.some(([fx, fy]) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7);
        if (!on || insideFinder) return null;
        return <rect key={i} x={x} y={y} width={1} height={1} fill="#111827" />;
      })}
      {finders.map(([fx, fy]) => (
        <g key={`${fx}-${fy}`}>
          <rect x={fx} y={fy} width={7} height={7} fill="#111827" />
          <rect x={fx + 1} y={fy + 1} width={5} height={5} fill="white" />
          <rect x={fx + 2} y={fy + 2} width={3} height={3} fill="#111827" />
        </g>
      ))}
    </svg>
  );
}

export function BusinessOnboardingPage() {
  const copy = ONBOARDING_COPY;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const subscribeMutation = useSubscribeBusiness();

  const planParam = searchParams.get("plan")?.toLowerCase();
  const initialPlan: PlanId = PRICING_TIERS.some((tier) => tier.id === planParam)
    ? (planParam as PlanId)
    : "starter";

  const [step, setStep] = useState<Step>("plan");
  const [selectedPlan, setSelectedPlan] = useState<PlanId>(initialPlan);
  const isEnterprise = selectedPlan === "enterprise";
  const selectedTier = PRICING_TIERS.find((tier) => tier.id === selectedPlan)!;

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const orderCode = useMemo(() => `EM-${Date.now().toString().slice(-8)}`, []);

  const {
    register,
    trigger,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<SubscribeBusinessFormValues>({
    resolver: zodResolver(subscribeBusinessFormSchema),
    defaultValues: { name: "", taxCode: "", industry: "" },
  });

  const isCardValid =
    cardName.trim().length > 1 && cardNumber.replace(/\s/g, "").length === 16 && cardExpiry.length === 5 && cardCvv.length >= 3;
  const canConfirmPayment = paymentMethod === "qr" || isCardValid;

  const serverError = subscribeMutation.error ? getApiErrorMessage(subscribeMutation.error) : null;
  const isSubmitting = isProcessingPayment || subscribeMutation.isPending;

  const goToBusinessStep = () => setStep("business");

  const goToPaymentStep = async () => {
    const valid = await trigger(["name", "taxCode", "industry"]);
    if (valid) setStep("payment");
  };

  const handleConfirmPayment = handleSubmit((values) => {
    // Bước "xử lý thanh toán" chỉ là hiệu ứng minh hoạ — chưa có cổng thanh toán thật ở
    // backend. Kích hoạt gói thật sự vẫn đi qua đúng API POST /businesses/subscribe.
    setIsProcessingPayment(true);
    window.setTimeout(() => {
      subscribeMutation.mutate(
        {
          name: values.name,
          taxCode: values.taxCode || undefined,
          industry: values.industry || undefined,
          planTier: selectedPlan.toUpperCase() as "STARTER" | "PROFESSIONAL",
        },
        { onSettled: () => setIsProcessingPayment(false) },
      );
    }, 1100);
  });

  useEffect(() => {
    if (subscribeMutation.isSuccess) {
      toast.success("Kích hoạt doanh nghiệp thành công!", { description: copy.success });
      navigate(ROUTES.app.dashboard, { replace: true });
    }
  }, [subscribeMutation.isSuccess, navigate, copy.success]);

  const steps = [
    { label: copy.steps.plan, active: step === "plan", completed: step !== "plan" },
    { label: copy.steps.business, active: step === "business", completed: step === "payment" },
    { label: copy.steps.payment, active: step === "payment" },
  ];

  const title = step === "payment" ? copy.payment.title : copy.title;
  const description = step === "payment" ? copy.payment.description : copy.description;

  return (
    <div className="max-w-5xl space-y-8">
      <AppPageHeader breadcrumbs={copy.breadcrumbs} title={title} description={description} />

      <WizardStepper steps={steps} />

      {step === "plan" ? (
        <>
          <AppPanel title={copy.planLabel}>
            <div className="grid gap-4 sm:grid-cols-3" role="group" aria-label={copy.planLabel}>
              {PRICING_TIERS.map((tier) => {
                const isSelected = selectedPlan === tier.id;
                const price = "monthlyPrice" in tier ? formatPrice(tier.monthlyPrice) : null;

                return (
                  <button
                    key={tier.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedPlan(tier.id)}
                    className={cn(
                      "flex flex-col items-start rounded-lg border p-4 text-left transition-all",
                      isSelected
                        ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary"
                        : "border-border bg-card hover:border-primary/40",
                    )}
                  >
                    <span className="text-sm font-bold text-foreground">{tier.name}</span>
                    <span className="mt-1 text-lg font-bold text-foreground">
                      {price ? `${price} ₫` : (tier as { priceLabel: string }).priceLabel}
                      {price ? <span className="text-xs font-normal text-muted-foreground">/tháng</span> : null}
                    </span>
                    <p className="mt-2 text-xs text-muted-foreground">{tier.description}</p>
                  </button>
                );
              })}
            </div>
          </AppPanel>

          {isEnterprise ? (
            <AppPanel>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Mail className="size-4" aria-hidden />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {copy.enterpriseContact.eyebrow}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-bold text-foreground">{copy.enterpriseContact.title}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {copy.enterpriseContact.description}
                  </p>
                </div>
                <Button asChild className="h-11 w-full sm:w-auto">
                  <a href={`mailto:${ENTERPRISE_SALES_EMAIL}?subject=${encodeURIComponent(ENTERPRISE_CONTACT_SUBJECT)}`}>
                    <Mail className="size-4" aria-hidden />
                    {copy.enterpriseContact.cta}
                  </a>
                </Button>
                <p className="text-xs text-muted-foreground">{copy.enterpriseContact.switchPlanHint}</p>
              </div>
            </AppPanel>
          ) : (
            <div className="flex justify-end">
              <Button onClick={goToBusinessStep} className="h-11 bg-accent text-accent-foreground hover:bg-accent/90">
                {copy.next}
              </Button>
            </div>
          )}
        </>
      ) : null}

      {step === "business" ? (
        <>
          <AppPanel title={copy.sectionBusiness}>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                id="name"
                label={copy.labels.name}
                required
                placeholder={copy.placeholders.name}
                error={errors.name?.message}
                className="sm:col-span-2"
                {...register("name")}
              />
              <TextField
                id="taxCode"
                label={copy.labels.taxCode}
                placeholder={copy.placeholders.taxCode}
                error={errors.taxCode?.message}
                {...register("taxCode")}
              />
              <TextField
                id="industry"
                label={copy.labels.industry}
                placeholder={copy.placeholders.industry}
                error={errors.industry?.message}
                {...register("industry")}
              />
            </div>
          </AppPanel>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep("plan")} className="h-11 gap-1.5">
              <ArrowLeft className="size-4" aria-hidden />
              {copy.back}
            </Button>
            <Button onClick={goToPaymentStep} className="h-11 bg-accent text-accent-foreground hover:bg-accent/90">
              {copy.next}
            </Button>
          </div>
        </>
      ) : null}

      {step === "payment" ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <AppPanel>
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-2" role="group" aria-label="Phương thức thanh toán">
                  <button
                    type="button"
                    aria-pressed={paymentMethod === "card"}
                    onClick={() => setPaymentMethod("card")}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-semibold transition-all",
                      paymentMethod === "card"
                        ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                        : "border-border text-muted-foreground hover:border-primary/40",
                    )}
                  >
                    <CreditCard className="size-4" aria-hidden />
                    {copy.payment.methodCard}
                  </button>
                  <button
                    type="button"
                    aria-pressed={paymentMethod === "qr"}
                    onClick={() => setPaymentMethod("qr")}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-semibold transition-all",
                      paymentMethod === "qr"
                        ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                        : "border-border text-muted-foreground hover:border-primary/40",
                    )}
                  >
                    <QrCode className="size-4" aria-hidden />
                    {copy.payment.methodQr}
                  </button>
                </div>

                {paymentMethod === "card" ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className="text-xs font-medium text-muted-foreground">{copy.payment.cardholderLabel}</Label>
                      <Input
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value.toUpperCase())}
                        placeholder={copy.payment.cardholderPlaceholder}
                        autoComplete="cc-name"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                        <CreditCard className="size-3.5" />
                        {copy.payment.cardNumberLabel}
                      </Label>
                      <Input
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="0000 0000 0000 0000"
                        inputMode="numeric"
                        autoComplete="cc-number"
                        maxLength={19}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground">{copy.payment.expiryLabel}</Label>
                      <Input
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        placeholder="MM/YY"
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        maxLength={5}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground">{copy.payment.cvvLabel}</Label>
                      <Input
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="123"
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        maxLength={4}
                        type="password"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                    <div className="size-40 shrink-0 overflow-hidden rounded-xl border border-border bg-white p-2 shadow-sm">
                      <FakeQrPattern seed={`${orderCode}-${selectedPlan}`} />
                    </div>
                    <div className="w-full space-y-3">
                      <p className="text-xs text-muted-foreground">{copy.payment.scanHint}</p>
                      <div className="space-y-2 rounded-lg border border-border bg-muted/20 p-3 text-sm">
                        <BankInfoRow label={copy.payment.bankName} value="" plain />
                        <BankInfoRow
                          label={copy.payment.bankAccountNumberLabel}
                          value={BANK_ACCOUNT_NUMBER}
                          onCopy={() => copyToClipboard(BANK_ACCOUNT_NUMBER.replace(/\s/g, ""))}
                        />
                        <BankInfoRow label="Chủ tài khoản" value={copy.payment.bankAccountName} plain />
                        <BankInfoRow
                          label={copy.payment.transferContentLabel}
                          value={orderCode}
                          onCopy={() => copyToClipboard(orderCode)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </AppPanel>

            {serverError ? (
              <p
                className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
                role="alert"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
                <span>{serverError}</span>
              </p>
            ) : null}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep("business")} disabled={isSubmitting} className="h-11 gap-1.5">
                <ArrowLeft className="size-4" aria-hidden />
                {copy.back}
              </Button>
              <Button
                onClick={handleConfirmPayment}
                disabled={!canConfirmPayment || isSubmitting}
                aria-busy={isSubmitting}
                className="h-11 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    {copy.payment.processing}
                  </>
                ) : (
                  <>
                    <Check className="size-4" aria-hidden />
                    {copy.payment.confirmCta}
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="lg:sticky lg:top-6 lg:self-start">
            <AppPanel title={copy.payment.orderSummaryTitle}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">{selectedTier.name}</span>
                  <span className="text-sm font-bold text-primary">
                    {"monthlyPrice" in selectedTier
                      ? `${formatPrice(selectedTier.monthlyPrice)} ₫/tháng`
                      : (selectedTier as { priceLabel: string }).priceLabel}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{getValues("name") || "—"}</p>

                <div className="flex items-start gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-800 dark:text-emerald-300">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>{copy.payment.trialNote}</span>
                </div>

                <div className="border-t border-border pt-3 text-xs text-muted-foreground">
                  Mã đơn: <span className="font-mono text-foreground">{orderCode}</span>
                </div>
              </div>
            </AppPanel>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function BankInfoRow({
  label,
  value,
  onCopy,
  plain,
}: {
  label: string;
  value: string;
  onCopy?: () => void;
  plain?: boolean;
}) {
  if (plain) {
    return (
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">{label}</span>
        {value ? <span className="text-right text-xs font-semibold text-foreground">{value}</span> : null}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate font-mono text-sm font-semibold text-foreground">{value}</p>
      </div>
      {onCopy ? (
        <Button type="button" variant="ghost" size="icon-sm" onClick={onCopy} aria-label={`Sao chép ${label}`}>
          <Copy className="size-3.5" aria-hidden />
        </Button>
      ) : null}
    </div>
  );
}
