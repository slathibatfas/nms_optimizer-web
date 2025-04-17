// src/store/GridStore.ts
import { create } from "zustand";
import { persist, type StorageValue } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useTechStore } from "./TechStore";

// --- Define the specific function type we are debouncing ---
type SetItemFunction = (
    name: string,
    value: StorageValue<Partial<GridStore>>
) => Promise<void>; // Or just `void` if the original wasn't async

/**
 * Creates a debounced version of the specific setItem function that delays
 * calling the original function until `wait` milliseconds have passed since
 * the last time the debounced function was called.
 *
 * @param func The specific setItem function to debounce
 * @param wait The number of milliseconds to wait
 * @returns A debounced version of the setItem function
 */
function debounceSetItem(func: SetItemFunction, wait: number): SetItemFunction {
    let timeout: ReturnType<typeof setTimeout> | undefined = undefined;

    // Return a function that matches the SetItemFunction signature
    return (name: string, value: StorageValue<Partial<GridStore>>): Promise<void> => {
        // We return a Promise because the debounced function might need to be awaitable,
        // even though the actual execution is delayed. If the original wasn't async,
        // you could return void here and adjust the SetItemFunction type.
        return new Promise((resolve) => {
            const later = async () => { // Make later async to await func
                timeout = undefined;
                await func(name, value); // Await the original async function
                resolve(); // Resolve the promise after execution
            };

            if (timeout !== undefined) {
                clearTimeout(timeout);
            }

            timeout = setTimeout(later, wait);

            // Note: If the original func didn't return a Promise, you wouldn't need
            // the outer Promise wrapper and resolve() call. The `later` function
            // would just call `func(name, value);` directly.
        });
    };
}


// --- Define types (Cell, Grid, ApiResponse) ---
// (Keep existing type definitions - no changes needed here)
export type Cell = {
  active: boolean;
  adjacency: boolean;
  adjacency_bonus: number;
  bonus: number;
  image: string | null | undefined;
  module: string | null;
  label: string;
  sc_eligible: boolean;
  supercharged: boolean;
  tech: string | null;
  total: number;
  type: string;
  value: number;
};

export type Grid = {
  cells: Cell[][];
  height: number;
  width: number;
};

export type ApiResponse = {
  grid: Grid;
  max_bonus: number;
  solved_bonus: number;
};


// --- Utility functions (createEmptyCell, createGrid) ---
// (Keep existing utility functions - no changes needed here)
export const createEmptyCell = (supercharged = false, active = true): Cell => ({
  active,
  adjacency: false,
  adjacency_bonus: 0.0,
  bonus: 0.0,
  image: null,
  module: null,
  label: "",
  sc_eligible: false,
  supercharged: supercharged,
  tech: null,
  total: 0.0,
  type: "",
  value: 0,
});

export const createGrid = (width: number, height: number): Grid => ({
  cells: Array.from({ length: height }, () => Array.from({ length: width }, () => createEmptyCell(false, true))),
  width,
  height,
});


// --- Zustand Store Interface (GridStore) ---
// (Keep existing GridStore interface - no changes needed here)
export type GridStore = {
  grid: Grid;
  result: ApiResponse | null;
  isSharedGrid: boolean;
  setGrid: (grid: Grid) => void;
  resetGrid: () => void;
  setResult: (result: ApiResponse | null, tech: string) => void;
  activateRow: (rowIndex: number) => void;
  deActivateRow: (rowIndex: number) => void;
  hasTechInGrid: (tech: string) => boolean;
  isGridFull: () => boolean;
  resetGridTech: (tech: string) => void;
  toggleCellActive: (rowIndex: number, columnIndex: number) => void;
  toggleCellSupercharged: (rowIndex: number, columnIndex: number) => void;
  setCellActive: (rowIndex: number, columnIndex: number, active: boolean) => void;
  setCellSupercharged: (rowIndex: number, columnIndex: number, supercharged: boolean) => void;
  setIsSharedGrid: (isShared: boolean) => void;
};


// --- Create Debounced Storage ---
const debouncedStorage = {
  // Use the specific debounceSetItem function
  setItem: debounceSetItem(async (name: string, value: StorageValue<Partial<GridStore>>) => {
    // console.log(`Debounced save for: ${name}`); // Optional: for debugging
    try {
      const storageValue = JSON.stringify(value);
      localStorage.setItem(name, storageValue);
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
    }
  }, 2000), // 2000ms = 2 seconds debounce time

  // getItem and removeItem remain the same
  getItem: (name: string): StorageValue<Partial<GridStore>> | null => {
    try {
      const str = localStorage.getItem(name);
      if (!str) {
        return null;
      }
      return JSON.parse(str);
    } catch (e) {
      console.error("Failed to load from localStorage:", e);
      return null;
    }
  },

  removeItem: (name: string): void => {
    localStorage.removeItem(name);
  },
};


