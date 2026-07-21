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
      staleTime: 60_000,
      retry: 1,
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
