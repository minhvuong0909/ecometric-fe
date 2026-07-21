import { useClerk } from "@clerk/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { logout } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { isAuthenticated as hasStoredToken } from "@/shared/lib/auth-storage";

export function useLogout() {
  const queryClient = useQueryClient();
  const clear = useAuthStore((state) => state.clear);
  const clerk = useClerk();

  return useMutation({
    mutationFn: async () => {
      // 1. Đăng xuất khỏi Clerk nếu đăng nhập bằng Google / Clerk
      if (clerk.user) {
        await clerk.signOut();
      }

      // 2. Gọi API logout backend nếu có token lưu ở localStorage
      if (hasStoredToken()) {
        try {
          await logout();
        } catch {
          // Bỏ qua lỗi 401 backend khi logout để không chặn tiến trình đăng xuất
        }
      }
    },
    onSettled: () => {
      clear();
      queryClient.clear();
      toast.info("Đã đăng xuất tài khoản thành công");
    },
  });
}
