// src/store/GridStore.ts
import { create } from "zustand";
import { persist, type StorageValue } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { useTechStore } from "./TechStore";

// --- Define the specific function type we are debouncing ---
type SetItemFunction = (name: string, value: StorageValue<Partial<GridStore>>) => Promise<void>;

/**
 * Creates a debounced version of the specific setItem function that delays
 * calling the original function until `msToWait` milliseconds have passed
 * since the last time the debounced function was called.
 *
 * This is useful for debouncing the storage of the grid state to prevent
 * excessive writes to the browser's storage.
 *
 * @param {SetItemFunction} setItemFn The specific setItem function to debounce
 * @param {number} msToWait The number of milliseconds to wait
 * @returns {(name: string, value: StorageValue<Partial<GridStore>>) => Promise<void>} A debounced version of the setItem function
 */
function debounceSetItem(
	setItemFn: SetItemFunction,
	msToWait: number
): (name: string, value: StorageValue<Partial<GridStore>>) => Promise<void> {
	let timeoutId: number | null = null;

	// Return a function that matches the SetItemFunction signature
	return async (name: string, value: StorageValue<Partial<GridStore>>): Promise<void> => {
		try {
			// Cancel the existing timeout if it exists
			if (timeoutId !== null) clearTimeout(timeoutId);

			// Set a new timeout for the wait period
			timeoutId = window.setTimeout(async () => {
				// Call the original async function
				await setItemFn(name, value);
			}, msToWait);
		} catch (error) {
			// Handle any exceptions that may occur
			console.error("Error in debounceSetItem:", error);
		}
	};
}

// --- Define types (Cell, Grid, ApiResponse) ---
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
	grid: Grid | null; // Grid can be null if "Pattern No Fit"
	max_bonus: number;
	solved_bonus: number;
	solve_method: string;
};

// --- Utility functions (createEmptyCell, createGrid) ---
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
	cells: Array.from({ length: height }, () =>
		Array.from({ length: width }, () => createEmptyCell(false, true))
	),
	width,
	height,
});

// --- Zustand Store Interface (GridStore) ---
export type GridStore = {
	grid: Grid;
	result: ApiResponse | null;
	isSharedGrid: boolean;
	setGrid: (grid: Grid) => void;
	resetGrid: () => void;
	setGridAndResetAuxiliaryState: (newGrid: Grid) => void; // New action
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
		try {
			const storageValue = JSON.stringify(value);
			localStorage.setItem(name, storageValue);
		} catch (e) {
			console.error("Failed to save to localStorage:", e);
		}
	}, 500),

	getItem: (name: string): StorageValue<Partial<GridStore>> | null => {
		try {
			// Check if the current URL indicates a shared grid.
			// We look for the presence of 'grid' and 'platform' parameters.
			const currentUrlParams = new URLSearchParams(window.location.search);
			const isUrlLikelyShared = currentUrlParams.has("grid");

			if (isUrlLikelyShared && name === "grid-storage") {
				// If it's a shared grid URL, ignore localStorage for initial hydration
				// by returning null. This forces the store to use its default initial state.
				// The useUrlSync hook will then populate the grid from the URL.
				return null;
			}

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

const getWindowSearch = () =>
	typeof window === "undefined" || !window.location ? "" : window.location.search;

// --- Create the store using persist and immer middleware ---
export const useGridStore = create<GridStore>()(
	persist(
		immer((set, get) => ({
			// --- State properties ---
			grid: createGrid(10, 6),
			result: null,
			isSharedGrid: new URLSearchParams(getWindowSearch()).has("grid"), // Initialize based on current URL

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

			setGridAndResetAuxiliaryState: (newGrid) => {
				set((state) => {
					state.grid = newGrid; // Set the fully prepared grid
					state.result = null;
					state.isSharedGrid = false; // A new grid selection means it's not a shared link being viewed
				});
				useTechStore.getState().clearResult(); // Clear associated tech results
			},

			setResult: (result, tech) => {
				const { setTechMaxBonus, setTechSolvedBonus, setTechSolveMethod } = useTechStore.getState();
				set((state) => {
					state.result = result;
				});
				if (result) {
					setTechMaxBonus(tech, result.max_bonus);
					setTechSolvedBonus(tech, result.solved_bonus);
					setTechSolveMethod(tech, result.solve_method);
				}
			},

			toggleCellActive: (rowIndex, columnIndex) => {
				set((state) => {
					const cell = state.grid.cells[rowIndex]?.[columnIndex];
					if (cell && (!cell.active || !cell.module)) {
						cell.active = !cell.active;
						if (!cell.active) {
							cell.supercharged = false;
						}
					} else if (cell && cell.module) {
						console.warn(
							`Cannot deactivate cell [${rowIndex}, ${columnIndex}] because it contains a module.`
						);
					} else {
						console.error(`Cell not found at [${rowIndex}, ${columnIndex}]`);
					}
				});
			},

			toggleCellSupercharged: (rowIndex, columnIndex) =>
				set((state) => {
					const cell = state.grid.cells[rowIndex]?.[columnIndex];
					if (cell?.active) {
						cell.supercharged = !cell.supercharged;
					}
				}),

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
					if (cell) {
						if (cell.active || (!cell.active && !supercharged)) {
							cell.supercharged = supercharged;
						}
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
				let hasActiveCells = false;
				for (const row of grid.cells) {
					for (const cell of row) {
						if (cell.active) {
							hasActiveCells = true;
							if (cell.module === null) {
								return false; // Found an active cell without a module, so not full
							}
						}
					}
				}
				// If loop completes: all active cells had modules OR no active cells were found.
				// Returns true if there were active cells and all were full, false otherwise.
				return hasActiveCells;
			},

			resetGridTech: (tech: string) => {
				set((state) => {
					state.grid.cells.forEach((row: Cell[]) => {
						row.forEach((cell: Cell) => {
							if (cell.tech === tech) {
								// Preserve active and supercharged status from the original cell
								// createEmptyCell will handle resetting other fields, including setting tech to null.
								Object.assign(cell, createEmptyCell(cell.supercharged, cell.active));
							}
						});
					});
				});
			},
		})),
		// --- Persist Configuration ---
		{
			name: "grid-storage",
			storage: debouncedStorage, // Use the storage object with the specifically debounced setItem
			partialize: (state) => ({
				grid: state.grid,
				isSharedGrid: state.isSharedGrid,
				// Note: 'result' is not persisted, which is often intended for transient API responses.
			}),
			/**
			 * Custom merge function to ensure `isSharedGrid` is always
			 * determined by the URL at the time of hydration, overriding any
			 * persisted value for this specific flag.
			 */
			merge: (persistedState, currentState) => {
				const stateFromStorage = persistedState as Partial<GridStore>; // Cast persistedState
				const currentUrlHasGrid = new URLSearchParams(getWindowSearch()).has("grid");
				return {
					...currentState, // Default state from create()
					...stateFromStorage, // State from localStorage (if getItem didn't return null)
					isSharedGrid: currentUrlHasGrid, // Always prioritize URL for this flag
				};
			},
		}
	)
);
