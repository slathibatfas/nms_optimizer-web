// src/hooks/useOptimize.tsx
import { useState, useCallback, useEffect, useRef } from "react";
import { useGridStore, Grid, ApiResponse } from "../store/useGridStore";
import { API_URL } from "../constants";

export const useOptimize = () => {
  const { setGrid, setResult, grid } = useGridStore();
  const [solving, setSolving] = useState<boolean>(false);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to top of GridContainer when solving changes to false
  // Scroll to top of GridContainer when solving changes to false
  useEffect(() => {
    if (!solving && gridContainerRef.current) {
      const element = gridContainerRef.current;
      const offset = 24; // Adjust this value to change the offset (in pixels)

      const elementRect = element.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.pageYOffset;
      const targetScrollPosition = absoluteElementTop - offset;

      window.scrollTo({
        top: targetScrollPosition,
        behavior: 'smooth',
      });
    }
  }, [solving]);

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
      } catch (error) {
        console.error("Error during optimization:", error);
        setResult(null, tech);
      } finally {
        console.log("useOptimize: finally block called");
        setSolving(false);
      }
    },
    [grid, setGrid, setResult]
  );

  return { solving, handleOptimize, gridContainerRef };
};
