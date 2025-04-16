// src/components/GridContainer/GridContainer.tsx
import React, { useState, useEffect, useRef, Suspense } from "react"; // Import Suspense
import GridTable from "../GridTable/GridTable";
import TechTreeComponent from "../TechTree/TechTree";
import { useGridStore } from "../../store/GridStore";
import { useOptimize } from "../../hooks/useOptimize";
import { Box, Flex, ScrollArea } from "@radix-ui/themes";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import {
  useFetchShipTypesSuspense,
  useShipTypesStore,
  ShipTypeDetail,
} from "../../hooks/useShipTypes";
import { useFetchTechTreeSuspense } from "../../hooks/useTechTree"; // Import the hook needed for data
import ShipSelection from "../ShipSelection/ShipSelection";
import MessageSpinner from "../MessageSpinner/MessageSpinner"; // Import a fallback component

interface GridContainerProps {
  setShowChangeLog: React.Dispatch<React.SetStateAction<boolean>>;
  setShowInstructions: React.Dispatch<React.SetStateAction<boolean>>;
}

const GridContainer: React.FC<GridContainerProps> = ({ setShowChangeLog, setShowInstructions }) => {
  const { solving, handleOptimize, gridContainerRef } = useOptimize();
  const { grid, result, activateRow, deActivateRow, resetGrid, setIsSharedGrid } = useGridStore();

  // Fetch ship types (suspends if not ready)
  const shipTypes = useFetchShipTypesSuspense();
  const selectedShipType = useShipTypesStore((state) => state.selectedShipType);

  // --- Ensure Tech Tree Data is Fetched ---
  // Call the hook here directly. This triggers the data fetch and any side effects
  // within the hook (like setting tech colors). It will suspend if data isn't ready.
  useFetchTechTreeSuspense(selectedShipType);
  // --- End Data Fetching ---

  const selectedShipTypeDetails: ShipTypeDetail | undefined = shipTypes[selectedShipType];
  const selectedShipTypeLabel = selectedShipTypeDetails?.label || "Unknown Ship Type";

  const gridRef = useRef<HTMLDivElement>(null);
  const [gridHeight, setGridHeight] = useState<number | null>(null);
  const isLarge = useBreakpoint("1024px");
  const [isSharedGridLocal, setIsSharedGridLocal] = useState(false);

  useEffect(() => {
    // Function to calculate and set grid height for the sidebar
    const updateGridHeight = () => {
      // Only calculate height if the sidebar is visible (large screen, not shared grid)
      if (isLarge && !isSharedGridLocal && gridRef.current) {
        setGridHeight(gridRef.current.getBoundingClientRect().height);
      } else {
        setGridHeight(null); // Reset height if sidebar isn't shown or needed
      }
    };

    // Function to handle URL changes affecting shared state
    const handlePopState = () => {
      const newUrl = new URL(window.location.href);
      const isShared = newUrl.searchParams.has("grid");
      setIsSharedGridLocal(isShared);
      setIsSharedGrid(isShared); // Update global store as well
    };

    // Initial setup: Check URL for shared state
    const url = new URL(window.location.href);
    const isShared = url.searchParams.has("grid");
    setIsSharedGridLocal(isShared);
    setIsSharedGrid(isShared);

    // Initial height calculation (debounced slightly for layout stability)
    const timerId = setTimeout(updateGridHeight, 100);

    // Add event listeners
    window.addEventListener("resize", updateGridHeight);
    window.addEventListener("popstate", handlePopState);

    // Cleanup function
    return () => {
      clearTimeout(timerId);
      window.removeEventListener("resize", updateGridHeight);
      window.removeEventListener("popstate", handlePopState);
    };
    // Recalculate height/shared state if these dependencies change
  }, [isLarge, isSharedGridLocal, grid, setIsSharedGrid]);


  const handleOptimizeWrapper = (tech: string) => {
    return handleOptimize(tech);
  };

  // --- Wrap JSX in Suspense ---
  // Because useFetchShipTypesSuspense and useFetchTechTreeSuspense can suspend,
  // we need a Suspense boundary.
  return (
    <Suspense fallback={<MessageSpinner solving={true} initialMessage="Loading Data..." />}>
      <Box className="p-6 pt-3 border-t-1 lg:p-8 md:p-8 md:pt-4 gridContainer" style={{ borderColor: "var(--gray-a4)" }} ref={gridContainerRef}>
        <Flex className="flex-col items-start gridContainer__layout lg:flex-row">
          {/* Grid Section */}
          <Box className="flex-grow w-auto gridContainer__grid lg:flex-shrink-0" ref={gridRef}>
            <h2 className="flex flex-wrap items-start gap-2 mb-4 text-2xl font-semibold tracking-widest uppercase sidebar__title">
              {/* Conditionally render ShipSelection based on shared state */}
              {!isSharedGridLocal && (
                <span className="flex-shrink-0">
                  <ShipSelection solving={solving} />
                </span>
              )}
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

          {/* Tech Tree Section (Conditionally Rendered UI) */}
          {!isSharedGridLocal && ( // Only render this section's UI if not a shared grid
            isLarge ? (
              // Desktop/Large Screen View
              <ScrollArea
                className={`gridContainer__sidebar p-4 ml-4 border shadow-md rounded-xl backdrop-blur-xl border-white/5`}
                // Set height dynamically based on the grid's height
                style={{ height: gridHeight ? `${gridHeight}px` : 'auto' }}
              >
                {/* TechTreeComponent handles its own internal suspense/loading */}
                <TechTreeComponent handleOptimize={handleOptimizeWrapper} solving={solving} />
              </ScrollArea>
            ) : (
              // Mobile View: Tech Tree below grid
              <Box className="z-10 items-start flex-grow-0 flex-shrink-0 w-full pt-8">
                {/* TechTreeComponent handles its own internal suspense/loading */}
                <TechTreeComponent handleOptimize={handleOptimizeWrapper} solving={solving} />
              </Box>
            )
          )}
        </Flex>
      </Box>
    </Suspense>
  );
};
export default GridContainer;
