// src/components/ShipSelection/ShipSelection.tsx
import { GearIcon } from "@radix-ui/react-icons";
import { DropdownMenu, IconButton, Text } from "@radix-ui/themes";
import React, { Suspense, useRef } from "react";
import { useFetchShipTypesSuspense, useShipTypesStore } from "../../hooks/useShipTypes";
import { useGridStore } from "../../store/GridStore";

interface ShipSelectionProps {
  solving: boolean;
}

/**
 * A dropdown menu for selecting a ship type.
 *
 * This component provides a dropdown menu for selecting a ship type. If the
 * selection changes, it will update the grid and reset the optimization.
 *
 * @param {boolean} solving - Indicates whether the optimization is in progress.
 */
const ShipSelection: React.FC<ShipSelectionProps> = ({ solving }) => {
  const selectedShipType = useShipTypesStore((state) => state.selectedShipType);
  const setSelectedShipType = useShipTypesStore((state) => state.setSelectedShipType);
  const resetGrid = useGridStore((state) => state.resetGrid);
  const previousSelectionRef = useRef<string | null>(null);

  /**
   * Handles a ship type selection change.
   *
   * If the selection has changed, update the grid and reset the optimization.
   * This is done by calling `setSelectedShipType` and `resetGrid`, which are
   * imported from `useShipTypesStore` and `useGridStore`, respectively.
   *
   * @param {string} option - The selected ship type.
   */
  const handleOptionSelect = (option: string) => {
    // If the selection has changed, update the grid and reset the optimization
    if (option !== previousSelectionRef.current) {
      setSelectedShipType(option);
      resetGrid();
    }
    // Store the new selection
    previousSelectionRef.current = option;
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton
          variant="soft"
          disabled={solving} // Disable the dropdown while optimization is in progress
        >
          <GearIcon className="w-6 h-6" />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <Suspense fallback={<Text>Loading Ship Types...</Text>}>
          <ShipTypesDropdown
            selectedShipType={selectedShipType}
            handleOptionSelect={handleOptionSelect}
          />
        </Suspense>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

interface ShipTypesDropdownProps {
  selectedShipType: string;
  handleOptionSelect: (option: string) => void;
}

/**
 * A dropdown menu for selecting a ship type.
 *
 * This component renders a dropdown menu for selecting a ship type. The
 * component expects a `selectedShipType` prop, which indicates the currently
 * selected ship type, and a `handleOptionSelect` prop, which will be called
 * when the user selects a different ship type.
 *
 * @param {string} selectedShipType - The currently selected ship type.
 * @param {function} handleOptionSelect - A function to be called when the user
 *   selects a different ship type.
 */
const ShipTypesDropdown: React.FC<ShipTypesDropdownProps> = ({
  selectedShipType,
  handleOptionSelect,
}) => {
  const shipTypes = useFetchShipTypesSuspense();
  return (
    <DropdownMenu.RadioGroup
      value={selectedShipType}
      onValueChange={handleOptionSelect}
    >
      {Object.entries(shipTypes).map(([key, label]) => (
        <DropdownMenu.RadioItem key={key} value={key} className="font-bold">
          {label}
        </DropdownMenu.RadioItem>
      ))}
    </DropdownMenu.RadioGroup>
  );
};

export default ShipSelection;
