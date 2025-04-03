// src/store/OptimizeStore.tsx
import { create } from "zustand";

interface OptimizeState {
  showError: boolean;
  setShowError: (showError: boolean) => void;
}

export const useOptimizeStore = create<OptimizeState>((set) => ({
  showError: false,
  setShowError: (showError) => set({ showError }),
}));
