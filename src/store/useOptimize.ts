// src/store/useOptimizeStore.ts
import { create } from "zustand";

interface OptimizeStore {
  showError: boolean;
  setShowError: (value: boolean) => void;
}

export const useOptimizeStore = create<OptimizeStore>((set) => ({
  showError: false,
  setShowError: (value) => set({ showError: value }),
}));
