import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation, useSearchParams } from "react-router";
import { getBusiness, getSubscriptionOrder } from "@/features/businesses/api/businesses.api";
import { useBusinessStore } from "@/shared/stores/business-store";
import { AppPanel } from "@/features/app/components/app-panel";
import { Button } from "@/shared/components/ui/button";
import { ROUTES } from "@/shared/constants/routes";
export function PaymentResultPage(){
 const [params]=useSearchParams();const location=useLocation();const orderCode=Number(params.get("orderCode"));const valid=Number.isSafeInteger(orderCode)&&orderCode>0;
 const cancelled=location.pathname.endsWith("/cancel");const qc=useQueryClient();const setActive=useBusinessStore(s=>s.setActiveBusiness);
 const order=useQuery({queryKey:["subscription-order",orderCode],queryFn:()=>getSubscriptionOrder(orderCode),enabled:valid,retry:1,refetchInterval:q=>q.state.data?.status==="PENDING"?3000:false});
 const business=useQuery({queryKey:["paid-business",order.data?.businessId],queryFn:()=>getBusiness(order.data!.businessId!),enabled:order.data?.status==="PAID"&&Boolean(order.data.businessId)});
 useEffect(()=>{if(business.data){setActive(business.data);void qc.invalidateQueries({queryKey:["auth","profile"]});void qc.invalidateQueries({queryKey:["businesses"]});}},[business.data,setActive,qc]);
 return <div className="mx-auto max-w-xl p-6"><AppPanel title="Trạng thái thanh toán">{!valid?<p>Thiếu mã đơn hợp lệ. Kiểm tra lại đường dẫn trả về từ PayOS.</p>:order.error?<p role="alert" className="text-destructive">{order.error.message}</p>:order.isLoading?<p>Đang kiểm tra đơn…</p>:order.data?.status==="PAID"?<p>Thanh toán đã được xác nhận. Doanh nghiệp đã kích hoạt.</p>:<p>{cancelled?"Bạn đã quay lại từ trang hủy thanh toán.":"Đang chờ xác nhận thanh toán từ PayOS."} Trạng thái đơn: {order.data?.status}. Trang tự cập nhật khi webhook xác nhận.</p>}{business.error&&<p className="text-destructive">{business.error.message}</p>}<div className="mt-5 flex gap-3">{business.data?<Button asChild><Link to={ROUTES.app.dashboard}>Vào doanh nghiệp</Link></Button>:<Button asChild variant="outline"><Link to={ROUTES.app.onboarding}>Quay lại chọn gói</Link></Button>}{valid&&<Button variant="outline" onClick={()=>order.refetch()}>Kiểm tra lại</Button>}</div></AppPanel></div>;
}
