import { create } from "zustand";
import type { AuthUser } from "@/features/auth/types/auth.types";
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
  setSession: (session: StoredSession) => void;
  setUser: (user: AuthUser | null) => void;
  clear: () => void;
};

/**
 * Reactive auth state mirrored from localStorage. Initializes from persisted
 * values so guards resolve correctly on a fresh page load / refresh.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: getStoredUser(),
  isAuthenticated: hasStoredToken(),
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
  clear: () => {
    clearPersistedSession();
    set({ user: null, isAuthenticated: false });
  },
}));

// Phiên hết hạn từ tầng API (refresh thất bại) -> đồng bộ trạng thái đăng nhập.
if (typeof window !== "undefined") {
  window.addEventListener(AUTH_EXPIRED_EVENT, () => {
    useAuthStore.setState({ user: null, isAuthenticated: false });
  });
}
