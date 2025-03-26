// src/store/useGridStore.ts
import { create } from "zustand";
import { useTechStore } from "./useTechStore"; // Import useTechStore

// Define types
export type Cell = {
  active: boolean;
  adjacency: boolean;
  adjacency_bonus: number;
  bonus: number;
  image: string | null;
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
};

// Utility functions
const createEmptyCell = (supercharged = false, active = true): Cell => ({
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

const createGrid = (width: number, height: number): Grid => ({
  cells: Array.from({ length: height }, (_, rowIndex) =>
    Array.from({ length: width }, () =>
      createEmptyCell(false, rowIndex >= height - 3 ? false : true)
    )
  ),
  width,
  height,
});

// Zustand Store
type GridStore = {
  grid: Grid;
  result: ApiResponse | null;
  setGrid: (grid: Grid) => void;
  resetGrid: () => void;
  setResult: (result: ApiResponse | null, tech: string) => void; // Add tech to setResult
  toggleCellState: (rowIndex: number, columnIndex: number, event: React.MouseEvent) => void;
  activateRow: (rowIndex: number) => void;
  deActivateRow: (rowIndex: number) => void;
  hasTechInGrid: (tech: string) => boolean;
  resetGridTech: (tech: string) => void;
  serializeGrid: () => string; // Add serializeGrid
  deserializeGrid: (serializedGrid: string) => void; // Add deserializeGrid
};

export const useGridStore = create<GridStore>((set, get) => ({
  grid: createGrid(10, 6),
  result: null,

  setGrid: (grid) => set({ grid }),
  resetGrid: () => {
    set((state) => ({
      grid: createGrid(state.grid.width, state.grid.height),
      result: null,
    }));
    useTechStore.getState().clearResult(); // Clear the max_bonus when the grid is reset
  },

  setResult: (result, tech) => {
    // Add tech to setResult
    set({ result });
    if (result) {
      useTechStore.getState().setMaxBonus(tech, result.max_bonus); // Update max_bonus in useTechStore with tech
    }
  },

  /**
   * Toggles the active or supercharged state based on Ctrl+Click.
   */
  toggleCellState: (rowIndex, columnIndex, event) => {
    set((state) => ({
      grid: {
        ...state.grid,
        cells: state.grid.cells.map((row, rIdx) =>
          row.map((cell, cIdx) => {
            if (rIdx === rowIndex && cIdx === columnIndex) {
              if (event.ctrlKey) {
                // Toggle active, and force supercharged to false if becoming inactive
                const newActiveState = !cell.active;
                return {
                  ...cell,
                  active: newActiveState,
                  supercharged: newActiveState ? cell.supercharged : false,
                };
              } else if (cell.active) {
                // Toggle supercharged only if active
                return { ...cell, supercharged: !cell.supercharged };
              }
            }
            return cell;
          })
        ),
      },
    }));
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
                } // Preserve supercharged state
              : cell
          )
        ),
      },
    }));
  },

  serializeGrid: () => {
    const { grid } = get();
    const serializedCells = grid.cells.map((row) =>
      row.map((cell) => {
        // Only include relevant properties for serialization
        return `${cell.active ? "1" : "0"}${cell.supercharged ? "1" : "0"}${cell.module ? "1" : "0"}${cell.tech ? cell.tech.charAt(0) : "0"}`;
      }).join("")
    ).join("|");
    return serializedCells;
  },

  deserializeGrid: (serializedGrid) => {
    const { grid } = get();
    const rows = serializedGrid.split("|");
    const newCells: Cell[][] = [];

    if (rows.length !== grid.height) {
      console.error("Invalid serialized grid height");
      return;
    }

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex];
      const newRow: Cell[] = [];

      if (row.length !== grid.width * 4) {
        console.error("Invalid serialized grid width");
        return;
      }

      for (let cellIndex = 0; cellIndex < grid.width; cellIndex++) {
        const cellString = row.substring(cellIndex * 4, (cellIndex + 1) * 4);
        const active = cellString[0] === "1";
        const supercharged = cellString[1] === "1";
        const hasModule = cellString[2] === "1";
        const tech = cellString[3] === "0" ? null : cellString[3];

        const newCell: Cell = {
          ...createEmptyCell(supercharged, active),
          module: hasModule ? "module" : null, // Placeholder for module
          tech: tech,
        };
        newRow.push(newCell);
      }
      newCells.push(newRow);
    }

    set({
      grid: {
        ...grid,
        cells: newCells,
      },
    });
  },
}));
