import React, { useState, useRef } from "react";
import { Tooltip } from "@radix-ui/themes";
import { Grid } from "../../store/useGridStore";
import { useGridStore } from "../../store/useGridStore";

// TODO: Configure jest so this doesn't interfere in the future.
// import "./GridCell.css"; 

interface GridCellProps {
  rowIndex: number;
  columnIndex: number;
  cell: {
    label?: string;
    supercharged?: boolean;
    active?: boolean;
    image: string | null | undefined;
  };
  grid: Grid;
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
const GridCell: React.FC<GridCellProps> = ({
  rowIndex,
  columnIndex,
  cell,
  grid,
  setShaking,
}) => {
  const toggleCellActive = useGridStore((state) => state.toggleCellActive);
  const toggleCellSupercharged = useGridStore((state) => state.toggleCellSupercharged);
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  /**
   * Handles a click on the cell.
   *
   * @param event - The event object
   */
  const handleClick = (event: React.MouseEvent) => {
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

  const cellClassName = `gridCell gridCell--interactive shadow-md sm:border-2 border-1 sm:rounded-lg transition-all ${
    cell.supercharged
      ? "gridCell--supercharged"
      : cell.active
      ? "gridCell--active"
      : "gridCell--inactive"
  }`;

  return (
    <div
      className="gridCell__container"
      style={{ gridColumn: columnIndex + 1, gridRow: rowIndex + 1 }}
    >
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
          />
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
