// src/components/TechTreeRow/TechTreeRow.tsx
import React, { useEffect } from "react";
import { useGridStore } from "../../store/useGridStore";
import { useTechStore } from "../../store/useTechStore";
import { IconButton, Flex, Text, Tooltip } from "@radix-ui/themes";
import { UpdateIcon, ResetIcon, DoubleArrowLeftIcon, CheckIcon } from "@radix-ui/react-icons";
import { Checkbox } from "radix-ui";

interface TechTreeRowProps {
  label: string;
  tech: string;
  handleOptimize: (tech: string) => Promise<void>;
  solving: boolean;
  modules: { label: string; id: string; image: string; type?: string }[];
}

const TechTreeRow: React.FC<TechTreeRowProps> = ({
  label,
  tech,
  handleOptimize,
  solving,
  modules,
}) => {
  const hasTechInGrid = useGridStore((state) => state.hasTechInGrid(tech));
  const handleResetGridTech = useGridStore((state) => state.resetGridTech);
  const { max_bonus, clearTechMaxBonus, checkedModules, setCheckedModules, clearCheckedModules } = useTechStore();
  const techMaxBonus = max_bonus?.[tech];

  useEffect(() => {
    return () => {
      clearCheckedModules(tech);
    };
  }, [tech, clearCheckedModules]);

  const handleReset = () => {
    handleResetGridTech(tech);
    clearTechMaxBonus(tech);
    clearCheckedModules(tech);
  };

  const handleCheckboxChange = (moduleId: string) => {
    setCheckedModules(tech, (prevChecked = []) => { // Provide a default empty array
      const isChecked = prevChecked.includes(moduleId);
      return isChecked ? prevChecked.filter((id) => id !== moduleId) : [...prevChecked, moduleId];
    });
  };

  const handleOptimizeClick = async () => {
    console.log("Checked Modules for", tech + ":", checkedModules[tech]);
    await handleOptimize(tech);
  };

  // Get the checked modules for the current tech, or an empty array if undefined
  const currentCheckedModules = checkedModules[tech] || [];

  return (
    <Flex className="flex gap-2 mt-2 mb-2 items-top optimizationButton">
      <Tooltip content={hasTechInGrid ? "Update" : "Solve"}>
        <IconButton
          onClick={handleOptimizeClick}
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
        <Text className="pt-1 font-semibold techRow__label">
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
                checked={currentCheckedModules.includes(module.id)} // Use the currentCheckedModules array
                onClick={() => handleCheckboxChange(module.id)}
              >
                <Checkbox.Indicator className="CheckboxIndicator">
                  <CheckIcon style={{ color: "var(--gray-11)" }} />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <label className="text-sm font-light Label" htmlFor={module.id}>
                {module.label}
              </label>
            </div>
          ))}      </div>
    </Flex>
  );
};

export default TechTreeRow;
