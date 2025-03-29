// src/store/useTechStore.ts
import { create } from "zustand";

interface TechStore {
  max_bonus: { [tech: string]: number } | null;
  setMaxBonus: (tech: string, maxBonus: number) => void;
  clearResult: () => void;
  clearTechMaxBonus: (tech: string) => void;
  checkedModules: { [tech: string]: string[] }; // Add checkedModules state
  setCheckedModules: (tech: string, updateModules: (prevModules: string[]) => string[]) => void; // Modify setCheckedModules action
  clearCheckedModules: (tech: string) => void; // Add clearCheckedModules action
}

export const useTechStore = create<TechStore>((set) => ({
  max_bonus: null,
  setMaxBonus: (tech, maxBonus) =>
    set((state) => ({
      max_bonus: { ...state.max_bonus, [tech]: maxBonus },
    })),
  clearResult: () => set({ max_bonus: null }),
  clearTechMaxBonus: (tech) =>
    set((state) => {
      if (state.max_bonus) {
        const newMaxBonus = { ...state.max_bonus };
        delete newMaxBonus[tech];
        return { max_bonus: Object.keys(newMaxBonus).length === 0 ? null : newMaxBonus };
      }
      return {};
    }),
  checkedModules: {}, // Initialize checkedModules as an empty object
  setCheckedModules: (tech, updateModules) =>
    set((state) => ({
      checkedModules: {
        ...state.checkedModules,
        [tech]: updateModules(state.checkedModules[tech] || []), // Use the updateModules function
      },
    })),
  clearCheckedModules: (tech) =>
    set((state) => {
      const newCheckedModules = { ...state.checkedModules };
      delete newCheckedModules[tech];
      return { checkedModules: newCheckedModules };
    }),
}));
