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
  cells: Array.from({ length: height }, () =>
    Array.from({ length: width }, () =>
      // createEmptyCell(false, rowIndex >= height - 3 ? false : true) // Original line: Bottom 3 rows inactive
      createEmptyCell(false, true) // Modified line: All cells active
    )  ),
  width,
  height,
});

// Zustand Store
type GridStore = {
  grid: Grid;
  result: ApiResponse | null;
  setGrid: (grid: Grid) => void;
  resetGrid: () => void;
  setResult: (result: ApiResponse | null, tech: string) => void;
  activateRow: (rowIndex: number) => void;
  deActivateRow: (rowIndex: number) => void;
  hasTechInGrid: (tech: string) => boolean;
  resetGridTech: (tech: string) => void;
  serializeGrid: () => string;
  deserializeGrid: (serializedGrid: string) => void;
  toggleCellActive: (rowIndex: number, columnIndex: number) => void;
  toggleCellSupercharged: (rowIndex: number, columnIndex: number) => void;
  setCellActive: (rowIndex: number, columnIndex: number, active: boolean) => void;
  setCellSupercharged: (rowIndex: number, columnIndex: number, supercharged: boolean) => void;
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
    set({ result });
    if (result) {
      useTechStore.getState().setMaxBonus(tech, result.max_bonus);
    }
  },

  toggleCellActive: (rowIndex, columnIndex) => {
    set((state) => ({
      grid: {
        ...state.grid,
        cells: state.grid.cells.map((row, rIdx) =>
          row.map((cell, cIdx) =>
            rIdx === rowIndex && cIdx === columnIndex
              ? { ...cell, active: !cell.active, supercharged: !cell.active ? false : cell.supercharged }
              : cell
          )
        ),
      },
    }));
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
            row.map((cell, cIdx) =>
              rIdx === rowIndex && cIdx === columnIndex
                ? { ...cell, supercharged: !cell.supercharged }
                : cell
            )
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
              ? { ...cell, active: active, supercharged: active ? cell.supercharged : false }
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
            row.map((cell, cIdx) =>
              rIdx === rowIndex && cIdx === columnIndex
                ? { ...cell, supercharged: supercharged }
                : cell
            )
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

  serializeGrid: () => {
    const { grid } = get();
    const serializedCells = grid.cells.map((row) =>
      row.map((cell) => {
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
          module: hasModule ? "module" : null,
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
