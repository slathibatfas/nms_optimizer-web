// src/hooks/useOptimize.tsx
import { useState, useCallback, useEffect, useRef } from "react";
import { useGridStore, Grid, ApiResponse } from "../store/GridStore";
import { useOptimizeStore } from "../store/OptimizeStore";
import { API_URL } from "../constants";
import { useTechStore } from "../store/TechStore";
import { useShipTypesStore } from "./useShipTypes";
import { useBreakpoint } from "./useBreakpoint";
import ReactGA from 'react-ga4'

interface UseOptimizeReturn {
  solving: boolean;
  handleOptimize: (tech: string, forced?: boolean) => Promise<void>;
  gridContainerRef: React.MutableRefObject<HTMLDivElement | null>;
  showError: boolean;
  setShowError: React.Dispatch<React.SetStateAction<boolean>>;
  patternNoFitTech: string | null;
  clearPatternNoFitTech: () => void; // To allow UI to clear the PNF state (e.g., on dialog cancel)
  // New handler for the dialog's "Force Optimize" action
  handleForceCurrentPnfOptimize: () => Promise<void>;
}

export const useOptimize = (): UseOptimizeReturn => {
  const { setGrid, setResult, grid } = useGridStore();
  const [solving, setSolving] = useState<boolean>(false);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const { showError, setShowError: setShowErrorStore, patternNoFitTech, setPatternNoFitTech } = useOptimizeStore();
  const { checkedModules } = useTechStore();
  const selectedShipType = useShipTypesStore((state) => state.selectedShipType);
  const isLarge = useBreakpoint("1024px");

  useEffect(() => {
    if (solving && gridContainerRef.current && !isLarge) {
      const element = gridContainerRef.current;
      const offset = 0;

      const elementRect = element.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.pageYOffset;
      const targetScrollPosition = absoluteElementTop - offset;

      window.scrollTo({
        top: targetScrollPosition,
        behavior: "smooth",
      });
    }
  }, [isLarge, solving]);

  // --- Optimization Request Logic ---
  const handleOptimize = useCallback(
    async (tech: string, forced: boolean = false) => {
      setSolving(true);
      setShowErrorStore(false); // Clear previous errors

      // If forcing or re-optimizing a tech that previously hit PNF, clear its PNF status.
      if (forced || patternNoFitTech === tech) {
        setPatternNoFitTech(null);
      }

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

        const response = await fetch(API_URL + "optimize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ship: selectedShipType,
            tech,
            player_owned_rewards: checkedModules[tech] || [],
            grid: updatedGrid,
            forced,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to fetch data: ${response.status} ${response.statusText}`);
        }

        const data: ApiResponse = await response.json();

        if (data.solve_method === "Pattern No Fit" && data.grid === null && !forced) {
          setPatternNoFitTech(tech);
          console.log(`Pattern No Fit for ${tech}. User can force SA.`);
          ReactGA.event('optimize_no_fit', {
            platform: selectedShipType,
            tech: tech,
          });
          // Do not set grid or result yet, wait for user to force
        } else {
          // This block handles:
          // 1. Successful solve (not "Pattern No Fit")
          // 2. Successful FORCED solve
          // 3. API returning "Pattern No Fit" but with a grid (unexpected, but handled)
          if (patternNoFitTech === tech) { // Clear PNF if it was for the current tech
            setPatternNoFitTech(null);
          }
          setResult(data, tech);
          if (data.grid) {
            setGrid(data.grid);
          } else {
            console.warn("API response did not contain a grid for a successful or forced solve. Grid not updated.", data);
          }

          console.log("Response from API:", data);
          ReactGA.event('optimize_tech', {
            platform: selectedShipType,
            tech: tech,
            solve_method: data.solve_method,
          });
        }

      } catch (error) {
        console.error("Error during optimization:", error);
        setResult(null, tech); // Clear any previous results for this tech on error
        setShowErrorStore(true);
      } finally {
        setSolving(false);
      }
    },
    [grid, setGrid, setResult, setShowErrorStore, checkedModules, selectedShipType, patternNoFitTech, setPatternNoFitTech]
  );


  const setShowError: React.Dispatch<React.SetStateAction<boolean>> = (value) => {
    if (typeof value === "function") {
      setShowErrorStore(value(showError));
    } else {
      setShowErrorStore(value);
    }
  };

  const clearPatternNoFitTech = useCallback(() => {
    setPatternNoFitTech(null);
  }, [setPatternNoFitTech]);

  // New callback specifically for the PNF dialog's "Force" action
  const handleForceCurrentPnfOptimize = useCallback(async () => {
    // patternNoFitTech is from the useOptimizeStore()
    if (patternNoFitTech) {
      await handleOptimize(patternNoFitTech, true);
      // handleOptimize will internally call setPatternNoFitTech(null) when forced
    }
  }, [patternNoFitTech, handleOptimize]);

  return {
    solving,
    handleOptimize,
    gridContainerRef,
    showError, setShowError,
    patternNoFitTech, clearPatternNoFitTech,
    handleForceCurrentPnfOptimize,
  };

};
