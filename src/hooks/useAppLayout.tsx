// src/hooks/useAppLayout.tsx
import { useState, useEffect, useRef } from "react";
import { useBreakpoint } from "./useBreakpoint";
import { useGridStore } from "../store/GridStore"; // Import Grid type if needed for grid dependency

interface AppLayout {
  gridRef: React.RefObject<HTMLDivElement | null>;
  gridHeight: number | null;
  columnWidth: string;
  isLarge: boolean;
}

export const useAppLayout = (): AppLayout => {
  // Ensure the generic type argument <HTMLDivElement> is passed to useRef
  // This explicitly tells useRef the intended type of the .current property (besides null)
  const gridRef = useRef<HTMLDivElement>(null);
  const [gridHeight, setGridHeight] = useState<number | null>(null);
  const [columnWidth, setColumnWidth] = useState("40px");
  const isLarge = useBreakpoint("1024px");
  const { grid, isSharedGrid } = useGridStore(); // Get grid state if needed for effects

  // Effect for gridHeight
  useEffect(() => {
    const updateGridHeight = () => {
      if (isLarge && !isSharedGrid && gridRef.current) {
        setGridHeight(gridRef.current.getBoundingClientRect().height);
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
    // Depend on isLarge, isSharedGrid, and potentially grid content if height depends on it
  }, [isLarge, isSharedGrid, grid]);

  // Effect for columnWidth
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
    updateColumnWidth(); // Run initially
    window.addEventListener("resize", updateColumnWidth);
    return () => window.removeEventListener("resize", updateColumnWidth);
  }, [grid]); // Depend on grid if its structure affects columns

  return { gridRef, gridHeight, columnWidth, isLarge };
};