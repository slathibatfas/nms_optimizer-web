import React, { useState, useRef } from "react";
import { Tooltip } from "@radix-ui/themes";
import { Grid } from "../../store/useGridStore";
import { useGridStore } from "../../store/useGridStore";

interface GridCellProps {
  rowIndex: number;
  columnIndex: number;
  cell: {
    label?: string;
    supercharged?: boolean;
    active?: boolean;
    image?: string;
  };
  grid: Grid;
  setShaking: React.Dispatch<React.SetStateAction<boolean>>;
}

const GridCell: React.FC<GridCellProps> = ({ rowIndex, columnIndex, cell, grid, setShaking }) => {
  const toggleCellActive = useGridStore((state) => state.toggleCellActive);
  const toggleCellSupercharged = useGridStore((state) => state.toggleCellSupercharged);
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

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

  const handleTouchStart = (event: React.TouchEvent) => {
    event.preventDefault(); // Prevents iOS long-press behavior
    longPressTimer.current = setTimeout(() => {
      setLongPressTriggered(true);
      toggleCellActive(rowIndex, columnIndex);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    setTimeout(() => setLongPressTriggered(false), 50); // Reset state after touch ends
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault(); // Disables long-press menu
  };

  const cellContent = (
    <div
      role="gridCell"
      onContextMenu={handleContextMenu}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      className={`gridCell gridCell--interactive shadow-md sm:border-2 border-1 sm:rounded-lg transition-all
        ${cell.supercharged ? "gridCell--supercharged" : cell.active ? "gridCell--active" : "gridCell--inactive"}
      `}
      style={{
        backgroundImage: cell.image ? `url(/assets/img/${cell.image})` : "none",
      }}
    ></div>
  );

  return (
    <div style={{ gridColumn: columnIndex + 1, gridRow: rowIndex + 1 }}>{cell.label ? <Tooltip content={cell.label}>{cellContent}</Tooltip> : cellContent}</div>
  );
};

export default GridCell;