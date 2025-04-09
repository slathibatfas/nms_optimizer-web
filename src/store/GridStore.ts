// src/store/GridStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useTechStore } from "./TechStore";

// Define types
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

// Utility functions
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

// Zustand Store
export type GridStore = {
  grid: Grid;
  result: ApiResponse | null;
  setGrid: (grid: Grid) => void;
  resetGrid: () => void;
  setResult: (result: ApiResponse | null, tech: string) => void;
  activateRow: (rowIndex: number) => void;
  deActivateRow: (rowIndex: number) => void;
  hasTechInGrid: (tech: string) => boolean;
  isGridFull: (tech: string) => boolean;
  resetGridTech: (tech: string) => void;
  toggleCellActive: (rowIndex: number, columnIndex: number) => void;
  toggleCellSupercharged: (rowIndex: number, columnIndex: number) => void;
  setCellActive: (rowIndex: number, columnIndex: number, active: boolean) => void;
  setCellSupercharged: (rowIndex: number, columnIndex: number, supercharged: boolean) => void;
  isSharedGrid: boolean; // New state variable
  setIsSharedGrid: (isShared: boolean) => void; // New setter function
};

export const useGridStore = create<GridStore>()(
  persist(
    (set, get) => ({
      grid: createGrid(10, 6),
      result: null,
      isSharedGrid: false, // Initial value
      setIsSharedGrid: (isShared) => set({ isSharedGrid: isShared }),

      setGrid: (grid) => set({ grid }),
      resetGrid: () => {
        set((state) => ({
          grid: createGrid(state.grid.width, state.grid.height),
          result: null,
        }));
        useTechStore.getState().clearResult();
      },

      setResult: (result, tech) => {
        const { setTechSolvedBonus } = useTechStore.getState();

        set({ result });
        if (result) {
          useTechStore.getState().setTechMaxBonus(tech, result.max_bonus);
          setTechSolvedBonus(tech, result.solved_bonus);
        }
      },
  toggleCellActive: (rowIndex, columnIndex) => {
    set((state) => {
      const currentGrid = state.grid;
      const targetCell = currentGrid.cells[rowIndex]?.[columnIndex];

      if (!targetCell) {
        console.error(`Cell not found at [${rowIndex}, ${columnIndex}]`);
        return {}; // Return unchanged state or handle error appropriately
      }

      const newActiveState = !targetCell.active;
      let newSuperchargedState = targetCell.supercharged;

      // --- This is the key logic addition ---
      // If the cell is being deactivated, also remove supercharged status.
      if (!newActiveState) {
        newSuperchargedState = false;
      }
      // --- End of addition ---

      // Create a new grid state immutably
      const newCells = currentGrid.cells.map((row, rIdx) =>
        row.map((cell, cIdx) => {
          if (rIdx === rowIndex && cIdx === columnIndex) {
            return {
              ...cell,
              active: newActiveState,
              supercharged: newSuperchargedState, // Update supercharged state here
            };
          }
          return cell;
        })
      );

      return { grid: { ...currentGrid, cells: newCells } };
    });
  },


      toggleCellSupercharged: (rowIndex, columnIndex) => {
        set((state) => {
          const currentCell = state.grid.cells[rowIndex][columnIndex];
          if (!currentCell.active) {
            return state; // Do nothing if the cell is not active
          }
          return {
            grid: {
              ...state.grid,
              cells: state.grid.cells.map((row, rIdx) =>
                row.map((cell, cIdx) => (rIdx === rowIndex && cIdx === columnIndex ? { ...cell, supercharged: !cell.supercharged } : cell))
              ),
            },
          };
        });
      },

      setCellActive: (rowIndex, columnIndex, active) => {
        set((state) => ({
          grid: {
            ...state.grid,
            cells: state.grid.cells.map((row, rIdx) =>
              row.map((cell, cIdx) =>
                rIdx === rowIndex && cIdx === columnIndex
                  ? {
                      ...cell,
                      active: active,
                      supercharged: active ? cell.supercharged : false,
                    }
                  : cell
              )
            ),
          },
        }));
      },

      setCellSupercharged: (rowIndex, columnIndex, supercharged) => {
        set((state) => {
          const currentCell = state.grid.cells[rowIndex][columnIndex];
          if (!currentCell.active) {
            return state; // Do nothing if the cell is not active
          }
          return {
            grid: {
              ...state.grid,
              cells: state.grid.cells.map((row, rIdx) =>
                row.map((cell, cIdx) => (rIdx === rowIndex && cIdx === columnIndex ? { ...cell, supercharged: supercharged } : cell))
              ),
            },
          };
        });
      },

      activateRow: (rowIndex: number) => {
        set((state) => ({
          grid: {
            ...state.grid,
            cells: state.grid.cells.map((row, rIdx) => (rIdx === rowIndex ? row.map((cell) => ({ ...cell, active: true })) : row)),
          },
        }));
      },

      deActivateRow: (rowIndex: number) => {
        set((state) => ({
          grid: {
            ...state.grid,
            cells: state.grid.cells.map((row, rIdx) => (rIdx === rowIndex ? row.map((cell) => ({ ...cell, active: false })) : row)),
          },
        }));
      },

      hasTechInGrid: (tech: string): boolean => {
        const { grid } = get();
        return grid.cells.some((row) => row.some((cell) => cell.tech === tech));
      },

      resetGridTech: (tech: string) => {
        set((state) => ({
          grid: {
            ...state.grid,
            cells: state.grid.cells.map((row) =>
              row.map((cell) =>
                cell.tech === tech
                  ? {
                      ...createEmptyCell(cell.supercharged, cell.active),
                      tech: null,
                    }
                  : cell
              )
            ),
          },
        }));
      },
      isGridFull: (): boolean => {
        const { grid } = get();
        const activeCells = grid.cells.flat().filter((cell) => cell.active);
        const allActiveCellsHaveModules = activeCells.every((cell) => cell.module !== null);
        return allActiveCellsHaveModules;
      },
    }),
    {
      name: "grid-storage", // unique name
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
