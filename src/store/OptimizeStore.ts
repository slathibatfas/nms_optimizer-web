// src/store/OptimizeStore.ts
import { create } from "zustand";

interface OptimizeState {
	showError: boolean;
	setShowError: (show: boolean) => void;
	patternNoFitTech: string | null; // Tech for which "Pattern No Fit" occurred
	setPatternNoFitTech: (tech: string | null) => void;
}

export const useOptimizeStore = create<OptimizeState>((set) => ({
	showError: false,
	setShowError: (show) => set({ showError: show }),
	patternNoFitTech: null,
	setPatternNoFitTech: (tech) => set({ patternNoFitTech: tech }),
}));
