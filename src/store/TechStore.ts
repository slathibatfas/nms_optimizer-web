// src/store/TechStore.ts
import { create } from "zustand";

interface TechState {
  max_bonus: { [key: string]: number };
  solved_bonus: { [key: string]: number };
  techColors: { [key: string]: string };
  checkedModules: { [key: string]: string[] };
  clearTechMaxBonus: (tech: string) => void;
  setTechMaxBonus: (tech: string, bonus: number) => void;
  clearTechSolvedBonus: (tech: string) => void;
  setTechSolvedBonus: (tech: string, bonus: number) => void;
  setTechColors: (colors: { [key: string]: string }) => void;
  getTechColor: (tech: string) => string | undefined;
  setCheckedModules: (tech: string, updater: (prev?: string[]) => string[]) => void;
  clearCheckedModules: (tech: string) => void;
  clearResult: () => void; // Add clearResult to the TechState interface
}

export const useTechStore = create<TechState>((set, get) => ({
  // Note the 'get' parameter
  max_bonus: {},
  solved_bonus: {},
  techColors: {},
  checkedModules: {},
  clearTechMaxBonus: (tech) =>
    set((state) => ({
      max_bonus: { ...state.max_bonus, [tech]: 0 },
    })),
  setTechMaxBonus: (tech, max_bonus) =>
    set((state) => ({
      max_bonus: { ...state.max_bonus, [tech]: max_bonus },
    })),
  clearTechSolvedBonus: (tech) =>
    set((state) => ({
      solved_bonus: { ...state.solved_bonus, [tech]: 0 },
    })),
  setTechSolvedBonus: (tech, bonus) =>
    set((state) => ({
      solved_bonus: { ...state.solved_bonus, [tech]: bonus },
    })),
  setTechColors: (colors) => set({ techColors: colors }),
  getTechColor: (tech) => get().techColors[tech], // Access state using 'get'
  setCheckedModules: (tech, updater) =>
    set((state) => ({
      checkedModules: {
        ...state.checkedModules,
        [tech]: updater(state.checkedModules[tech]),
      },
    })),
  clearCheckedModules: (tech) =>
    set((state) => ({
      checkedModules: { ...state.checkedModules, [tech]: [] },
    })),
  clearResult: () => set({ max_bonus: {}, solved_bonus: {} }), // Implement clearResult
}));
