// src/components/ShipSelection/ShipSelection.tsx
import React, { useRef } from "react";
import { DropdownMenu, Button } from "@radix-ui/themes";
import { GearIcon } from "@radix-ui/react-icons";
import { useFetchShipTypesSuspense, useShipTypesStore } from "../../hooks/useShipTypes";
import { useGridStore } from "../../store/useGridStore"; // Import useGridStore

const ShipSelection: React.FC = () => {
  const shipTypes = useFetchShipTypesSuspense();
  const selectedShipType = useShipTypesStore((state) => state.selectedShipType);
  const setSelectedShipType = useShipTypesStore((state) => state.setSelectedShipType);
  const resetGrid = useGridStore((state) => state.resetGrid); // Get resetGrid
  const previousSelectionRef = useRef<string | null>(null); // Track previous selection

  const handleOptionSelect = (option: string) => {
    if (option !== previousSelectionRef.current) {
      setSelectedShipType(option);
      resetGrid();
    }
    previousSelectionRef.current = option;
  };

  return (

    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="soft" color="gray">
          <GearIcon className="w-6 h-6" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content avoidCollisions={true}  >
        <DropdownMenu.RadioGroup value={selectedShipType} onValueChange={handleOptionSelect}>
          {Object.entries(shipTypes).map(([key, label]) => (
            <DropdownMenu.RadioItem key={key} value={key}>
              {label}
            </DropdownMenu.RadioItem>
          ))}
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Content>
    </DropdownMenu.Root>

  );
};

export default ShipSelection;
