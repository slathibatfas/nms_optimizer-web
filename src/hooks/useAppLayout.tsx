// src/hooks/useAppLayout.tsx
import { useEffect, useRef, useState } from "react";

import { useGridStore } from "../store/GridStore";
import { useBreakpoint } from "./useBreakpoint";

interface AppLayout {
	// Ref for the container whose height is measured (e.g., div.gridContainer__container)
	containerRef: React.RefObject<HTMLDivElement | null>;
	// Ref for the actual GridTable element, used for total width calculations
	gridTableRef: React.RefObject<HTMLDivElement | null>;
	gridHeight: number | null; // Height of the containerRef element
	gridTableTotalWidth: number | undefined; // Total width of the GridTable
	isLarge: boolean;
}

// Constants for delays and default values
const INITIAL_MEASUREMENT_DELAY = 150; // Unified delay for all initial measurements
const GRID_TABLE_WIDTH_ADJUSTMENT = -40; // Add your desired adjustment value here (e.g., -10, 5)

export const useAppLayout = (): AppLayout => {
	const containerRef = useRef<HTMLDivElement>(null);
	const gridTableRef = useRef<HTMLDivElement>(null);
	const [gridHeight, setGridHeight] = useState<number | null>(null);
	const [gridTableTotalWidth, setGridTableTotalWidth] = useState<number | undefined>(undefined);
	const isLarge = useBreakpoint("1024px");
	const { isSharedGrid } = useGridStore(); // `grid` is no longer needed here

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
		const initialUpdateTimerId = setTimeout(updateHeight, INITIAL_MEASUREMENT_DELAY);

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

	// Effect for gridTableTotalWidth (uses gridTableRef)
	useEffect(() => {
		const tableElementToObserve = gridTableRef.current; // Capture the element for this effect run

		const updateGridTableTotalWidth = () => {
			if (!tableElementToObserve) {
				setGridTableTotalWidth(undefined); // Reset width if no element
				return;
			}
			// Apply adjustment
			setGridTableTotalWidth(tableElementToObserve.offsetWidth + GRID_TABLE_WIDTH_ADJUSTMENT);
		};

		if (!tableElementToObserve) {
			updateGridTableTotalWidth(); // Ensure state is correctly set if no element
			return;
		}

		// Perform initial update with a delay.
		const initialUpdateTimerId = setTimeout(updateGridTableTotalWidth, INITIAL_MEASUREMENT_DELAY);

		const observer = new ResizeObserver(updateGridTableTotalWidth);
		observer.observe(tableElementToObserve);

		return () => {
			clearTimeout(initialUpdateTimerId);
			observer.unobserve(tableElementToObserve);
			observer.disconnect();
		}; // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [gridTableRef.current]);

	return {
		containerRef,
		gridTableRef,
		gridHeight,
		gridTableTotalWidth,
		isLarge,
	};
};
