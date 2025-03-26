// src/components/GridContainer/GridContainer.tsx
import React from "react";
import GridTable from "../GridTable/GridTable";
import TechTreeComponent from "../TechTree/TechTree";
import { useGridStore } from "../../store/useGridStore";
import { useOptimize } from "../../hooks/useOptimize";
import { Box, Flex, ScrollArea } from "@radix-ui/themes";
import { useBreakpoint } from "../../hooks/useBreakpoint"; // Import useBreakpoint

interface GridContainerProps {
  setShowChangeLog: React.Dispatch<React.SetStateAction<boolean>>;
  setShowInstructions: React.Dispatch<React.SetStateAction<boolean>>;
}

const GridContainer: React.FC<GridContainerProps> = ({ setShowChangeLog, setShowInstructions }) => {
  const { solving, handleOptimize, gridContainerRef } = useOptimize(); // Get gridContainerRef
  const {
    grid,
    result,
    activateRow,
    deActivateRow,
    resetGrid,
  } = useGridStore();

  const isLarge = useBreakpoint("1024px"); // lg breakpoint in Tailwind // Use the hook

  return (
    <Box className="optimizer__grid-container" ref={gridContainerRef}> {/* Attach the ref here */}
      <Flex className="flex-col items-start optimizer__layout lg:flex-row">
        {/* Main Content */}
        <Box className="flex-grow w-auto pt-2 optimizer__grid lg:flex-shrink-0">
          <GridTable
            grid={grid}
            solving={solving}
            result={result}
            activateRow={activateRow}
            deActivateRow={deActivateRow}
            resetGrid={resetGrid}
            setShowChangeLog={setShowChangeLog}
            setShowInstructions={setShowInstructions}
          />
        </Box>

        {/* Sidebar */}
        {isLarge ? (
          <ScrollArea
            className="p-4 ml-4 rounded-xl optimizer__sidebar"
            style={{
              backgroundColor: "var(--gray-a3)",
              width: "320px",
            }}
          >
            <TechTreeComponent
              handleOptimize={handleOptimize}
              solving={solving}
            />
          </ScrollArea>
        ) : (
          <Box className="z-10 items-start flex-grow-0 flex-shrink-0 w-full pt-8 sidebar">
            <TechTreeComponent
              handleOptimize={handleOptimize}
              solving={solving}
            />
          </Box>
        )}
      </Flex>
    </Box>
  );
};

export default GridContainer;
