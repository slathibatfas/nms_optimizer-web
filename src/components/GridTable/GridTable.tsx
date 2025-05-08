// src/components/GridTable/GridTable.tsx
import React from "react";
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
const GridTable = React.forwardRef<HTMLDivElement, GridTableProps>(
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
    const hasModulesInGrid = grid.cells.flat().some((cell) => cell.module !== null);

    return (
      <ShakingWrapper shaking={shaking} duration={500}>
        <MessageSpinner isVisible={solving} showRandomMessages={true} initialMessage={"OPTIMIZING!"} />
        <div ref={ref} className={`gridTable ${solving ? "opacity-50" : ""}`}>
          {grid.cells.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {row.map((cell, columnIndex) => ( // Removed the explicit 'return' here
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
                    isSharedGrid={shared} // Use the prop here
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
    );
  }
);

export default GridTable;
