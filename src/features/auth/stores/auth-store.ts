import { create } from "zustand";
import type { AuthUser, ProfileMembership } from "@/features/auth/types/auth.types";
import { AUTH_EXPIRED_EVENT } from "@/shared/lib/api-client";
import {
  clearSession as clearPersistedSession,
  getStoredUser,
  isAuthenticated as hasStoredToken,
  setSession as persistSession,
  setStoredUser,
  type StoredSession,
} from "@/shared/lib/auth-storage";

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  /** Vai trò của user hiện tại theo từng doanh nghiệp (từ GET /auth/profile). */
  memberships: ProfileMembership[];
  /** true khi đã fetch xong /auth/profile ít nhất 1 lần trong phiên này. */
  membershipsLoaded: boolean;
  setSession: (session: StoredSession) => void;
  setUser: (user: AuthUser | null) => void;
  setMemberships: (memberships: ProfileMembership[]) => void;
  clear: () => void;
};

/**
 * Reactive auth state mirrored from localStorage. Initializes from persisted
 * values so guards resolve correctly on a fresh page load / refresh.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: getStoredUser(),
  isAuthenticated: hasStoredToken(),
  memberships: [],
  membershipsLoaded: false,
  setSession: (session) => {
    persistSession(session);
    set({
      user: session.user ?? getStoredUser(),
      isAuthenticated: true,
    });
  },
  setUser: (user) => {
    setStoredUser(user);
    set({ user });
  },
  setMemberships: (memberships) => {
    set({ memberships, membershipsLoaded: true });
  },
  clear: () => {
    clearPersistedSession();
    set({ user: null, isAuthenticated: false, memberships: [], membershipsLoaded: false });
  },
}));

// Phiên hết hạn từ tầng API (refresh thất bại) -> đồng bộ trạng thái đăng nhập.
if (typeof window !== "undefined") {
  window.addEventListener(AUTH_EXPIRED_EVENT, () => {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      memberships: [],
      membershipsLoaded: false,
    });
  });
}