// --- Create the store using persist and immer middleware ---
// (No changes needed in the store logic itself)
export const useGridStore = create<GridStore>()(
  persist(
    immer(
      (set, get) => ({
        // --- State properties ---
        grid: createGrid(10, 6),
        result: null,
        isSharedGrid: false,

        // --- Actions ---
        // (All your existing actions remain unchanged here)
        setIsSharedGrid: (isShared) => set({ isSharedGrid: isShared }),

        setGrid: (grid) => set({ grid }),

        resetGrid: () => {
          set((state) => {
            state.grid = createGrid(state.grid.width, state.grid.height);
            state.result = null;
            state.isSharedGrid = false;
          });
          useTechStore.getState().clearResult();
        },

        setResult: (result, tech) => {
          const { setTechMaxBonus, setTechSolvedBonus } = useTechStore.getState();
          set((state) => {
            state.result = result;
          });
          if (result) {
            setTechMaxBonus(tech, result.max_bonus);
            setTechSolvedBonus(tech, result.solved_bonus);
          }
        },

        toggleCellActive: (rowIndex, columnIndex) => {
          set((state) => {
            const cell = state.grid.cells[rowIndex]?.[columnIndex];
            if (cell) {
              // Check if we are trying to deactivate a cell that has a module
              if (cell.active && cell.module !== null) {
                // If the cell is active AND has a module, do nothing (prevent deactivation)
                console.warn(`Cannot deactivate cell [${rowIndex}, ${columnIndex}] because it contains a module.`);
                return; // Exit the function early
              }

              // If the cell is active but empty, or if it's inactive, proceed with toggling
              const newActiveState = !cell.active;
              cell.active = newActiveState;

              // If the cell was just deactivated (must have been empty), ensure supercharged is off
              if (!newActiveState) {
                cell.supercharged = false;
              }
              // No special action needed when activating an inactive cell here

            } else {
              console.error(`Cell not found at [${rowIndex}, ${columnIndex}]`);
            }
          });
        },

        toggleCellSupercharged: (rowIndex, columnIndex) => {
          set((state) => {
            const cell = state.grid.cells[rowIndex]?.[columnIndex];
            if (cell?.active) {
              cell.supercharged = !cell.supercharged;
            }
          });
        },

        setCellActive: (rowIndex, columnIndex, active) => {
          set((state) => {
            const cell = state.grid.cells[rowIndex]?.[columnIndex];
            if (cell) {
              cell.active = active;
              if (!active) {
                cell.supercharged = false;
              }
            }
          });
        },

        setCellSupercharged: (rowIndex, columnIndex, supercharged) => {
          set((state) => {
            const cell = state.grid.cells[rowIndex]?.[columnIndex];
            if (cell?.active) {
              cell.supercharged = supercharged;
            } else if (cell && !cell.active && supercharged) {
              // console.warn("Attempted to supercharge an inactive cell.");
            }
          });
        },

        activateRow: (rowIndex: number) => {
          set((state) => {
            if (state.grid.cells[rowIndex]) {
              state.grid.cells[rowIndex].forEach((cell: Cell) => {
                cell.active = true;
              });
            }
          });
        },

        deActivateRow: (rowIndex: number) => {
          set((state) => {
            if (state.grid.cells[rowIndex]) {
              state.grid.cells[rowIndex].forEach((cell: Cell) => {
                cell.active = false;
                cell.supercharged = false;
              });
            }
          });
        },

        hasTechInGrid: (tech: string): boolean => {
          const grid = get().grid;
          return grid.cells.some((row) => row.some((cell) => cell.tech === tech));
        },

        isGridFull: (): boolean => {
          const grid = get().grid;
          const activeCells = grid.cells.flat().filter((cell) => cell.active);
          if (activeCells.length === 0) {
             return false;
          }
          return activeCells.every((cell) => cell.module !== null);
        },

        resetGridTech: (tech: string) => {
          set((state) => {
            state.grid.cells.forEach((row: Cell[]) => {
              row.forEach((cell: Cell) => {
                if (cell.tech === tech) {
                  const { active, supercharged } = cell;
                  Object.assign(cell, createEmptyCell(supercharged, active));
                  cell.tech = null;
                }
              });
            });
          });
        },
      })
    ),
    // --- Persist Configuration ---
    {
      name: "grid-storage",
      storage: debouncedStorage, // Use the storage object with the specifically debounced setItem
      partialize: (state) => ({
        grid: state.grid,
        isSharedGrid: state.isSharedGrid,
      }),
    }
  )
);

// Remember to install immer: npm install immer or yarn add immer

