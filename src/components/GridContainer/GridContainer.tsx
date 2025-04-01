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

const GridContainer: React.FC<GridContainerProps> = ({ setShowChangeLog, setShowInstructions }) => {
  const { solving, handleOptimize, gridContainerRef } = useOptimize();
  const { grid, result, activateRow, deActivateRow, resetGrid } = useGridStore();

  const shipTypes = useFetchShipTypesSuspense();
  const selectedShipType = useShipTypesStore((state) => state.selectedShipType);
  const selectedShipTypeLabel = shipTypes[selectedShipType] || "Unknown Ship Type";

  const gridRef = useRef<HTMLDivElement>(null);
  const [gridHeight, setGridHeight] = useState<number | null>(null);
  const isLarge = useBreakpoint("1024px");

  // State for shared grid (moved to the top)
  const [isSharedGrid, setIsSharedGrid] = useState(false);

  useEffect(() => {
    // Combined useEffect for URL and grid height
    const updateGridHeight = () => {
      const gridElement = document.querySelector(".gridContainer__grid");
      if (gridElement) {
        setGridHeight(gridElement.getBoundingClientRect().height);
      }
    };

    const handlePopState = () => {
      const newUrl = new URL(window.location.href);
      setIsSharedGrid(newUrl.searchParams.has("grid"));
    };

    const url = new URL(window.location.href);
    setIsSharedGrid(url.searchParams.has("grid"));

    updateGridHeight();
    window.addEventListener("resize", updateGridHeight);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener("resize", updateGridHeight);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [grid]);

  const handleOptimizeWrapper = (tech: string) => {
    return handleOptimize(tech);
  };

  return (
    <Box className="p-6 border-t-1 sm:p-8 gridContainer" style={{ borderColor: "var(--gray-a4)" }} ref={gridContainerRef}>
      <Flex className="flex-col items-start gridContainer__layout lg:flex-row">
        <Box className="flex-grow w-auto gridContainer__grid lg:flex-shrink-0" ref={gridRef}>
          <h2 className="flex flex-wrap items-start gap-2 mb-4 text-2xl font-semibold tracking-widest uppercase sidebar__title">
            <Tooltip content="Select Ship Type">
              <span className={`flex-shrink-0 ${isSharedGrid ? '!hidden' : ''}`}>
              
                <ShipSelection />
              </span>
            </Tooltip>
            <span className="hidden sm:inline" style={{ color: "var(--accent-11)" }}>PLATFORM:</span>
            <span className="flex-1 min-w-0">{selectedShipTypeLabel}</span>
          </h2>

          <GridTable
            grid={grid}
            solving={solving}
            shared={isSharedGrid}
            result={result}
            activateRow={activateRow}
            deActivateRow={deActivateRow}
            resetGrid={resetGrid}
            setShowChangeLog={setShowChangeLog}
            setShowInstructions={setShowInstructions}
          />
        </Box>

        {isLarge ? (
          <ScrollArea
            className={`p-4 ml-4 shadow-lg rounded-xl gridContainer__sidebar ${isSharedGrid ? '!hidden' : ''}`}
            style={{
              height: `${gridHeight}px`,
            }}
          >
            <TechTreeComponent handleOptimize={handleOptimizeWrapper} solving={solving} />
          </ScrollArea>
        ) : (
          <Box className="z-10 items-start flex-grow-0 flex-shrink-0 w-full pt-8">
            <TechTreeComponent handleOptimize={handleOptimizeWrapper} solving={solving} />
          </Box>
        )}
      </Flex>
    </Box>
  );
};
export default GridContainer;
