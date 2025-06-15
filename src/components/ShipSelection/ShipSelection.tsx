// src/components/ShipSelection/ShipSelection.tsx
import "./ShipSelection.css";

import { GearIcon } from "@radix-ui/react-icons";
import { Button, DropdownMenu, Separator } from "@radix-ui/themes";
import React, { useMemo, useRef } from "react";
import ReactGA from "react-ga4";
import { useTranslation } from "react-i18next";

import { useBreakpoint } from "../../hooks/useBreakpoint";
import {
	ShipTypeDetail,
	useFetchShipTypesSuspense,
	useShipTypesStore,
} from "../../hooks/useShipTypes";
import { createGrid, Grid, useGridStore } from "../../store/GridStore";

// --- Constants for Grid Configuration ---
const DEFAULT_GRID_HEIGHT = 10;
const DEFAULT_GRID_WIDTH = 6;
const FREIGHTER_KEYWORD = "freighter";
const FREIGHTER_INACTIVE_ROW_INDICES = [4, 5]; // 0-indexed rows to deactivate for freighters

interface ShipSelectionProps {
	solving: boolean;
}

const ShipSelection: React.FC<ShipSelectionProps> = ({ solving }) => {
	const selectedShipType = useShipTypesStore((state) => state.selectedShipType);
	const setSelectedShipType = useShipTypesStore((state) => state.setSelectedShipType);
	const setGridAndResetAuxiliaryState = useGridStore(
		(state) => state.setGridAndResetAuxiliaryState
	);
	const previousSelectionRef = useRef<string | null>(null);
	const isSmallAndUp = useBreakpoint("640px"); // sm breakpoint

	const handleOptionSelect = (option: string) => {
		if (option !== previousSelectionRef.current) {
			ReactGA.event("platform_selection", {
				platform: option,
			});

			setSelectedShipType(option);

			const initialGrid = createGrid(DEFAULT_GRID_HEIGHT, DEFAULT_GRID_WIDTH);
			let newCells = initialGrid.cells;
			// If the selected ship type is a freighter, deactivate specific rows
			if (option.toLowerCase().includes(FREIGHTER_KEYWORD)) {
				newCells = initialGrid.cells.map((row, rIndex) => {
					if (FREIGHTER_INACTIVE_ROW_INDICES.includes(rIndex)) {
						// For these rows, map each cell to be inactive and not supercharged
						return row.map((cell) => ({
							...cell,
							active: false,
							supercharged: false,
						}));
					}
					return row;
				});
			}

			const finalGridPayload: Grid = {
				cells: newCells,
				width: initialGrid.width,
				height: initialGrid.height,
			};
			setGridAndResetAuxiliaryState(finalGridPayload);
		}
		previousSelectionRef.current = option;
	};

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger disabled={solving}>
				{isSmallAndUp ? (
					<Button
						size="2"
						variant="soft"
						aria-label="Select ship type"
						className="cursor-pointer !p-2"
					>
						<GearIcon className="w-4 h-4 sm:w-5 sm:h-5" />
						<Separator orientation="vertical" color="cyan" decorative />
						<DropdownMenu.TriggerIcon />
					</Button>
				) : (
					<Button
						size="1"
						variant="soft"
						aria-label="Select ship type"
						className="!cursor-pointer !mt-1"
					>
						<GearIcon className="w-4 h-4 sm:w-5 sm:h-5" />
					</Button>
				)}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				color="cyan"
				className="shipSelection__dropdownMenu"
				// style={{ backgroundColor: "var(--accent-2)" }}
			>
				<ShipTypesDropdown
					selectedShipType={selectedShipType}
					handleOptionSelect={handleOptionSelect}
				/>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
};

interface ShipTypesDropdownProps {
	selectedShipType: string;
	handleOptionSelect: (option: string) => void;
}

/**
 * A dropdown menu for selecting a ship type, grouped by type.
 *
 * This component renders a dropdown menu for selecting a ship type. The
 * component expects a `selectedShipType` prop, which indicates the currently
 * selected ship type, and a `handleOptionSelect` prop, which will be called
 * when the user selects a different ship type. Items are grouped by their 'type'
 * property.
 *
 * @param {string} selectedShipType - The currently selected ship type key.
 * @param {function} handleOptionSelect - A function to be called when the user
 *   selects a different ship type key.
 */
const ShipTypesDropdown: React.FC<ShipTypesDropdownProps> = ({
	selectedShipType,
	handleOptionSelect,
}) => {
	const shipTypes = useFetchShipTypesSuspense();
	const { t } = useTranslation();

	// Group ship types by their 'type' property
	const groupedShipTypes = useMemo(() => {
		return Object.entries(shipTypes).reduce(
			(acc, [key, details]) => {
				const type = details.type; // e.g., 'Starship' or 'Multi-Tool'
				if (!acc[type]) {
					// If this type group doesn't exist yet, create it
					acc[type] = [];
				}
				acc[type].push({ key, details });
				return acc;
			},
			{} as Record<string, { key: string; details: ShipTypeDetail }[]>
		);
	}, [shipTypes]);

	return (
		<DropdownMenu.RadioGroup value={selectedShipType} onValueChange={handleOptionSelect}>
			{Object.entries(groupedShipTypes).map(([type, items], groupIndex) => (
				<React.Fragment key={type}>
					{groupIndex > 0 && <DropdownMenu.Separator />}
					<DropdownMenu.Label>
						<span className="shipSelection__header">{t(`platformTypes.${type}`)}</span>
					</DropdownMenu.Label>
					{items.map(({ key }) => (
						<DropdownMenu.RadioItem key={key} value={key} className="font-medium last:mb-2">
							{t(`platforms.${key}`)}
						</DropdownMenu.RadioItem>
					))}
				</React.Fragment>
			))}
		</DropdownMenu.RadioGroup>
	);
};

export default ShipSelection;
