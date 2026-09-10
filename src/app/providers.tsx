import { ClerkProvider } from "@clerk/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.warn("Cảnh báo: Chưa cấu hình VITE_CLERK_PUBLISHABLE_KEY trong file .env");
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000, // 2 phút lưu cache, ngăn chặn gọi lại API liên tục
      gcTime: 10 * 60 * 1000, // 10 phút giữ bộ nhớ tạm trong RAM
      retry: 1, // Chỉ thử lại tối đa 1 lần nếu lỗi mạng, tránh spam request làm sập server
      refetchOnWindowFocus: false, // Không tự động bắn lại hàng loạt request khi chuyển tab
      refetchOnReconnect: "always", // Tự động đồng bộ lại khi có mạng trở lại
    },
    mutations: {
      retry: 0, // Tuyệt đối không retry tự động các tác vụ ghi (POST/PUT/DELETE) để tránh trùng lặp dữ liệu
    },
  },
});

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY || ""} afterSignOutUrl="/">
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster position="top-right" richColors closeButton expand />
      </QueryClientProvider>
    </ClerkProvider>
  );
}
