
import React, { useState, useRef, useCallback, memo, useMemo } from "react"; // Import useCallback, memo, and useMemo
import { Tooltip } from "@radix-ui/themes";
import { Grid } from "../../store/GridStore";
import { useGridStore } from "../../store/GridStore";
import { useTechStore } from "../../store/TechStore";
import { useShakeStore } from "../../store/ShakeStore";

// Moved outside the component to prevent re-creation on each render
// This function is pure and only depends on its input.
const getUpgradePriority = (label: string | undefined): number => {
  if (!label) return 0;
  switch (true) {
    case label.toLowerCase().includes("theta"):
      return 1;
    case label.toLowerCase().includes("tau"):
      return 2;
    case label.toLowerCase().includes("sigma"):
      return 3;
    default:
      return 0;
  }
};

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
  // setShaking: React.Dispatch<React.SetStateAction<boolean>>; // Removed as it comes from useShakeStore now
}

/**
 * A memoized component that displays a single cell in the grid.
 *
 * @param rowIndex - The row index of the cell
 * @param columnIndex - The column index of the cell
 * @param cell - The cell object, containing properties like label, supercharged, active, and image
 * @param grid - The grid object, containing all cells and grid properties
 */

// Use React.memo for performance optimization
const GridCell: React.FC<GridCellProps> = memo(({ rowIndex, columnIndex, cell, grid, isSharedGrid }) => {
  const toggleCellActive = useGridStore((state) => state.toggleCellActive);
  const toggleCellSupercharged = useGridStore((state) => state.toggleCellSupercharged);
  const getTechColor = useTechStore((state) => state.getTechColor); // Get getTechColor function
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const { setShaking } = useShakeStore(); // Get setShaking from the store

  // Memoize the calculation for totalSupercharged cells
  const totalSupercharged = useMemo(() => {
    return grid.cells.flat().filter(c => c.supercharged).length;
  }, [grid.cells]);

  /**
   * Handles a click on the cell.
   *
   * @param event - The event object
   */
  // Memoize handleClick
  const handleClick = useCallback((event: React.MouseEvent) => {
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
      // Use the 'supercharged' status directly from the 'cell' prop
      if (totalSupercharged >= 4 && !cell.supercharged) { // Use memoized totalSupercharged
        setShaking(true);
        // For a short-lived visual effect like this, explicit cleanup on unmount
        // is often omitted for simplicity. The main issue was the incorrect return.
        setTimeout(() => {
          setShaking(false);
        }, 500);
        return; // Exit after initiating shake, don't toggle supercharge
      }
      toggleCellSupercharged(rowIndex, columnIndex);
    }
  // Dependencies for useCallback: Include all external variables/functions used inside
  }, [isSharedGrid, longPressTriggered, toggleCellActive, rowIndex, columnIndex, totalSupercharged, cell.supercharged, toggleCellSupercharged, setShaking]);

  /**
   * Handles a touch start on the cell.
   */
  // Memoize handleTouchStart
  const handleTouchStart = useCallback(() => {
    longPressTimer.current = setTimeout(() => {
      setLongPressTriggered(true);
      // Ensure interaction is allowed
      if (isSharedGrid) {
        // Clear timer if interaction is not allowed but timer started
        if (longPressTimer.current) clearTimeout(longPressTimer.current);
        return;
      }
      toggleCellActive(rowIndex, columnIndex);
    }, 500); // Standard long press duration
  }, [isSharedGrid, toggleCellActive, rowIndex, columnIndex]); // Added dependencies

  /**
   * Handles a touch end on the cell.
   */
  // Memoize handleTouchEnd
  const handleTouchEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    // Reset state slightly later to avoid race conditions.
    // Similar to the shake timer, explicit cleanup for this short delay is often omitted.
    // The incorrect return from useCallback is the primary fix here.
    setTimeout(() => setLongPressTriggered(false), 50);
  }, []); // No dependencies, so empty array

  /**
   * Handles a context menu on the cell.
   *
   * @param event - The event object
   */
  // Memoize handleContextMenu
  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
  }, []); // No dependencies, so empty array

  // Memoize techColor calculation
  const techColor = useMemo(() => {
    let color = getTechColor(cell.tech ?? "");
    // If there's no specific tech color AND the cell is supercharged, set techColor to purple
    if (!color && cell.supercharged) {
      color = "purple"; // Override techColor
    }
    return color;
  }, [getTechColor, cell.tech, cell.supercharged]);

  // Memoize cellClassName construction
  const cellClassName = useMemo(() => {
    return `gridCell gridCell--interactive shadow-md sm:border-2 border-1 rounded-sm sm:rounded-md
    ${cell.supercharged ? "gridCell--supercharged" : ""}
    ${cell.active ? "gridCell--active" : "gridCell--inactive"}
    ${cell.adjacency_bonus === 0 && cell.image ? "gridCell--black" : ""}
    ${cell.supercharged && cell.image ? "gridCell--glow" : ""}`.trim();
  }, [cell.supercharged, cell.active, cell.adjacency_bonus, cell.image]);

  // Get the upgrade priority for the current cell
  const upGradePriority = getUpgradePriority(cell.label);
  const backgroundImageStyle = useMemo(() => (cell.image
    ? `image-set(url(/assets/img/${cell.image}) 1x, url(/assets/img/${cell.image.replace(/\.webp$/, "@2x.webp")}) 2x)`
    : "none"), [cell.image]);

  return (
    <div className="gridCell__container" style={{ gridColumn: columnIndex + 1, gridRow: rowIndex + 1 }}>
      {cell.label ? (
        <Tooltip content={cell.label} delayDuration={500}>
          <div
            role="gridCell"
            data-accent-color={techColor}
            onContextMenu={handleContextMenu}
            onClick={handleClick}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            className={cellClassName}
            style={{ backgroundImage: backgroundImageStyle }}
          >
            <div className="flex items-center justify-center w-full h-full">
              <span className="mt-1 text-1xl md:text-3xl lg:text-4xl gridCell__label">
                {upGradePriority > 0 ? upGradePriority : null}
              </span>
            </div>
          </div>
        </Tooltip>
      ) : (
        <div
          role="gridCell"
          data-accent-color={techColor}
          onContextMenu={handleContextMenu}
          onClick={handleClick}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd} // Use handleTouchEnd for cancel as well
          className={cellClassName}
          style={{ backgroundImage: backgroundImageStyle }}
        />
      )}
    </div>
  );
}); // Close React.memo HOC

// Set display name for better debugging in React DevTools
GridCell.displayName = "GridCell";

export default GridCell;
