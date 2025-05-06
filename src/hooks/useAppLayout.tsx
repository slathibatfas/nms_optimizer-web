// src/hooks/useAppLayout.tsx
import { useState, useEffect, useRef } from "react";
import { useBreakpoint } from "./useBreakpoint";
import { useGridStore } from "../store/GridStore"; // Import Grid type if needed for grid dependency

interface AppLayout {
  // Ref for the container whose height is measured (e.g., div.gridContainer__container)
  containerRef: React.RefObject<HTMLDivElement | null>;
  // Ref for the actual GridTable element, used for column width calculations
  gridTableRef: React.RefObject<HTMLDivElement | null>;
  gridHeight: number | null; // Height of the containerRef element
  columnWidth: string;
  isLarge: boolean;
}

export const useAppLayout = (): AppLayout => {
  const containerRef = useRef<HTMLDivElement>(null); // For height of div.gridContainer__container
  const gridTableRef = useRef<HTMLDivElement>(null); // For width calculations on GridTable
  const [gridHeight, setGridHeight] = useState<number | null>(null);
  const [columnWidth, setColumnWidth] = useState("0px"); // Default fallback
  const isLarge = useBreakpoint("1024px");
  const { grid, isSharedGrid } = useGridStore(); // Get grid state if needed for effects

  // Effect for gridHeight
  useEffect(() => {
    const updateGridHeight = () => {
      if (isLarge && !isSharedGrid && containerRef.current) {
        setGridHeight(containerRef.current.getBoundingClientRect().height);
      } else {
        setGridHeight(null); // Reset height if not large or is shared
      }
    };

    // Run initially and on relevant changes
    const timerId = setTimeout(updateGridHeight, 100); // Delay slightly for render
    window.addEventListener("resize", updateGridHeight);

    return () => {
      clearTimeout(timerId);
      window.removeEventListener("resize", updateGridHeight);
    };
  }, [isLarge, isSharedGrid, grid, containerRef]);

  // Effect for columnWidth (uses gridTableRef)
  useEffect(() => {
    const updateColumnWidth = () => {
      if (!gridTableRef.current) {
        // Silently return if the ref is not yet available.
        // The effect will re-run when the ref is populated.
        return;
      }

      // Find one of the rendered GridControlButtons containers
      const controlButtonElement = gridTableRef.current.querySelector<HTMLDivElement>('[data-is-grid-control-column="true"]');

      if (!controlButtonElement) {
        // If no control button is found (e.g., empty grid or shared grid without controls),
        // fall back to a default width.
        setColumnWidth("40px"); // Fallback if no control button is found (e.g., empty grid)
        return;
      }

      const controlCellActualWidth = controlButtonElement.offsetWidth;

      // Get the computed gap from the grid container itself
      const gridContainerStyle = window.getComputedStyle(gridTableRef.current);
      // Try 'grid-column-gap' first, then 'gap' as it might be a shorthand
      let gapString = gridContainerStyle.getPropertyValue("grid-column-gap").trim();
      if (gapString === "normal" || !gapString) {
        // 'normal' is a possible value if not explicitly set, or it might be empty
        gapString = gridContainerStyle.getPropertyValue("gap").trim().split(" ")[0]; // Take the first value if 'gap' is shorthand (row-gap column-gap)
      }

      const gapActualWidth = parseFloat(gapString);

      if (isNaN(gapActualWidth)) {
        // If gap parsing fails, log an error internally or handle gracefully.
        // For now, we'll use the cell width or a fixed fallback.
        // If gap parsing fails, use cell width only or a fixed fallback
        setColumnWidth(`${controlCellActualWidth}px`); // Or "40px" if preferred
        return;
      }

      const calculatedWidth = controlCellActualWidth + gapActualWidth;
      setColumnWidth(`${calculatedWidth}px`);
    };
    const timerId = setTimeout(updateColumnWidth, 150); // Increased delay for GridTable ref and styles
    window.addEventListener("resize", updateColumnWidth);
    return () => {
      clearTimeout(timerId);
      window.removeEventListener("resize", updateColumnWidth);
    };
  }, [isSharedGrid, grid, gridTableRef]); // Depend on gridTableRef

  return { containerRef, gridTableRef, gridHeight, columnWidth, isLarge };
};
