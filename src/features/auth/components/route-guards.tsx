import { useAuth, useClerk } from "@clerk/react";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router";
import { exchangeExternal } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/components/ui/button";
type GuardProps = { children: ReactNode };
export function RequireAuth({ children }: GuardProps) {
  const authenticated=useAuthStore(s=>s.isAuthenticated);const setSession=useAuthStore(s=>s.setSession);
  const {isSignedIn,isLoaded,sessionId,getToken}=useAuth();const clerk=useClerk();const location=useLocation();
  const exchange=useQuery({queryKey:["external-session",sessionId],enabled:Boolean(isLoaded&&isSignedIn&&!authenticated),retry:false,staleTime:Infinity,
    queryFn:async()=>{const token=await getToken({template:import.meta.env.VITE_CLERK_JWT_TEMPLATE || "ecometric"});if(!token)throw new Error("Google chưa cấp token cho EcoMetric. Vui lòng đăng nhập bằng email.");return exchangeExternal(token);}});
  useEffect(()=>{if(exchange.data&&!authenticated)setSession(exchange.data);},[exchange.data,authenticated,setSession]);
  if(authenticated)return <>{children}</>;
  if(!isLoaded)return <p className="p-8 text-muted-foreground">Đang kiểm tra phiên đăng nhập…</p>;
  if(isSignedIn){if(exchange.error)return <div className="mx-auto max-w-xl space-y-4 p-8"><h1 className="text-xl font-bold">Chưa kết nối được phiên Google</h1><p role="alert">{exchange.error.message}</p><Button onClick={()=>exchange.refetch()}>Thử lại</Button><Button variant="outline" onClick={()=>clerk.signOut({redirectUrl:ROUTES.login})}>Đăng nhập bằng email</Button></div>;return <p className="p-8 text-muted-foreground">Đang kết nối phiên Google với EcoMetric…</p>;}
  return <Navigate to={ROUTES.login} replace state={{from:`${location.pathname}${location.search}`}}/>;
}
export function GuestOnly({children}:GuardProps){
 const authenticated=useAuthStore(s=>s.isAuthenticated);const {isSignedIn,isLoaded}=useAuth();const location=useLocation();
 if(authenticated || isSignedIn){const from=(location.state as {from?:string}|null)?.from;return <Navigate to={from ?? ROUTES.app.dashboard} replace/>;}
 if(!isLoaded)return null;return <>{children}</>;
}
