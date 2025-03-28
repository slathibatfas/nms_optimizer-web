// src/components/OptimizationButton.tsx
import React from "react";
import { useGridStore } from "../../store/useGridStore";
import { useTechStore } from "../../store/useTechStore";
import { IconButton, Flex, Text, Tooltip } from "@radix-ui/themes";
import { UpdateIcon, ResetIcon, DoubleArrowLeftIcon, CheckIcon } from "@radix-ui/react-icons";
import { Checkbox } from "radix-ui";

interface OptimizationButtonProps {
  label: string;
  tech: string;
  handleOptimize: (tech: string) => Promise<void>; // Receive handleOptimize as a prop
  solving: boolean; // Receive solving as a prop
}

/**
 * A button component designed to handle optimization actions for a specific tech.
 */
const OptimizationButton: React.FC<OptimizationButtonProps> = ({
  label,
  tech,
  handleOptimize, // Receive handleOptimize as a prop
  solving, // Receive solving as a prop
}) => {
  //const { solving, handleOptimize } = useOptimize(); // Remove useOptimize
  const hasTechInGrid = useGridStore((state) => state.hasTechInGrid(tech));
  const handleResetGridTech = useGridStore((state) => state.resetGridTech);
  const { max_bonus, clearTechMaxBonus } = useTechStore();

  const techMaxBonus = max_bonus?.[tech];

  const handleReset = () => {
    handleResetGridTech(tech);
    clearTechMaxBonus(tech);
  };

  return (
    <Flex className="flex items-center gap-2 mt-2 mb-2 optimizationButton">
      <Tooltip content={hasTechInGrid ? "Update" : "Solve"}>
        <IconButton
          onClick={() => handleOptimize(tech)}
          disabled={solving}
          variant="soft"
          highContrast
          className="z-10 techRow__optimizeButton"
        >
          {hasTechInGrid ? <UpdateIcon /> : <DoubleArrowLeftIcon />}
        </IconButton>
      </Tooltip>

      {/* Reset button: Explicit `else` case when `hasTechInGrid` is false */}
      {hasTechInGrid ? (
        <Tooltip content="Reset">
          <IconButton
            onClick={handleReset}
            disabled={solving}
            variant="soft"
            highContrast
            className="techRow__resetButton"
          >
            <ResetIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <IconButton onClick={handleReset} disabled variant="soft" highContrast className="techRow__resetButton">
          <ResetIcon />
        </IconButton>
      )}

      <div>

        <Text className="font-normal techRow__label">{label}</Text>
        {/* <Checkbox.Root className="CheckboxRoot" defaultChecked id="c1">
          <Checkbox.Indicator className="CheckboxIndicator">
            <CheckIcon />
          </Checkbox.Indicator>
        </Checkbox.Root>
        <label className="Label" htmlFor="c1">
          Photonix Core
        </label> */}

        {techMaxBonus !== undefined && techMaxBonus !== 0 && (
          <Text
            className="font-thin optimizationButton__bonus"
            style={{
              color: techMaxBonus > 101 ? "#e6c133" : "var(--gray-11)", // Highlight if > 101%
            }}
          >
            {techMaxBonus.toFixed(0)}%
          </Text>
        )}
      </div>
    </Flex>
  );
};

export default OptimizationButton;
