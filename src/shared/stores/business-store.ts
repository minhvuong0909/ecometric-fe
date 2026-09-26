import { create } from "zustand";
import type { Business } from "@/features/businesses/types/businesses.types";

const ACTIVE_BUSINESS_ID_KEY = "ecometric.activeBusinessId";

interface BusinessState {
  activeBusinessId: string | null;
  activeBusiness: Business | null;
  setActiveBusinessId: (id: string | null) => void;
  setActiveBusiness: (business: Business | null) => void;
}

const initialBusinessId =
  typeof window !== "undefined"
    ? localStorage.getItem(ACTIVE_BUSINESS_ID_KEY)
    : null;

export const useBusinessStore = create<BusinessState>((set) => ({
  activeBusinessId: initialBusinessId,
  activeBusiness: null,
  setActiveBusinessId: (id) => {
    if (typeof window !== "undefined") {
      if (id) {
        localStorage.setItem(ACTIVE_BUSINESS_ID_KEY, id);
      } else {
        localStorage.removeItem(ACTIVE_BUSINESS_ID_KEY);
      }
    }
    set({ activeBusinessId: id });
  },
  setActiveBusiness: (business) => {
    if (typeof window !== "undefined") {
      if (business?.id) {
        localStorage.setItem(ACTIVE_BUSINESS_ID_KEY, business.id);
      } else {
        localStorage.removeItem(ACTIVE_BUSINESS_ID_KEY);
      }
    }
    set({
      activeBusiness: business,
      activeBusinessId: business?.id ?? null,
    });
  },
}));
