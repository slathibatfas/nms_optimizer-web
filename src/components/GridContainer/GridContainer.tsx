// src/components/GridContainer/GridContainer.tsx
import React, { useState, useEffect, useRef, Suspense, useCallback } from "react";
import GridTable from "../GridTable/GridTable";
import TechTreeComponent from "../TechTree/TechTree";
import { useGridStore } from "../../store/GridStore";
import { useOptimize } from "../../hooks/useOptimize";
import { Box, Flex, ScrollArea, Tooltip } from "@radix-ui/themes";
import { useBreakpoint } from "../../hooks/useBreakpoint";
// Import the suspense hook and the store hook/types
import { useShipTypesStore, ShipTypeDetail, useFetchShipTypesSuspense } from "../../hooks/useShipTypes";
import ShipSelection from "../ShipSelection/ShipSelection";
import MessageSpinner from "../MessageSpinner/MessageSpinner";

interface GridContainerProps {
  setShowChangeLog: React.Dispatch<React.SetStateAction<boolean>>;
  setShowInstructions: React.Dispatch<React.SetStateAction<boolean>>;
}

const GridContainer: React.FC<GridContainerProps> = ({ setShowChangeLog, setShowInstructions }) => {
  const { solving, handleOptimize, gridContainerRef } = useOptimize();
  const { grid, result, activateRow, deActivateRow, resetGrid, setIsSharedGrid } = useGridStore();

  // Get selected ship type *from the store*
  const selectedShipType = useShipTypesStore((state) => state.selectedShipType);

  // Fetch ship types data using the suspense hook
  // This will suspend rendering until the data is loaded
  const shipTypes = useFetchShipTypesSuspense();

  // Derive details and label *after* shipTypes data is available
  const selectedShipTypeDetails: ShipTypeDetail | undefined = shipTypes ? shipTypes[selectedShipType] : undefined;
  const selectedShipTypeLabel = selectedShipTypeDetails?.label || `Unknown (${selectedShipType})`;

  // Refs and State for layout
  const gridRef = useRef<HTMLDivElement>(null);
  const [gridHeight, setGridHeight] = useState<number | null>(null);
  const isLarge = useBreakpoint("1024px");
  const [isSharedGridLocal, setIsSharedGridLocal] = useState(false);

  // Effect for handling shared grid state and dynamic height
  useEffect(() => {
    const updateGridHeight = () => {
      if (isLarge && !isSharedGridLocal && gridRef.current) {
        setGridHeight(gridRef.current.getBoundingClientRect().height);
      } else {
        setGridHeight(null);
      }
    };

    const handlePopState = () => {
      const newUrl = new URL(window.location.href);
      const isShared = newUrl.searchParams.has("grid");
      setIsSharedGridLocal(isShared);
      setIsSharedGrid(isShared);
    };

    const url = new URL(window.location.href);
    const isShared = url.searchParams.has("grid");
    setIsSharedGridLocal(isShared);
    setIsSharedGrid(isShared);

    const timerId = setTimeout(updateGridHeight, 100);
    window.addEventListener("resize", updateGridHeight);
    window.addEventListener("popstate", handlePopState);

    return () => {
      clearTimeout(timerId);
      window.removeEventListener("resize", updateGridHeight);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isLarge, isSharedGridLocal, grid, setIsSharedGrid]);

  // Memoize the optimize handler
  const handleOptimizeWrapper = useCallback(
    (tech: string) => {
      return handleOptimize(tech);
    },
    [handleOptimize]
  );

  // Wrap the main content in a Suspense boundary to handle data loading
  return (
    <Box className="p-6 pt-4 border-t-1 lg:p-8 md:p-8 md:pt-4 gridContainer" style={{ borderColor: "var(--gray-a4)" }} ref={gridContainerRef}>
      <Flex className="flex-col items-start gridContainer__layout lg:flex-row">
        {/* Grid Section */}
        <Box className="flex-grow w-auto gridContainer__grid lg:flex-shrink-0" ref={gridRef}>
          {/* Title and Platform Selection */}
          <h2 className="flex flex-wrap items-center gap-2 mb-4 text-xl font-semibold uppercase sm:text-2xl sidebar__title">
            {/* Show ShipSelection only if not a shared grid */}
            {!isSharedGridLocal && (
              <Tooltip content="Select Technology Platform" delayDuration={500}>
                <span className="flex-shrink-0">
                  {/* ShipSelection uses the same fetched shipTypes, no extra Suspense needed here */}
                  <ShipSelection solving={solving} />
                </span>
              </Tooltip>
            )}
            {/* Platform Label */}
            <span className="hidden sm:inline" style={{ color: "var(--accent-11)" }}>
              PLATFORM:
            </span>
            {/* Display the derived label (now correctly loaded) */}
            <span className="flex-1 min-w-0">{selectedShipTypeLabel}</span>
          </h2>

          {/* Grid Table Component */}
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

        {/* Tech Tree Section (Conditionally Rendered) */}
        {!isSharedGridLocal &&
          (isLarge ? (
            // Desktop: Scrollable sidebar
            <ScrollArea
              className={`gridContainer__sidebar p-4 ml-4 border shadow-md rounded-xl backdrop-blur-xl border-white/5`}
              style={{ height: gridHeight ? `${gridHeight}px` : "528px" }}
            >
              {/* Suspense for TechTree's internal data fetch */}
              <Suspense fallback={<MessageSpinner isInset={true} isVisible={true} initialMessage="Featching Technologies!" />}>
                <TechTreeComponent handleOptimize={handleOptimizeWrapper} solving={solving} />
              </Suspense>
            </ScrollArea>
          ) : (
            // Mobile: Tech Tree below GridTable
            <Box className="z-10 items-start flex-grow-0 flex-shrink-0 w-full pt-8">
              {/* Suspense for TechTree's internal data fetch */}
              <Suspense fallback={<MessageSpinner isInset={false} isVisible={true} initialMessage="Featching Technologies!" />}>
                <TechTreeComponent handleOptimize={handleOptimizeWrapper} solving={solving} />
              </Suspense>
            </Box>
          ))}
      </Flex>
    </Box>
  );
};

export default GridContainer;
