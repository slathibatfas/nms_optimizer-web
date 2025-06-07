// src/hooks/useAppLayout.tsx
import { useState, useEffect, useRef } from "react";
import { useBreakpoint } from "./useBreakpoint";
import { useGridStore } from "../store/GridStore";

interface AppLayout {
  // Ref for the container whose height is measured (e.g., div.gridContainer__container)
  containerRef: React.RefObject<HTMLDivElement | null>;
  // Ref for the actual GridTable element, used for column width calculations
  gridTableRef: React.RefObject<HTMLDivElement | null>;
  gridHeight: number | null; // Height of the containerRef element
  columnWidth: string;
  isLarge: boolean;
}

// Constants for delays and default values
const INITIAL_HEIGHT_UPDATE_DELAY = 50;
const INITIAL_WIDTH_UPDATE_DELAY = 100;
const DEFAULT_CONTROL_COLUMN_WIDTH = "40px";
const SHARED_GRID_CONTROL_COLUMN_WIDTH = "0px";

export const useAppLayout = (): AppLayout => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridTableRef = useRef<HTMLDivElement>(null);
  const [gridHeight, setGridHeight] = useState<number | null>(null);
  const [columnWidth, setColumnWidth] = useState("0px"); // Initial default
  const isLarge = useBreakpoint("1024px");
  const { grid, isSharedGrid } = useGridStore();

  // Effect for gridHeight
  useEffect(() => {
    const elementToObserve = containerRef.current; // Capture the element for this effect run

    const updateHeight = () => {
      if (isLarge && !isSharedGrid && elementToObserve) {
        setGridHeight(elementToObserve.getBoundingClientRect().height);
      } else {
        setGridHeight(null); // Reset height if not large or is shared
      }
    };

    if (!elementToObserve) {
      updateHeight(); // Ensure state is correctly set (e.g., nullified) if no element
      return;
    }

    // Perform initial update with a slight delay to allow for rendering and styling.
    const initialUpdateTimerId = setTimeout(
      updateHeight,
      INITIAL_HEIGHT_UPDATE_DELAY
    );

    const observer = new ResizeObserver(updateHeight);
    observer.observe(elementToObserve);

    return () => {
      clearTimeout(initialUpdateTimerId);
      observer.unobserve(elementToObserve);
      observer.disconnect();
    };
    // containerRef.current is included to re-run the effect if the actual DOM node changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLarge, isSharedGrid, containerRef.current]);

  // Effect for columnWidth (uses gridTableRef)
  useEffect(() => {
    const tableElementToObserve = gridTableRef.current; // Capture the element for this effect run

    const getDefaultColumnWidth = () =>
      isSharedGrid
        ? SHARED_GRID_CONTROL_COLUMN_WIDTH
        : DEFAULT_CONTROL_COLUMN_WIDTH;

    const updateColumnWidth = () => {
      //NOSONAR
      if (!tableElementToObserve) {
        setColumnWidth(getDefaultColumnWidth());
        return;
      }

      const controlButtonElement =
        tableElementToObserve.querySelector<HTMLDivElement>(
          '[data-is-grid-control-column="true"]'
        );
      if (!controlButtonElement) {
        setColumnWidth(getDefaultColumnWidth());
        return;
      }

      const controlCellActualWidth = controlButtonElement.offsetWidth;
      const gridContainerStyle = window.getComputedStyle(tableElementToObserve);
      let gapString = gridContainerStyle
        .getPropertyValue("grid-column-gap")
        .trim();
      if (gapString === "normal" || !gapString) {
        gapString = gridContainerStyle
          .getPropertyValue("gap")
          .trim()
          .split(" ")[0]; // Take the first value if 'gap' is shorthand (row-gap column-gap)
      }
      const gapActualWidth = parseFloat(gapString);

      if (isNaN(gapActualWidth) || gapActualWidth < 0) {
        // Ensure gap is a valid positive number
        setColumnWidth(`${controlCellActualWidth}px`);
        return;
      }

      const calculatedWidth = controlCellActualWidth + gapActualWidth;
      setColumnWidth(`${calculatedWidth}px`);
    };

    if (!tableElementToObserve) {
      updateColumnWidth(); // Ensure state is correctly set if no element
      return;
    }

    // Perform initial update with a delay.
    const initialUpdateTimerId = setTimeout(
      updateColumnWidth,
      INITIAL_WIDTH_UPDATE_DELAY
    );

    const observer = new ResizeObserver(updateColumnWidth);
    observer.observe(tableElementToObserve);

    return () => {
      clearTimeout(initialUpdateTimerId);
      observer.unobserve(tableElementToObserve);
      observer.disconnect();
    };
    // gridTableRef.current is included to re-run the effect if the actual DOM node changes.
    // `grid` data is included as it can affect the presence/size of `controlButtonElement`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSharedGrid, grid, gridTableRef.current]);

  return { containerRef, gridTableRef, gridHeight, columnWidth, isLarge };
};
