import React, { useState } from "react";
import { useGridStore } from "../../store/useGridStore";
import { useTechStore } from "../../store/useTechStore";
import { IconButton, Flex, Text, Tooltip } from "@radix-ui/themes";
import { UpdateIcon, ResetIcon, DoubleArrowLeftIcon, CheckIcon } from "@radix-ui/react-icons";
import { Checkbox } from "radix-ui";

interface OptimizationButtonProps {
  label: string;
  tech: string;
  handleOptimize: (tech: string, checkedModules: string[]) => Promise<void>;
  solving: boolean;
  modules: { label: string; id: string; image: string; type?: string }[];
}

const OptimizationButton: React.FC<OptimizationButtonProps> = ({
  label,
  tech,
  handleOptimize,
  solving,
  modules,
}) => {
  const [checkedModules, setCheckedModules] = useState<string[]>([]);
  const hasTechInGrid = useGridStore((state) => state.hasTechInGrid(tech));
  const handleResetGridTech = useGridStore((state) => state.resetGridTech);
  const { max_bonus, clearTechMaxBonus } = useTechStore();
  const techMaxBonus = max_bonus?.[tech];

  const handleReset = () => {
    handleResetGridTech(tech);
    clearTechMaxBonus(tech);
    setCheckedModules([]);
  };

  const handleCheckboxChange = (moduleId: string) => {
    setCheckedModules((prevChecked) => {
      const isChecked = prevChecked.includes(moduleId);
      return isChecked ? prevChecked.filter((id) => id !== moduleId) : [...prevChecked, moduleId];
    });
  };

  const handleOptimizeClick = async () => {
    console.log("Checked Modules for", tech + ":", checkedModules); // Log checked modules
    await handleOptimize(tech, checkedModules);
  };

  return (
    <Flex className="flex gap-2 mt-2 mb-2 items-top optimizationButton">
      <Tooltip content={hasTechInGrid ? "Update" : "Solve"}>
        <IconButton
          onClick={handleOptimizeClick} // Call handleOptimizeClick
          disabled={solving}
          variant="soft"
          highContrast
          className="z-10 techRow__optimizeButton"
        >
          {hasTechInGrid ? <UpdateIcon /> : <DoubleArrowLeftIcon />}
        </IconButton>
      </Tooltip>

      {hasTechInGrid ? (
        <Tooltip content="Reset">
          <IconButton onClick={handleReset} disabled={solving} variant="soft" highContrast className="techRow__resetButton">
            <ResetIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <IconButton onClick={handleReset} disabled variant="soft" highContrast className="techRow__resetButton">
          <ResetIcon />
        </IconButton>
      )}

      <div className="flex flex-col self-start techRow_module">
        <Text className="pt-1 font-bold techRow__label">
          {label}
          {techMaxBonus !== undefined && techMaxBonus !== 0 && (
            <span className="pl-1 font-thin optimizationButton__bonus" style={{ color: techMaxBonus > 101 ? "#e6c133" : "var(--gray-11)" }}>
              {techMaxBonus.toFixed(0)}%
            </span>
          )}
        </Text>
        {modules
          .filter((module) => module.type === "reward")
          .map((module) => (
            <div key={module.id} className="inline-flex items-center gap-2 mt-2">
              <Checkbox.Root
                className="CheckboxRoot"
                id={module.id}
                checked={checkedModules.includes(module.id)}
                onClick={() => handleCheckboxChange(module.id)} // Use onClick here
              >
                <Checkbox.Indicator className="CheckboxIndicator">
                  <CheckIcon />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <label className="font-extralight Label" htmlFor={module.id}>
                {module.label}
              </label>
            </div>
          ))}
      </div>
    </Flex>
  );
};

export default OptimizationButton;
