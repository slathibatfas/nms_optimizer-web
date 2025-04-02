import React, { useState, useRef } from "react";
import { Tooltip } from "@radix-ui/themes";
import { Grid } from "../../store/GridStore";
import { useGridStore } from "../../store/GridStore";
import { useTechStore } from "../../store/TechStore";

// TODO: Configure jest so this doesn't interfere in the future.
// import "./GridCell.css";

interface GridCellProps {
  rowIndex: number;
  columnIndex: number;
  cell: {
    label?: string; // Make label optional
    supercharged?: boolean;
    active?: boolean;
    tech?: string | null; // Make tech optional
    adjacency_bonus?: number; // Make adjacency_bonus optional
    image?: string | null | undefined; // Make image optional
  };
  grid: Grid;
  isSharedGrid: boolean;
  setShaking: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * A component that displays a single cell in the grid.
 *
 * @param rowIndex - The row index of the cell
 * @param columnIndex - The column index of the cell
 * @param cell - The cell object, containing properties like label, supercharged, active, and image
 * @param grid - The grid object, containing all cells and grid properties
 * @param setShaking - A function to set the shaking state of the grid
 */
const GridCell: React.FC<GridCellProps> = ({ rowIndex, columnIndex, cell, grid, setShaking, isSharedGrid }) => {
  const toggleCellActive = useGridStore((state) => state.toggleCellActive);
  const toggleCellSupercharged = useGridStore((state) => state.toggleCellSupercharged);
  const getTechColor = useTechStore((state) => state.getTechColor); // Get getTechColor function
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  /**
   * Handles a click on the cell.
   *
   * @param event - The event object
   */
  const handleClick = (event: React.MouseEvent) => {
    if (isSharedGrid) {
      return;
    }

    if (longPressTriggered) {
      event.stopPropagation(); // Prevents unintended click after long press
      return;
    }

    if (event.ctrlKey) {
      toggleCellActive(rowIndex, columnIndex);
    } else {
      const totalSupercharged = grid.cells.flat().filter((cell) => cell.supercharged).length;
      const currentCellSupercharged = grid.cells[rowIndex][columnIndex]?.supercharged;
      if (totalSupercharged >= 4 && !currentCellSupercharged) {
        setShaking(true);
        setTimeout(() => setShaking(false), 500);
        return;
      }
      toggleCellSupercharged(rowIndex, columnIndex);
    }
  };

  /**
   * Handles a touch start on the cell.
   *
   * @param event - The event object
   */
  const handleTouchStart = (event: React.TouchEvent) => {
    event.preventDefault(); // Prevents iOS long-press behavior
    longPressTimer.current = setTimeout(() => {
      setLongPressTriggered(true);
      toggleCellActive(rowIndex, columnIndex);
    }, 500);
  };

  /**
   * Handles a touch end on the cell.
   */
  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    setTimeout(() => setLongPressTriggered(false), 50); // Reset state after touch ends
  };

  /**
   * Handles a context menu on the cell.
   *
   * @param event - The event object
   */
  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  const techColor = getTechColor(cell.tech ?? "");
  const cellClassName = `gridCell gridCell--interactive shadow-md sm:border-2 border-1 sm:rounded-lg transition-all
  ${cell.supercharged ? "gridCell--supercharged shadow-lg" : ""}
  ${cell.active ? "gridCell--active shadow-lg" : "gridCell--inactive shadow-lg"}
  ${cell.adjacency_bonus === 0 && cell.image ? "gridCell--black" : techColor ? `gridCell--${techColor}` : ""}`.trim();

  const getUpgradePriority = (label: string | undefined): number => {
    if (!label) return 0;
    switch (true) {
      case label.toLowerCase().includes("sigma"):
        return 1;
      case label.toLowerCase().includes("tau"):
        return 2;
      case label.toLowerCase().includes("theta"):
        return 3;
      default:
        return 0;
    }
  };

  // Get the upgrade priority for the current cell
  const upGradePriority = getUpgradePriority(cell.label);

  return (
    <div className="gridCell__container" style={{ gridColumn: columnIndex + 1, gridRow: rowIndex + 1 }}>
      {cell.label ? (
        <Tooltip content={cell.label}>
          <div
            role="gridCell"
            onContextMenu={handleContextMenu}
            onClick={handleClick}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            className={cellClassName}
            style={{
              backgroundImage: cell.image ? `url(/assets/img/${cell.image})` : "none",
            }}
          >
            <div className="flex items-center justify-center w-full h-full">
              <span className="text-2xl font-extrabold sm:text-3xl gridCell__label" style={{ color: "var(--gray-12)", fontFamily: "GeosansLight" }}>
                {upGradePriority > 0 ? upGradePriority : null}
              </span>
            </div>
          </div>
        </Tooltip>
      ) : (
        <div
          role="gridCell"
          onContextMenu={handleContextMenu}
          onClick={handleClick}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          className={cellClassName}
          style={{
            backgroundImage: cell.image ? `url(/assets/img/${cell.image})` : "none",
          }}
        />
      )}
    </div>
  );
};

export default GridCell;
