
import React, { useState, useRef, useCallback, memo } from "react"; // Import useCallback and memo
import { Tooltip } from "@radix-ui/themes";
import { Grid } from "../../store/GridStore";
import { useGridStore } from "../../store/GridStore";
import { useTechStore } from "../../store/TechStore";
import { useShakeStore } from "../../store/ShakeStore";

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
      const totalSupercharged = grid.cells.flat().filter((cell) => cell.supercharged).length;
      // Safer access to potentially undefined cell
      const currentCellSupercharged = grid.cells[rowIndex]?.[columnIndex]?.supercharged;
      if (totalSupercharged >= 4 && !currentCellSupercharged) {
        setShaking(true);
        // Use a timer ref for potential cleanup if needed, though unlikely here
        const shakeTimer = setTimeout(() => {
          setShaking(false);
        }, 500);
        // Cleanup function for the timer (though likely unnecessary as shake is short)
        return () => clearTimeout(shakeTimer);
      }
      toggleCellSupercharged(rowIndex, columnIndex);
    }
  // Dependencies for useCallback: Include all external variables/functions used inside
  }, [isSharedGrid, longPressTriggered, toggleCellActive, rowIndex, columnIndex, grid, setShaking, toggleCellSupercharged]);

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
    // Reset state slightly later to avoid race conditions with potential click events
    // Use a timer ref for potential cleanup
    const resetTimer = setTimeout(() => setLongPressTriggered(false), 50);
    return () => clearTimeout(resetTimer);
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

  // Calculate initial techColor
  let techColor = getTechColor(cell.tech ?? ""); // Use 'let' since it might be reassigned

  // If there's no specific tech color AND the cell is supercharged, set techColor to purple
  if (!techColor && cell.supercharged) {
    techColor = "purple"; // Override techColor
  }

  const cellClassName = `gridCell gridCell--interactive shadow-sm sm:border-2 border-1 rounded-sm sm:rounded-md
  ${cell.supercharged ? "gridCell--supercharged" : ""}
  ${cell.active ? "gridCell--active" : "gridCell--inactive"}
  ${cell.adjacency_bonus === 0 && cell.image ? "gridCell--black" : ""}
  ${cell.supercharged && cell.image ? "gridCell--glow" : ""}`.trim(); // Added this line for the glow effect.trim();

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

  // Get the upgrade priority for the current cell
  const upGradePriority = getUpgradePriority(cell.label);

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
            style={{
              backgroundImage: cell.image
                ? `image-set(
                    url(/assets/img/${cell.image}) 1x,
                    url(/assets/img/${cell.image.replace(/\.webp$/, "@2x.webp")}) 2x
                  )`
                : "none",
            }}
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
          style={{
            backgroundImage: cell.image
              ? `image-set(
                  url(/assets/img/${cell.image}) 1x,
                  url(/assets/img/${cell.image.replace(/\.webp$/, "@2x.webp")}) 2x
                )`
              : "none",
          }}
        />
      )}
    </div>
  );
}); // Close React.memo HOC

// Set display name for better debugging in React DevTools
GridCell.displayName = "GridCell";

export default GridCell;
