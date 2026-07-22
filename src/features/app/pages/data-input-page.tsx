import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { Droplets, Fuel, Trash2, Truck, Zap, Calculator, Loader2, Sparkles, UploadCloud, ArrowRight } from "lucide-react";
import { AppPageHeader } from "@/features/app/components/app-page-header";
import { AppPanel } from "@/features/app/components/app-panel";
import { DATA_INPUT_COPY, APP_SHARED_COPY } from "@/features/app/constants/app-copy";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { ROUTES } from "@/shared/constants/routes";

export function DataInputPage() {
  const copy = DATA_INPUT_COPY;
  const navigate = useNavigate();
  const [isCalculating, setIsCalculating] = useState(false);

  // States cho các trường nhập liệu của Điện
  const [electricity, setElectricity] = useState("1500");
  const [branchElec, setBranchElec] = useState("Quận 1");
  const [periodElec, setPeriodElec] = useState("Tháng 6 2026");

  // States cho Nhiên liệu
  const [fuelType, setFuelType] = useState("Dầu diesel");
  const [fuel, setFuel] = useState("320");
  const [branchFuel, setBranchFuel] = useState("Kho Bình Dương");

  // States cho Vận tải
  const [distance, setDistance] = useState("4200");
  const [vehicleType, setVehicleType] = useState("Xe tải");
  const [periodDist, setPeriodDist] = useState("Tháng 6 2026");

  // States cho Chất thải
  const [waste, setWaste] = useState("12.5");
  const [wasteMethod, setWasteMethod] = useState("Tái chế");
  const [branchWaste, setBranchWaste] = useState("Quận 1");

  // States cho Nước
  const [water, setWater] = useState("860");
  const [branchWater, setBranchWater] = useState("Quận 1");
  const [periodWater, setPeriodWater] = useState("Tháng 6 2026");

  // Hệ số phát thải ngầm định
  const ELECTRICITY_FACTOR = 0.00045; // tCO2e / kWh
  const FUEL_FACTOR = 0.00268;        // tCO2e / L
  const DISTANCE_FACTOR = 0.00012;    // tCO2e / km
  const WASTE_FACTOR = 0.0089;        // tCO2e / ton
  const WATER_FACTOR = 0.00035;       // tCO2e / m3

  // Tính toán phát thải thời gian thực
  const co2eElectricity = ((parseFloat(electricity) || 0) * ELECTRICITY_FACTOR).toFixed(2);
  const co2eFuel = ((parseFloat(fuel) || 0) * FUEL_FACTOR).toFixed(2);
  const co2eDistance = ((parseFloat(distance) || 0) * DISTANCE_FACTOR).toFixed(2);
  const co2eWaste = ((parseFloat(waste) || 0) * WASTE_FACTOR).toFixed(2);
  const co2eWater = ((parseFloat(water) || 0) * WATER_FACTOR).toFixed(2);

  // Tính toán độ đầy đủ của dữ liệu động
  const totalFields = 15;
  const filledFields = [
    electricity, branchElec, periodElec,
    fuelType, fuel, branchFuel,
    distance, vehicleType, periodDist,
    waste, wasteMethod, branchWaste,
    water, branchWater, periodWater
  ].filter(val => val.trim() !== "").length;

  const completenessPercent = Math.round((filledFields / totalFields) * 100);

  const handleCalculate = () => {
    setIsCalculating(true);
    toast.loading("Đang tính toán lượng phát thải carbon...", { id: "calc-toast" });

    setTimeout(() => {
      toast.success("Tính toán lượng phát thải thành công! Đang tải bảng chi tiết...", { id: "calc-toast" });
      setTimeout(() => {
        navigate(ROUTES.app.emissionDetail);
      }, 800);
    }, 1200);
  };

  return (
    <div className="space-y-8">
      <AppPageHeader
        breadcrumbs={copy.breadcrumbs}
        title={copy.title}
        description={copy.description}
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="rounded-xl border border-border bg-card px-6 py-4 shadow-sm">
          <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
            {APP_SHARED_COPY.topBar.companyLabel}
          </p>
          <p className="text-lg font-semibold text-secondary-foreground">{APP_SHARED_COPY.topBar.companyName}</p>
        </div>

        <div className="min-w-[320px] rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between text-sm font-bold">
            <span className="text-secondary-foreground">Độ đầy đủ của dữ liệu</span>
            <span className="text-primary font-semibold transition-all duration-300">{completenessPercent}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-muted border border-border/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500 ease-out shadow-sm shadow-emerald-400/20"
              style={{ width: `${completenessPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Banner AI Upload hóa đơn thay vì nhập thủ công */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-emerald-950 via-teal-900 to-secondary-foreground p-6 text-white shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent/20 text-accent border border-accent/30 shadow-inner">
              <Sparkles className="size-6 text-accent" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold text-accent-foreground uppercase tracking-wider">
                  Nhanh & Tự động
                </span>
                <h3 className="text-base font-bold text-white">Bạn không muốn nhập số liệu thủ công?</h3>
              </div>
              <p className="text-sm text-emerald-100/80 leading-relaxed max-w-2xl">
                Tải lên ngay hóa đơn EVN, chứng từ nhiên liệu hoặc phiếu thu phí. Công nghệ AI của EcoMetric sẽ tự động trích xuất và kiểm tra số liệu cho bạn.
              </p>
            </div>
          </div>
          <Button
            asChild
            className="shrink-0 bg-accent text-accent-foreground font-bold hover:bg-accent/90 shadow-md transition-all duration-200 hover:scale-[1.02] px-5 py-5"
          >
            <Link to={ROUTES.app.uploadDoc} className="flex items-center gap-2">
              <UploadCloud className="size-5" />
              Tải hóa đơn đính kèm (AI Scan)
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Card: Điện */}
        <AppPanel bodyClassName="space-y-6" interactive className="group">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/15 transition-all duration-300 group-hover:scale-105 group-hover:bg-primary group-hover:text-white group-hover:border-primary">
                <Zap className="size-5 transition-colors duration-300" aria-hidden />
              </div>
              <div>
                <h2 className="text-lg font-bold text-secondary-foreground">Điện</h2>
                <p className="text-xs text-muted-foreground">Dữ liệu hoạt động hàng tháng</p>
              </div>
            </div>
            <span className="rounded-full bg-red-50 text-red-700 border border-red-200 px-3 py-1 text-xs font-bold uppercase tracking-wider scale-90">
              Bắt buộc
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Sản lượng (kWh)
              </Label>
              <Input
                type="number"
                value={electricity}
                onChange={(e) => setElectricity(e.target.value)}
                className="bg-background border-border focus:border-primary/50 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Chi nhánh
              </Label>
              <Input
                value={branchElec}
                onChange={(e) => setBranchElec(e.target.value)}
                className="bg-background border-border focus:border-primary/50 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Kỳ hóa đơn
              </Label>
              <Input
                value={periodElec}
                onChange={(e) => setPeriodElec(e.target.value)}
                className="bg-background border-border focus:border-primary/50 transition-all"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-lg bg-emerald-500/5 px-4 py-2.5 border border-emerald-500/10">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
              <Calculator className="size-3.5" />
              Lượng phát thải tính toán:
            </span>
            <span className="text-sm font-bold text-emerald-700">{co2eElectricity} tCO₂e</span>
          </div>
        </AppPanel>

        {/* Card: Nhiên liệu */}
        <AppPanel bodyClassName="space-y-6" interactive className="group">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/15 transition-all duration-300 group-hover:scale-105 group-hover:bg-primary group-hover:text-white group-hover:border-primary">
                <Fuel className="size-5 transition-colors duration-300" aria-hidden />
              </div>
              <div>
                <h2 className="text-lg font-bold text-secondary-foreground">Nhiên liệu</h2>
                <p className="text-xs text-muted-foreground">Dữ liệu hoạt động hàng tháng</p>
              </div>
            </div>
            <span className="rounded-full bg-red-50 text-red-700 border border-red-200 px-3 py-1 text-xs font-bold uppercase tracking-wider scale-90">
              Bắt buộc
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Loại nhiên liệu
              </Label>
              <Input
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                className="bg-background border-border focus:border-primary/50 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Số lượng (lít)
              </Label>
              <Input
                type="number"
                value={fuel}
                onChange={(e) => setFuel(e.target.value)}
                className="bg-background border-border focus:border-primary/50 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Chi nhánh
              </Label>
              <Input
                value={branchFuel}
                onChange={(e) => setBranchFuel(e.target.value)}
                className="bg-background border-border focus:border-primary/50 transition-all"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-lg bg-emerald-500/5 px-4 py-2.5 border border-emerald-500/10">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
              <Calculator className="size-3.5" />
              Lượng phát thải tính toán:
            </span>
            <span className="text-sm font-bold text-emerald-700">{co2eFuel} tCO₂e</span>
          </div>
        </AppPanel>

        {/* Card: Vận tải */}
        <AppPanel bodyClassName="space-y-6" interactive className="group">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/15 transition-all duration-300 group-hover:scale-105 group-hover:bg-primary group-hover:text-white group-hover:border-primary">
                <Truck className="size-5 transition-colors duration-300" aria-hidden />
              </div>
              <div>
                <h2 className="text-lg font-bold text-secondary-foreground">Vận tải</h2>
                <p className="text-xs text-muted-foreground">Dữ liệu hoạt động hàng tháng</p>
              </div>
            </div>
            <span className="rounded-full bg-red-50 text-red-700 border border-red-200 px-3 py-1 text-xs font-bold uppercase tracking-wider scale-90">
              Bắt buộc
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Quãng đường (km)
              </Label>
              <Input
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="bg-background border-border focus:border-primary/50 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Loại xe
              </Label>
              <Input
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="bg-background border-border focus:border-primary/50 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Kỳ báo cáo
              </Label>
              <Input
                value={periodDist}
                onChange={(e) => setPeriodDist(e.target.value)}
                className="bg-background border-border focus:border-primary/50 transition-all"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-lg bg-emerald-500/5 px-4 py-2.5 border border-emerald-500/10">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
              <Calculator className="size-3.5" />
              Lượng phát thải tính toán:
            </span>
            <span className="text-sm font-bold text-emerald-700">{co2eDistance} tCO₂e</span>
          </div>
        </AppPanel>

        {/* Card: Chất thải */}
        <AppPanel bodyClassName="space-y-6" interactive className="group">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/15 transition-all duration-300 group-hover:scale-105 group-hover:bg-primary group-hover:text-white group-hover:border-primary">
                <Trash2 className="size-5 transition-colors duration-300" aria-hidden />
              </div>
              <div>
                <h2 className="text-lg font-bold text-secondary-foreground">Chất thải</h2>
                <p className="text-xs text-muted-foreground">Dữ liệu hoạt động hàng tháng</p>
              </div>
            </div>
            <span className="rounded-full bg-red-50 text-red-700 border border-red-200 px-3 py-1 text-xs font-bold uppercase tracking-wider scale-90">
              Bắt buộc
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Khối lượng (tấn)
              </Label>
              <Input
                type="number"
                value={waste}
                onChange={(e) => setWaste(e.target.value)}
                className="bg-background border-border focus:border-primary/50 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Phương pháp
              </Label>
              <Input
                value={wasteMethod}
                onChange={(e) => setWasteMethod(e.target.value)}
                className="bg-background border-border focus:border-primary/50 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Chi nhánh
              </Label>
              <Input
                value={branchWaste}
                onChange={(e) => setBranchWaste(e.target.value)}
                className="bg-background border-border focus:border-primary/50 transition-all"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-lg bg-emerald-500/5 px-4 py-2.5 border border-emerald-500/10">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
              <Calculator className="size-3.5" />
              Lượng phát thải tính toán:
            </span>
            <span className="text-sm font-bold text-emerald-700">{co2eWaste} tCO₂e</span>
          </div>
        </AppPanel>

        {/* Card: Nước */}
        <AppPanel bodyClassName="space-y-6" interactive className="group">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/15 transition-all duration-300 group-hover:scale-105 group-hover:bg-primary group-hover:text-white group-hover:border-primary">
                <Droplets className="size-5 transition-colors duration-300" aria-hidden />
              </div>
              <div>
                <h2 className="text-lg font-bold text-secondary-foreground">Nước</h2>
                <p className="text-xs text-muted-foreground">Dữ liệu hoạt động hàng tháng</p>
              </div>
            </div>
            <span className="rounded-full bg-red-50 text-red-700 border border-red-200 px-3 py-1 text-xs font-bold uppercase tracking-wider scale-90">
              Bắt buộc
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Tiêu thụ (m³)
              </Label>
              <Input
                type="number"
                value={water}
                onChange={(e) => setWater(e.target.value)}
                className="bg-background border-border focus:border-primary/50 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Chi nhánh
              </Label>
              <Input
                value={branchWater}
                onChange={(e) => setBranchWater(e.target.value)}
                className="bg-background border-border focus:border-primary/50 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Kỳ hóa đơn
              </Label>
              <Input
                value={periodWater}
                onChange={(e) => setPeriodWater(e.target.value)}
                className="bg-background border-border focus:border-primary/50 transition-all"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-lg bg-emerald-500/5 px-4 py-2.5 border border-emerald-500/10">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
              <Calculator className="size-3.5" />
              Lượng phát thải tính toán:
            </span>
            <span className="text-sm font-bold text-emerald-700">{co2eWater} tCO₂e</span>
          </div>
        </AppPanel>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          onClick={handleCalculate}
          disabled={isCalculating}
          className="bg-primary text-primary-foreground hover:bg-primary/95 font-bold px-6 py-5 shadow-md flex items-center gap-2"
        >
          {isCalculating ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Đang tính toán...
            </>
          ) : (
            <>
              <Calculator className="size-4" />
              {copy.cta}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
