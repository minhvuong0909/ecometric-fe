import { useState } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "react-router";
import { AppPageHeader } from "@/features/app/components/app-page-header";
import { AppPanel } from "@/features/app/components/app-panel";
import { useSubscribeBusiness } from "@/features/businesses/hooks/use-subscribe-business";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import type { SubscribeBusinessRequest } from "@/features/businesses/types/businesses.types";
export function BusinessOnboardingPage(){
 const [params]=useSearchParams();const requested=params.get("plan")?.toUpperCase();
 const [planTier,setPlanTier]=useState<SubscribeBusinessRequest["planTier"]>(requested==="PROFESSIONAL" || requested==="ENTERPRISE"?requested:"STARTER");
 const [name,setName]=useState("");const [taxCode,setTaxCode]=useState("");const [industry,setIndustry]=useState("");const mutation=useSubscribeBusiness();
 async function submit(e:FormEvent){e.preventDefault();try{await mutation.mutateAsync({name,taxCode:taxCode || undefined,industry:industry || undefined,planTier});}catch{/* Error is displayed below. */}}
 return <div className="space-y-6"><AppPageHeader title="Tạo doanh nghiệp & Thanh toán" description="Tạo đơn thanh toán, kiểm tra số tiền trên PayOS và hoàn tất thanh toán để kích hoạt doanh nghiệp."/>
 <AppPanel title="Thông tin doanh nghiệp"><form className="space-y-4" onSubmit={submit}><div><Label htmlFor="business-name">Tên doanh nghiệp</Label><Input id="business-name" value={name} onChange={e=>setName(e.target.value)} required minLength={2} maxLength={150}/></div><div><Label htmlFor="business-tax">Mã số thuế</Label><Input id="business-tax" value={taxCode} onChange={e=>setTaxCode(e.target.value)} maxLength={50}/></div><div><Label htmlFor="business-industry">Ngành nghề</Label><Input id="business-industry" value={industry} onChange={e=>setIndustry(e.target.value)} maxLength={120}/></div><div><Label htmlFor="business-plan">Gói dịch vụ</Label><select id="business-plan" className="h-10 w-full rounded border bg-background px-3" value={planTier} onChange={e=>setPlanTier(e.target.value as SubscribeBusinessRequest["planTier"])}><option value="STARTER">Starter</option><option value="PROFESSIONAL">Professional</option><option value="ENTERPRISE">Enterprise</option></select></div><Button disabled={mutation.isPending || mutation.isSuccess}>{mutation.isPending?"Đang tạo đơn…":"Tạo đơn thanh toán"}</Button>{mutation.error && <p role="alert" className="text-destructive">{mutation.error.message}</p>}</form></AppPanel>
 {mutation.data && <AppPanel title="Đơn thanh toán đã tạo"><p>Mã đơn: {mutation.data.orderCode}</p><p className="mt-2 text-xl font-bold">{mutation.data.amount.toLocaleString("vi-VN")} VND</p><p className="mt-2 text-sm text-muted-foreground">Doanh nghiệp sẽ được tạo sau khi nhận xác nhận thanh toán. Đơn này chưa kích hoạt doanh nghiệp.</p><Button className="mt-4" asChild><a href={mutation.data.checkoutUrl}>Tiếp tục trên PayOS</a></Button></AppPanel>}
 </div>;
}
