// src/hooks/useOptimize.tsx
import { useState, useCallback, useEffect, useRef } from "react";
import { useGridStore, Grid, ApiResponse } from "../store/GridStore";
import { useOptimizeStore } from "../store/OptimizeStore";
import { API_URL } from "../constants";
import { useTechStore } from "../store/TechStore";
import { useShipTypesStore } from "./useShipTypes";
import ReactGA from 'react-ga4'

interface UseOptimizeReturn {
  solving: boolean;
  handleOptimize: (tech: string) => Promise<void>;
  gridContainerRef: React.MutableRefObject<HTMLDivElement | null>;
  showError: boolean;
  setShowError: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useOptimize = (): UseOptimizeReturn => {
  const { setGrid, setResult, grid } = useGridStore();
  const [solving, setSolving] = useState<boolean>(false);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const { showError, setShowError: setShowErrorStore } = useOptimizeStore();
  const { checkedModules } = useTechStore();
  const selectedShipType = useShipTypesStore((state) => state.selectedShipType);

  useEffect(() => {
    if (solving && gridContainerRef.current) {
      const element = gridContainerRef.current;
      const offset = 16;

      const elementRect = element.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.pageYOffset;
      const targetScrollPosition = absoluteElementTop - offset;

      window.scrollTo({
        top: targetScrollPosition,
        behavior: "smooth",
      });
    }
  }, [solving]);

  // --- Optimization Request Logic ---
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

        ReactGA.event({
          category: 'User Interactions',
          action: 'optimize',
          label: selectedShipType + ' ' + tech,
        });

        const response = await fetch(API_URL + "/optimize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ship: selectedShipType,
            tech,
            player_owned_rewards: checkedModules[tech] || [],
            grid: updatedGrid,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to fetch data: ${response.status} ${response.statusText}`);
        }

        const data: ApiResponse = await response.json();
        setResult(data, tech);
        setGrid(data.grid);
        console.log("Response from API:", data.grid);
      } catch (error) {
        console.error("Error during optimization:", error);
        setResult(null, tech);
        setShowErrorStore(true);
      } finally {
        setSolving(false);
      }
    },
    [grid, setGrid, setResult, setShowErrorStore, checkedModules, selectedShipType]
  );

  const setShowError: React.Dispatch<React.SetStateAction<boolean>> = (value) => {
    if (typeof value === "function") {
      setShowErrorStore(value(showError));
    } else {
      setShowErrorStore(value);
    }
  };

  return { solving, handleOptimize, gridContainerRef, showError, setShowError };
};
