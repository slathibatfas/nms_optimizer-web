// src/hooks/useOptimize.tsx
import { useState, useCallback } from "react";
import { useGridStore, Grid, ApiResponse } from "../store/useGridStore"; // Import useGridStore
import { API_URL } from "../constants";

export const useOptimize = () => {
  const { setGrid, setResult, grid } = useGridStore(); // Get serializeGrid
  const [solving, setSolving] = useState<boolean>(false);

  // Remove updateUrl function

  const handleOptimize = useCallback(
    async (tech: string) => {
      setSolving(true);
      try {
        const updatedGrid: Grid = {
          ...grid,
          cells: grid.cells.map((row) =>
            row.map((cell) =>
              cell.tech === tech
                ? {
                    ...cell,
                    module: null,
                    label: "",
                    type: "",
                    bonus: 0.0,
                    adjacency_bonus: 0.0,
                    total: 0.0,
                    value: 0,
                    image: null,
                    adjacency: false,
                    sc_eligible: false,
                    tech: null,
                  }
                : cell
            )
          ),
        };

        const response = await fetch(API_URL + "/optimize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ship: "Exotic",
            tech,
            grid: updatedGrid,
          }),
        });

        if (!response.ok) throw new Error("Failed to fetch data");

        const data: ApiResponse = await response.json();
        setResult(data, tech);
        setGrid(data.grid);
        console.log("Response from API:", data.grid);
        // Remove updateUrl();
      } catch (error) {
        console.error("Error during optimization:", error);
        setResult(null, tech);
      } finally {
        console.log("useOptimize: finally block called");
        setSolving(false);
      }
    },
    [grid, setGrid, setResult] // Remove updateUrl from the dependency array
  );

  return { solving, handleOptimize };
};
