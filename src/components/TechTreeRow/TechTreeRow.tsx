// src/components/TechTreeRow/TechTreeRow.tsx
import React, { useEffect } from "react";
import { useGridStore } from "../../store/GridStore";
import { useTechStore } from "../../store/TechStore";
import { IconButton, Flex, Text, Tooltip, Checkbox } from "@radix-ui/themes";
import { UpdateIcon, ResetIcon, ChevronDownIcon, DoubleArrowLeftIcon } from "@radix-ui/react-icons";
import { Accordion } from "radix-ui";

interface TechTreeRowProps {
  label: string;
  tech: string;
  handleOptimize: (tech: string) => Promise<void>;
  solving: boolean;
  modules: { label: string; id: string; image: string; type?: string }[];
  techImage: string | null; // Add techImage prop
}

// Define a type for the keys of the colorMap
type ColorMapKey = "purple" | "red" | "green" | "cyan" | "amber" | "iris" | "yellow" | "sky" | "jade" | "orange" | "gray";

// Define a type for the valid color strings for IconButton
type IconButtonColor = ColorMapKey;

export const TechTreeRow: React.FC<TechTreeRowProps> = ({ label, tech, handleOptimize, solving, modules, techImage }) => {
  const hasTechInGrid = useGridStore((state) => state.hasTechInGrid(tech));
  const handleResetGridTech = useGridStore((state) => state.resetGridTech);
  const { max_bonus, clearTechMaxBonus, checkedModules, setCheckedModules, clearCheckedModules } = useTechStore();
  const techMaxBonus = max_bonus?.[tech] ?? 0;
  const tooltipLabel = hasTechInGrid ? "Update" : "Solve";
  const IconComponent = hasTechInGrid ? UpdateIcon : DoubleArrowLeftIcon;
  const getTechColor = useTechStore((state) => state.getTechColor); // Get getTechColor function

  useEffect(() => {
    return () => {
      clearCheckedModules(tech);
    };
  }, [tech, clearCheckedModules]);

  const handleReset = () => {
    handleResetGridTech(tech);
    clearTechMaxBonus(tech);
  };

  const handleCheckboxChange = (moduleId: string) => {
    setCheckedModules(tech, (prevChecked = []) => {
      // Provide a default empty array
      const isChecked = prevChecked.includes(moduleId);
      return isChecked ? prevChecked.filter((id) => id !== moduleId) : [...prevChecked, moduleId];
    });
  };

  const handleOptimizeClick = async () => {
    handleResetGridTech(tech);
    clearTechMaxBonus(tech);
    await handleOptimize(tech);
  };

  // Get the checked modules for the current tech, or an empty array if undefined
  const currentCheckedModules = checkedModules[tech] || [];
  const techColor = getTechColor(tech ?? "");

  // Construct the image path dynamically
  const imagePath = techImage ? `/assets/img/icons/${techImage}` : "/assets/img/infra-upgrade.png";

  const AccordionTrigger = React.forwardRef(
    ({ children, className, ...props }: { children: React.ReactNode; className?: string }, forwardedRef: React.Ref<HTMLButtonElement>) => (
      <Accordion.Header className="AccordionHeader">
        <Accordion.Trigger className={`AccordionTrigger ${className || ""}`} {...props} ref={forwardedRef}>
          {children}
          <ChevronDownIcon className="AccordionChevron" aria-hidden />
        </Accordion.Trigger>
      </Accordion.Header>
    )
  );

  return (
    <Flex className="flex gap-2 mt-2 mb-2 items-top optimizationButton">
      <Tooltip delayDuration={1000} content={tooltipLabel}>
        <IconButton
          onClick={handleOptimizeClick}
          disabled={solving}
          variant="soft"
          color={techColor as IconButtonColor} // Use the techColor string directly
          className="z-10 techRow__optimizeButton"
          style={{ backgroundImage: `url(${imagePath})` }}
        >
          <div className="relative group">
            <img
              src={imagePath}
              alt={label}
              className="object-cover w-full h-full transition duration-200 border-2 rounded-sm techRow__optimizeButton--image group-hover:brightness-75"
            />
            <IconComponent className="absolute top-0 right-0 w-8 h-8 p-1 transition-opacity opacity-0 group-hover:opacity-100" />
          </div>
        </IconButton>
      </Tooltip>

      <div className="flex flex-col items-center">
        <Tooltip delayDuration={1000} content="Reset">
          <IconButton onClick={handleReset} disabled={!hasTechInGrid || solving} className="techRow__resetButton">
            <ResetIcon />
          </IconButton>
        </Tooltip>
      </div>

      <div className="flex flex-col self-start w-full techRow_module">
        <Text className="pt-1 font-semibold techRow__label >">
          {modules.some((module) => module.type === "reward") ? (
            <Accordion.Root
              className="w-full pb-1 border-b-1 AccordionRoot"
              style={{ borderColor: "var(--gray-a6)" }}
              type="single"
              collapsible
              defaultValue=""
            >
              <Accordion.Item className="AccordionItem" value="item-1">
                <AccordionTrigger>
                  <div>
                    {label}
                    {techMaxBonus > 0 && (
                      <span
                        className="inline-block pl-1 font-thin optimizationButton__bonus"
                        style={{ color: techMaxBonus > 101 ? "#e6c133" : "var(--gray-11)" }}
                      >
                        {techMaxBonus.toFixed(0)}%
                      </span>
                    )}
                  </div>
                </AccordionTrigger>
                <Accordion.Content className="AccordionContent">
                  {modules
                    .filter((module) => module.type === "reward")
                    .map((module) => (
                      <div key={module.id} className="flex items-center gap-2 AccordionContentText">
                        <Checkbox
                          className="CheckboxRoot"
                          id={module.id}
                          checked={currentCheckedModules.includes(module.id)}
                          onClick={() => handleCheckboxChange(module.id)}
                        />
                        <label className="Label" htmlFor={module.id}>
                          {module.label}
                        </label>
                      </div>
                    ))}
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          ) : (
            <>
              {label}
              {techMaxBonus > 0 && (
                <span className="pl-1 font-thin optimizationButton__bonus" style={{ color: techMaxBonus > 101 ? "#e6c133" : "var(--gray-11)" }}>
                  {techMaxBonus.toFixed(0)}%
                </span>
              )}
            </>
          )}
        </Text>
      </div>
    </Flex>
  );
};
