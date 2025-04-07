// src/components/GridContainer/GridContainer.tsx
import React, { useState, useEffect, useRef } from "react";
import GridTable from "../GridTable/GridTable";
import TechTreeComponent from "../TechTree/TechTree";
import { useGridStore } from "../../store/GridStore";
import { useOptimize } from "../../hooks/useOptimize";
import { Box, Flex, ScrollArea, Tooltip } from "@radix-ui/themes";
import { useBreakpoint } from "../../hooks/useBreakpoint"; // Import useBreakpoint
import { useFetchShipTypesSuspense, useShipTypesStore } from "../../hooks/useShipTypes";
import ShipSelection from "../ShipSelection/ShipSelection";

interface GridContainerProps {
  setShowChangeLog: React.Dispatch<React.SetStateAction<boolean>>;
  setShowInstructions: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * GridContainer component that manages the main layout of the grid and sidebar.
 * It handles the display of the grid, ship selection, and tech tree components.
 *
 * @param {Object} props - The component props
 * @param {Function} props.setShowChangeLog - Function to set the visibility of the change log
 * @param {Function} props.setShowInstructions - Function to set the visibility of the instructions
 */
const GridContainer: React.FC<GridContainerProps> = ({ setShowChangeLog, setShowInstructions }) => {
  // Destructure necessary values and functions from hooks
  const { solving, handleOptimize, gridContainerRef } = useOptimize(); 
  const { grid, result, activateRow, deActivateRow, resetGrid, setIsSharedGrid } = useGridStore();

  // Fetch ship types and get the selected ship type
  const shipTypes = useFetchShipTypesSuspense();
  const selectedShipType = useShipTypesStore((state) => state.selectedShipType);
  const selectedShipTypeLabel = shipTypes[selectedShipType] || "Unknown Ship Type";

  // Refs and state for grid dimensions and shared grid status
  const gridRef = useRef<HTMLDivElement>(null);
  const [gridHeight, setGridHeight] = useState<number | null>(null);
  const isLarge = useBreakpoint("1024px");
  const [isSharedGridLocal, setIsSharedGridLocal] = useState(false);

  useEffect(() => {
    /**
     * Updates the height of the grid element.
     */
    const updateGridHeight = () => {
      const gridElement = document.querySelector(".gridContainer__grid");
      if (gridElement) {
        setGridHeight(gridElement.getBoundingClientRect().height);
      }
    };

    /**
     * Handles the popstate event to check for shared grid state in the URL.
     */
    const handlePopState = () => {
      const newUrl = new URL(window.location.href);
      const isShared = newUrl.searchParams.has("grid");
      setIsSharedGridLocal(isShared);
      setIsSharedGrid(isShared);
    };

    // Check for shared grid state on initial load
    const url = new URL(window.location.href);
    const isShared = url.searchParams.has("grid");
    setIsSharedGridLocal(isShared);
    setIsSharedGrid(isShared);

    // Initial setup
    updateGridHeight();
    window.addEventListener("resize", updateGridHeight);
    window.addEventListener("popstate", handlePopState);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", updateGridHeight);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [grid, setIsSharedGrid]);

  /**
   * Wrapper function for handleOptimize to be passed down to children components.
   *
   * @param {string} tech - The technology to optimize
   * @returns {Promise<void>}
   */
  const handleOptimizeWrapper = (tech: string) => {
    return handleOptimize(tech);
  };

  return (
    <Box className="p-6 pt-3 border-t-1 lg:p-8 md:p-8 md:pt-4 gridContainer" style={{ borderColor: "var(--gray-a4)" }} ref={gridContainerRef}>
      <Flex className="flex-col items-start gridContainer__layout lg:flex-row">
        <Box className="flex-grow w-auto gridContainer__grid lg:flex-shrink-0" ref={gridRef}>
          <h2 className="flex flex-wrap items-start gap-2 mb-4 text-2xl font-semibold tracking-widest uppercase sidebar__title">
            <Tooltip content="Select Ship Type">
              <span className={`flex-shrink-0 ${isSharedGridLocal ? '!hidden' : ''}`}>
                <ShipSelection solving={solving} /> {/* Pass the solving prop here */}
              </span>
            </Tooltip>
            <span className="hidden sm:inline" style={{ color: "var(--accent-11)" }}>PLATFORM:</span>
            <span className="flex-1 min-w-0">{selectedShipTypeLabel}</span>
          </h2>

          <GridTable
            grid={grid}
            solving={solving}
            shared={isSharedGridLocal}
            result={result}
            activateRow={activateRow}
            deActivateRow={deActivateRow}
            resetGrid={resetGrid}
            setShowChangeLog={setShowChangeLog}
            setShowInstructions={setShowInstructions}
          />
        </Box>

        {isLarge ? (
          !isSharedGridLocal && <ScrollArea
            className={`gridContainer__sidebar p-4 ml-4 border shadow-md rounded-xl backdrop-blur-xl border-white/5`}
            style={{
              height: `${gridHeight}px`,
            }}
          >
            <TechTreeComponent handleOptimize={handleOptimizeWrapper} solving={solving} />
          </ScrollArea>
        ) : (
          !isSharedGridLocal && <Box className="z-10 items-start flex-grow-0 flex-shrink-0 w-full pt-8">
            <TechTreeComponent handleOptimize={handleOptimizeWrapper} solving={solving} />
          </Box>
        )}
      </Flex>
    </Box>
  );
};
export default GridContainer;
