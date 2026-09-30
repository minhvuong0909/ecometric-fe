import { useAuthStore } from "@/features/auth/stores/auth-store";
import type { UserRole } from "@/features/auth/types/auth.types";

export type BusinessRoleState = {
  /** Vai trò của user trong doanh nghiệp này, null nếu không phải thành viên. */
  role: UserRole | null;
  /** true khi chưa xác định được vai trò (đang chờ /auth/profile). */
  isLoading: boolean;
};

/**
 * Suy ra vai trò hiệu lực của user hiện tại trong 1 doanh nghiệp cụ thể.
 * SYSTEM_ADMIN luôn có quyền cao nhất (bypass), khớp logic ensureCanManage*
 * ở backend (business-members.service.ts / business-invitations.service.ts).
 */
export function useBusinessRole(businessId: string): BusinessRoleState {
  const platformRole = useAuthStore((state) => state.user?.platformRole);
  const memberships = useAuthStore((state) => state.memberships);
  const membershipsLoaded = useAuthStore((state) => state.membershipsLoaded);

  if (platformRole === "SYSTEM_ADMIN") {
    return { role: "SYSTEM_ADMIN", isLoading: false };
  }

  if (!membershipsLoaded) {
    return { role: null, isLoading: true };
  }

  const membership = memberships.find((item) => item.businessId === businessId);
  return { role: membership?.role ?? null, isLoading: false };
}
