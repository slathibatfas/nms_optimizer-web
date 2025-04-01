// src/components/GridTable/GridTable.tsx
import { CounterClockwiseClockIcon, QuestionMarkCircledIcon, ResetIcon, Share1Icon } from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ApiResponse, Grid } from "../../store/GridStore";
import GridCell from "../GridCell/GridCell";
import GridControlButtons from "../GridControlButtons/GridControlButtons";
import ShakingWrapper from "../GridShake/GridShake";
import MessageSpinner from "../MessageSpinner/MessageSpinner";
import { useGridDeserializer } from "../../hooks/useGridDeserializer"; // Import useGridDeserializer

interface GridTableProps {
  grid: Grid;
  resetGrid: () => void;
  result: ApiResponse | null;
  activateRow: (rowIndex: number) => void;
  deActivateRow: (rowIndex: number) => void;
  solving: boolean;
  shared: boolean;
  setShowChangeLog: React.Dispatch<React.SetStateAction<boolean>>;
  setShowInstructions: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * A table component that displays a grid of cells, where each cell can be in
 * one of three states: normal, active, or supercharged. The component also
 * renders a set of buttons to activate or deactivate entire rows at once.
 *
 * @param {Grid} grid - The grid to display
 * @param {function} activateRow - A function to activate an entire row
 * @param {function} deActivateRow - A function to deactivate an entire row
 * @param {ApiResponse | null} result - The result of an optimization calculation,
 *   or null if no calculation has been done.
 * @param {function} resetGrid - A function to reset the grid
 */
const GridTable: React.FC<GridTableProps> = ({ grid, activateRow, deActivateRow, resetGrid, solving, setShowChangeLog, setShowInstructions }) => {
  const [shaking, setShaking] = React.useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const [columnWidth, setColumnWidth] = useState("40px");
  const { serializeGrid, deserializeGrid } = useGridDeserializer();
  const [isSharedGrid, setIsSharedGrid] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    setIsSharedGrid(url.searchParams.has("grid"));
  }, [resetGrid]);

  const handleShareClick = useCallback(() => {
    const serializedGrid = serializeGrid();
    console.log("GridTable.tsx: Serialized Grid (on Share button click):", serializedGrid); // Log serialized string
    const url = new URL(window.location.href);
    url.searchParams.set("grid", serializedGrid);
    const newWindow = window.open(url.toString(), "_blank", "noopener,noreferrer");
    if (newWindow) {
      // Deserialize the grid from the URL
      deserializeGrid(serializedGrid);
      newWindow.focus();
    }
  }, [serializeGrid, deserializeGrid]);

  const handleResetGrid = useCallback(() => {
    resetGrid(); // Call the original resetGrid function
    const url = new URL(window.location.href);
    url.searchParams.delete("grid"); // Remove the 'grid' query parameter
    window.history.pushState({}, "", url); // Update the URL without reloading
    setIsSharedGrid(false);
  }, [resetGrid]);

  useEffect(() => {
    const updateColumnWidth = () => {
      if (!gridRef.current) return;

      const computedStyle = window.getComputedStyle(gridRef.current);
      const gridTemplate = computedStyle.getPropertyValue("grid-template-columns").split(" ");

      const parseSize = (value: string, fallback: number) => parseFloat(value) || fallback;

      const eleventhColumn = parseSize(gridTemplate[10] ?? "40px", 40);
      const gap = parseSize(computedStyle.getPropertyValue("gap") ?? "8px", 8);

      setColumnWidth(`${eleventhColumn + gap}px`);
    };

    updateColumnWidth();
    window.addEventListener("resize", updateColumnWidth);
    return () => window.removeEventListener("resize", updateColumnWidth);
  }, [grid]);

  // Whether there are any modules in the grid
  const hasModulesInGrid = grid.cells.flat().some((cell) => cell.module !== null);

  return (
    <>
      <ShakingWrapper shaking={shaking}>
        <MessageSpinner solving={solving} initialMessage={"OPTIMIZING!"} />
        <div ref={gridRef} className={`gridTable ${solving ? "opacity-50" : ""}`}>
          {grid.cells.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {row.map((cell, columnIndex) => (
                <GridCell
                  key={columnIndex}
                  rowIndex={rowIndex}
                  columnIndex={columnIndex}
                  cell={{
                    label: cell.label,
                    supercharged: cell.supercharged,
                    active: cell.active,
                    tech: cell.tech ?? "",
                    adjacency_bonus: cell.adjacency_bonus,
                    image: cell.image || undefined,
                  }}
                  grid={grid}
                  setShaking={setShaking}
                  isSharedGrid={isSharedGrid}
                />
              ))}
              <GridControlButtons
                rowIndex={rowIndex}
                activateRow={activateRow}
                deActivateRow={deActivateRow}
                hasModulesInGrid={hasModulesInGrid}
                isFirstInactiveRow={row.every((cell) => !cell.active) && rowIndex === grid.cells.findIndex((r) => r.every((cell) => !cell.active))}
                isLastActiveRow={
                  rowIndex >= grid.cells.length - 3 &&
                  row.some((cell) => cell.active) &&
                  rowIndex === grid.cells.map((r) => r.some((cell) => cell.active)).lastIndexOf(true)
                }
              />
            </React.Fragment>
          ))}
        </div>
      </ShakingWrapper>
      <div className="flex items-start gap-4 pt-5 gridTable__footer__left">
        <div className="z-10 flex-1 flex-nowrap gridTable__footer__left">
          <Button
            variant="soft"
            className={`gridTable__button gridTable__button--instructions shadow-lg !mr-2 p-0 sm:!px-2`}
            onClick={() => setShowInstructions(true)}
          >
            <QuestionMarkCircledIcon />
            <span className="hidden sm:inline">Instructions</span>
          </Button>
          <Button variant="soft" className={`gridTable__button gridTable__button--changelog shadow-lg !mr-2 sm:!px-2`} onClick={() => setShowChangeLog(true)}>
            <CounterClockwiseClockIcon />
            <span className="hidden sm:inline">Change Log</span>
          </Button>
          {!isSharedGrid && (
            <Button
              variant="soft"
              className={`gridTable__button gridTable__button--changelog shadow-lg sm:!px-2`}
              onClick={handleShareClick}
              disabled={isSharedGrid}
            >
              <Share1Icon />
              <span className="hidden sm:inline">Share Link</span>
            </Button>
          )}
        </div>
        <div className="z-10 gridTable__footer__right" style={{ paddingRight: columnWidth }}>
          <Button className={`gridTable__button gridTable__button--reset shadow-lg`} variant="solid" onClick={handleResetGrid} disabled={solving}>
            <ResetIcon />
            <span className="font-bold">Reset Grid</span>
          </Button>
        </div>
      </div>
    </>
  );
};

export default GridTable;
