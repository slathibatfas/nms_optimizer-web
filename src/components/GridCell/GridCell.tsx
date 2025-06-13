import React, { useState, useRef, useCallback, memo, useMemo } from "react"; // Import useCallback, memo, and useMemo
import { Tooltip } from "@radix-ui/themes";
import { Grid } from "../../store/GridStore";
import { useGridStore } from "../../store/GridStore";
import { useTechStore } from "../../store/TechStore";
import { useShakeStore } from "../../store/ShakeStore";
import { useTranslation } from "react-i18next";

import "./GridCell.css";

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
}

/**
 * A memoized component that displays a single cell in the grid.
 *
 * @param rowIndex - The row index of the cell
 * @param columnIndex - The column index of the cell
 * @param cell - The cell object, containing properties like label, supercharged, active, and image
 * @param grid - The grid object, containing all cells and grid properties
 */

const GridCell: React.FC<GridCellProps> = memo(
	({ rowIndex, columnIndex, cell, grid, isSharedGrid }) => {
		const toggleCellActive = useGridStore((state) => state.toggleCellActive);
		const toggleCellSupercharged = useGridStore((state) => state.toggleCellSupercharged);
		const [longPressTriggered, setLongPressTriggered] = useState(false);
		const longPressTimer = useRef<NodeJS.Timeout | null>(null);
		const { setShaking } = useShakeStore(); // Get setShaking from the store
		const { t } = useTranslation();

		// Memoize the calculation for totalSupercharged cells
		const totalSupercharged = useMemo(() => {
			return grid.cells.flat().filter((c) => c.supercharged).length;
		}, [grid.cells]);

		/**
		 * Handles a click on the cell.
		 *
		 * @param event - The event object
		 */
		const handleClick = useCallback(
			(event: React.MouseEvent) => {
				if (isSharedGrid) {
					return;
				}

				if (longPressTriggered) {
					event.stopPropagation(); // Prevents unintended click after long press
					return;
				}

				if (event.ctrlKey || event.metaKey) {
					toggleCellActive(rowIndex, columnIndex);
				} else {
					if (totalSupercharged >= 4 && !cell.supercharged) {
						setShaking(true);
						setTimeout(() => {
							setShaking(false);
						}, 500);
						return; // Exit after initiating shake, don't toggle supercharge
					}
					toggleCellSupercharged(rowIndex, columnIndex);
				}
			},
			[
				isSharedGrid,
				longPressTriggered,
				toggleCellActive,
				rowIndex,
				columnIndex,
				totalSupercharged,
				cell.supercharged,
				toggleCellSupercharged,
				setShaking,
			]
		);

		/**
		 * Handles a touch start on the cell.
		 */
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
			}, 1000); // Standard long press duration is 1000ms (1 second)
		}, [isSharedGrid, toggleCellActive, rowIndex, columnIndex]);

		/**
		 * Handles a touch end on the cell.
		 */
		const handleTouchEnd = useCallback(() => {
			if (longPressTimer.current) {
				clearTimeout(longPressTimer.current);
			}
			setTimeout(() => setLongPressTriggered(false), 50);
		}, []); // No dependencies, so empty array

		/**
		 * Handles a context menu on the cell.
		 *
		 * @param event - The event object
		 */
		const handleContextMenu = useCallback((event: React.MouseEvent) => {
			event.preventDefault();
		}, []);

		// Directly select the color for the current cell's tech from the store.
		// This makes the component reactive to changes in the tech color mapping for this specific tech.
		const currentTechColorFromStore = useTechStore((state) => state.getTechColor(cell.tech ?? ""));
		const techColor = useMemo(() => {
			// If there's no specific tech color from the store (it's falsy) AND the cell is supercharged,
			// override to "purple". Otherwise, use the color from the store.
			return !currentTechColorFromStore && cell.supercharged ? "purple" : currentTechColorFromStore;
		}, [currentTechColorFromStore, cell.supercharged]);

		const cellClassName = useMemo(() => {
			return `gridCell gridCell--interactive shadow-md sm:border-2 border-1 rounded-sm sm:rounded-md
    ${cell.supercharged ? "gridCell--supercharged" : ""}
    ${cell.active ? "gridCell--active" : "gridCell--inactive"}
    ${cell.adjacency_bonus === 0 && cell.image ? "gridCell--black" : ""}
    ${cell.supercharged && cell.image ? "gridCell--glow" : ""}`.trim();
		}, [cell.supercharged, cell.active, cell.adjacency_bonus, cell.image]);

		// Get the upgrade priority for the current cell
		const upGradePriority = getUpgradePriority(cell.label);
		const backgroundImageStyle = useMemo(
			() =>
				cell.image
					? `image-set(url(/assets/img/${cell.image}) 1x, url(/assets/img/${cell.image.replace(/\.webp$/, "@2x.webp")}) 2x)`
					: "none",
			[cell.image]
		);

		// Dynamically construct the className for the cell div
		// Flex properties are added only if a label is present, for centering.
		const labelSpecificClasses = cell.label ? "flex items-center justify-center w-full h-full" : "";
		const finalCellClassName = `${cellClassName} ${labelSpecificClasses}`.trim();
		const cellElementStyle = useMemo(
			() => ({
				backgroundImage: backgroundImageStyle,
			}),
			[backgroundImageStyle]
		);
		const cellElement = (
			<div
				role="gridCell"
				aria-colindex={columnIndex + 1}
				data-accent-color={techColor}
				onContextMenu={handleContextMenu}
				onClick={handleClick}
				onTouchStart={handleTouchStart}
				onTouchEnd={handleTouchEnd}
				onTouchCancel={handleTouchEnd}
				className={finalCellClassName}
				style={cellElementStyle}
			>
				{cell.label && ( // Conditionally render the label span
					<span className="mt-1 text-1xl md:text-3xl lg:text-4xl gridCell__label">
						{upGradePriority > 0 ? upGradePriority : null}
					</span>
				)}
			</div>
		);

		// Determine tooltip content: use translated string if image exists, otherwise original label.
		// Fallback to cell.label if translation is not found or if cell.image is not present.
		const tooltipContent = cell.image
			? t(`modules.${cell.image}`, { defaultValue: cell.label })
			: cell.label;
		return tooltipContent ? (
			<Tooltip content={tooltipContent} delayDuration={500}>
				{cellElement}
			</Tooltip>
		) : (
			cellElement
		);
	}
);

// Set display name for better debugging in React DevTools
GridCell.displayName = "GridCell";

export default GridCell;
