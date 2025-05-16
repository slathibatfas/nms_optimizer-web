// src/components/ShipSelection/ShipSelection.tsx
import { GearIcon } from "@radix-ui/react-icons";
import { DropdownMenu, IconButton, Text } from "@radix-ui/themes";
import React, { Suspense, useRef, useMemo } from "react"; // Import useMemo
import { useFetchShipTypesSuspense, useShipTypesStore, ShipTypeDetail } from "../../hooks/useShipTypes";
import { useGridStore, createGrid, Grid } from "../../store/GridStore"; // Import createGrid and Grid type
import ReactGA from "react-ga4";

import './ShipSelection.css';

// --- ShipSelection component remains the same ---
interface ShipSelectionProps {
  solving: boolean;
}

const ShipSelection: React.FC<ShipSelectionProps> = ({ solving }) => {
  const selectedShipType = useShipTypesStore((state) => state.selectedShipType);
  const setSelectedShipType = useShipTypesStore((state) => state.setSelectedShipType);
  // Get the new action from the store
  const setGridAndResetAuxiliaryState = useGridStore((state) => state.setGridAndResetAuxiliaryState);
  const previousSelectionRef = useRef<string | null>(null);

  const handleOptionSelect = (option: string) => {
    if (option !== previousSelectionRef.current) {

      ReactGA.event('platform_selection', {
        platform: option
      });

      setSelectedShipType(option);

      // --- Determine the new grid state ---
      // createGrid(10, 6) creates a 6x10 grid with all cells active and not supercharged.
      const initialGrid = createGrid(10, 6);
      let newCells = initialGrid.cells; // Start with the default active cells

      // If the selected ship type is a freighter, deactivate rows 4 and 5
      if (option.toLowerCase().includes("freighter")) {
        newCells = initialGrid.cells.map((row, rIndex) => {
          // Target rows 4 and 5 (0-indexed)
          if (rIndex === 4 || rIndex === 5) {
            // For the target rows, map each cell to be inactive and not supercharged
            return row.map(cell => ({ ...cell, active: false, supercharged: false }));
          }
          // For other rows, return the original row from createGrid (it's already a new object)
          return row;
        });
      }

      // Prepare the payload for the GridStore action
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
      <DropdownMenu.Trigger>
        <IconButton size="2" variant="soft" disabled={solving} aria-label="Select ship type">
          <GearIcon className="w-6 h-6" />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content style={{ backgroundColor: "var(--accent-3)" }}>
        <Suspense fallback={<Text>Loading Ship Types...</Text>}>
          <ShipTypesDropdown selectedShipType={selectedShipType} handleOptionSelect={handleOptionSelect} />
        </Suspense>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
// --- End of ShipSelection component ---

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
const ShipTypesDropdown: React.FC<ShipTypesDropdownProps> = ({ selectedShipType, handleOptionSelect }) => {
  const shipTypes = useFetchShipTypesSuspense();

  // Group ship types by their 'type' property using useMemo for efficiency
  const groupedShipTypes = useMemo(() => {
    return Object.entries(shipTypes).reduce(
      (acc, [key, details]) => {
        const type = details.type; // e.g., 'Starship' or 'Multi-Tool'
        if (!acc[type]) {
          // If this type group doesn't exist yet, create it
          acc[type] = [];
        }
        // Add the item (key and details) to the correct group
        acc[type].push({ key, details });
        return acc;
      },
      {} as Record<string, { key: string; details: ShipTypeDetail }[]> // Initial value is an empty object typed correctly
    );
  }, [shipTypes]); // Recalculate only if shipTypes changes

  return (
    <DropdownMenu.RadioGroup value={selectedShipType} onValueChange={handleOptionSelect}>
      {/* Iterate over the groups (e.g., 'Starship', 'Multi-Tool') */}
      {Object.entries(groupedShipTypes).map(([type, items], groupIndex) => (
        // Use React.Fragment to group elements for each type without adding extra DOM nodes
        <React.Fragment key={type}>
          {/* Add a separator before each group except the first one */}
          {groupIndex > 0 && <DropdownMenu.Separator />}
          {/* Display the group type as a label */}
          <DropdownMenu.Label>
            <span className="shipSelection__header">{type}s</span>
          </DropdownMenu.Label>{" "}
          {/* Pluralize for display */}
          {/* Iterate over the items within the current group */}
          {items.map(({ key, details }) => (
            <DropdownMenu.RadioItem key={key} value={key} className="font-bold last:mb-2">
              {/* Display the specific item's label */}
              {details.label}
            </DropdownMenu.RadioItem>
          ))}
        </React.Fragment>
      ))}
    </DropdownMenu.RadioGroup>
  );
};

export default ShipSelection;
