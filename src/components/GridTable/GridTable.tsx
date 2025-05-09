// src/components/GridTable/GridTable.tsx
import React, { useMemo } from "react";
import { Grid } from "../../store/GridStore";
import GridCell from "../GridCell/GridCell";
import GridControlButtons from "../GridControlButtons/GridControlButtons";
import ShakingWrapper from "../GridShake/GridShake";
import MessageSpinner from "../MessageSpinner/MessageSpinner";
import { useShakeStore } from "../../store/ShakeStore";

interface GridTableProps {
  grid: Grid;
  resetGrid: () => void;
  activateRow: (rowIndex: number) => void;
  deActivateRow: (rowIndex: number) => void;
  solving: boolean;
  shared: boolean;
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
const GridTableInternal = React.forwardRef<HTMLDivElement, GridTableProps>(
  (
    {
      grid,
      activateRow,
      deActivateRow,
      solving,
      shared, // Use the shared prop passed from App.tsx
    },
    ref
  ) => {
    const { shaking } = useShakeStore();

    // Whether there are any modules in the grid
    const hasModulesInGrid = useMemo(() => {
      return grid.cells.flat().some((cell) => cell.module !== null);
    }, [grid.cells]);

    // Calculate these indices once
    const firstInactiveRowIndex = useMemo(() => {
      return grid.cells.findIndex((r) => r.every((cell) => !cell.active));
    }, [grid.cells]);

    const lastActiveRowIndex = useMemo(() => {
      const activeRowBooleans = grid.cells.map((r) => r.some((cell) => cell.active));
      return activeRowBooleans.lastIndexOf(true);
    }, [grid.cells]);

    return (
      <ShakingWrapper shaking={shaking} duration={500}>
        <MessageSpinner isVisible={solving} showRandomMessages={true} initialMessage={"OPTIMIZING!"} />
        <div ref={ref} className={`gridTable ${solving ? "opacity-50" : ""}`}>
          {grid.cells.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {row.map((cellData, columnIndex) => (
                <GridCell
                  key={`${rowIndex}-${columnIndex}`} // More robust key
                  rowIndex={rowIndex}
                  columnIndex={columnIndex}
                  // Pass the cellData directly as the 'cell' prop
                  // and the entire 'grid' object as the 'grid' prop
                  cell={cellData}
                  grid={grid} // GridCell expects the full grid object
                  isSharedGrid={shared}
                />
              ))}
              <GridControlButtons
                rowIndex={rowIndex}
                activateRow={activateRow}
                deActivateRow={deActivateRow}
                hasModulesInGrid={hasModulesInGrid}
                // Use pre-calculated indices for these checks
                isFirstInactiveRow={row.every((cell) => !cell.active) && rowIndex === firstInactiveRowIndex}
                isLastActiveRow={
                  row.some((cell) => cell.active) &&
                  rowIndex === lastActiveRowIndex &&
                  rowIndex >= grid.cells.length - 3 // Keep this specific condition if it's intended
                }
              />
            </React.Fragment>
          ))}
        </div>
      </ShakingWrapper>
    );
  }
);

export const GridTable = React.memo(GridTableInternal);

export default GridTable;
