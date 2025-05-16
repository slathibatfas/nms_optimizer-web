// src/components/TechTreeRow/TechTreeRow.tsx
import React, { useEffect } from "react";
import { useGridStore } from "../../store/GridStore";
import { useTechStore } from "../../store/TechStore";
import { IconButton, Flex, Text, Tooltip, Checkbox } from "@radix-ui/themes";
import { UpdateIcon, ResetIcon, ChevronDownIcon, DoubleArrowLeftIcon, ExclamationTriangleIcon, Crosshair2Icon, LightningBoltIcon } from "@radix-ui/react-icons";
import { Accordion } from "radix-ui";
import { useShakeStore } from "../../store/ShakeStore";

import './TechTreeRow.css';

interface TechTreeRowProps {
  label: string;
  tech: string;
  handleOptimize: (tech: string) => Promise<void>;
  solving: boolean;
  modules: { label: string; id: string; image: string; type?: string }[];
  techImage: string | null; // Add techImage prop
}

// Define a type for the keys of the colorMap
// type ColorMapKey = "purple" | "red" | "green" | "cyan" | "amber" | "iris" | "yellow" | "sky" | "jade" | "orange" | "gray";

// Define a type for the valid color strings for IconButton
// type IconButtonColor = ColorMapKey;

function round(value: number, decimals: number) {
  return Number(Math.round(Number(value + "e" + decimals)) + "e-" + decimals);
}

export const TechTreeRow: React.FC<TechTreeRowProps> = ({ label, tech, handleOptimize, solving, modules, techImage }) => {
  const hasTechInGrid = useGridStore((state) => state.hasTechInGrid(tech));
  const isGridFull = useGridStore((state) => state.isGridFull);
  const handleResetGridTech = useGridStore((state) => state.resetGridTech);
  const { max_bonus, clearTechMaxBonus, solved_bonus, clearTechSolvedBonus, checkedModules, setCheckedModules, clearCheckedModules } = useTechStore();
  const techMaxBonus = max_bonus?.[tech] ?? 0;
  const techSolvedBonus = solved_bonus?.[tech] ?? 0;
  const tooltipLabel = hasTechInGrid ? "Update" : "Solve";
  const IconComponent = hasTechInGrid ? UpdateIcon : DoubleArrowLeftIcon;
  const getTechColor = useTechStore((state) => state.getTechColor); // Get getTechColor function
  const { setShaking } = useShakeStore();

  useEffect(() => {
    return () => {
      clearCheckedModules(tech);
    };
  }, [tech, clearCheckedModules]);

  const handleReset = () => {
    handleResetGridTech(tech);
    clearTechMaxBonus(tech);
    clearTechSolvedBonus(tech);
  };

  const handleCheckboxChange = (moduleId: string) => {
    setCheckedModules(tech, (prevChecked = []) => {
      // Provide a default empty array
      // Provide a default empty array
      const isChecked = prevChecked.includes(moduleId);
      return isChecked ? prevChecked.filter((id) => id !== moduleId) : [...prevChecked, moduleId];
    });
  };

  const handleOptimizeClick = async () => {
    if (isGridFull() && !hasTechInGrid) {
      setShaking(true); // Trigger the shake
      setTimeout(() => {
        setShaking(false); // Stop the shake after a delay
      }, 500); // Adjust the duration as needed
    } else {
      handleResetGridTech(tech);
      clearTechMaxBonus(tech);
      clearTechSolvedBonus(tech);
      await handleOptimize(tech);
    }
  };

  // Get the checked modules for the current tech, or an empty array if undefined
  const currentCheckedModules = checkedModules[tech] || [];
  const techColor = getTechColor(tech ?? "white");

  // --- Image Path and SrcSet Construction ---
  const baseImagePath = "/assets/img/buttons/";
  const fallbackImage = `${baseImagePath}infra.webp`; // Fallback for browsers not supporting srcSet or if techImage is null

  let imagePath = fallbackImage;
  let imageSrcSet = "";

  if (techImage) {
    const imageNameWithoutExtension = techImage.substring(0, techImage.lastIndexOf('.'));
    const extension = techImage.substring(techImage.lastIndexOf('.'));

    imagePath = `${baseImagePath}${techImage}`; // Default src
    // Example srcSet, adjust sizes and paths as per your available images
    imageSrcSet = `${baseImagePath}${imageNameWithoutExtension}${extension} 1x, ${baseImagePath}${imageNameWithoutExtension}@x2${extension} 2x`;
  }

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
          radius="small"
          variant="solid"
          {...(techColor === "white" && !solving
            ? {
                "data-accent-color": "white",
                style: { border: "2px solid var(--gray-a11)", backgroundColor: "var(--gray-a4)", color: "var(--gray-12)" }, // Manual styles for a white button with black text/icon
              }
            : techColor === "gray"
            ? {
                "data-accent-color": "gray",
              }
            : {
                "data-accent-color": techColor,
              })}
          aria-label={`${tooltipLabel} ${label}`}
          className={`techRow__optimizeButton shadow-md ${!solving ? '!cursor-pointer' : '!cursor-not-allowed'}`.trim()}
        >
          <div className="relative shadow-md group">
            <img
              src={imagePath}
              srcSet={imageSrcSet || undefined} // Use undefined if imageSrcSet is empty to avoid an empty attribute
              alt={label}
              className="w-full h-full techRow__optimizeButton--image"
            />
            <IconComponent className="absolute top-0 right-0 p-1 transition-opacity opacity-0 w-7 h-7 group-hover:opacity-100" />
          </div>
        </IconButton>
      </Tooltip>

      <div className="flex flex-col items-center shadow-md">
        <Tooltip delayDuration={1000} content="Reset">
          <IconButton
            radius="small"
            variant="solid"
            onClick={handleReset}
            disabled={!hasTechInGrid || solving}
            aria-label={`Reset ${label}`}
            className={`techRow__resetButton ${(!(!hasTechInGrid || solving)) ? '!cursor-pointer' : ''}`}
          >
            <ResetIcon />
          </IconButton>
        </Tooltip>
      </div>

      <div className="flex flex-col self-start w-full techRow_module">
        <Text className="pt-1 font-semibold text-normal techRow__label >">
          {modules.some((module) => module.type === "reward") ? (
            <Accordion.Root
              className="w-full pb-1 border-b-1 AccordionRoot"
              style={{ borderColor: "var(--gray-a6)" }}
              type="single"
              collapsible
              defaultValue="item-1"
            >
              <Accordion.Item className="AccordionItem" value="item-1">
                <AccordionTrigger>
                  <div>
                    {label}
                    {techSolvedBonus > 0 && (
                      <>
                        {/* Show warning icon if the solved bonus is less than 100% */}
                        {round(techMaxBonus, 2) < 100 && (
                          <Tooltip content="Insufficient space!">
                            <ExclamationTriangleIcon className="inline-block w-5 h-5 ml-1 align-text-bottom" style={{ color: "var(--red-a8)" }} />
                          </Tooltip>
                        )}
                        {round(techMaxBonus, 2) === 100 && (
                          <Tooltip content="Valid solve!">
                            {/* Using amber color for bonus indication */}
                            <Crosshair2Icon className="inline-block w-5 h-5 ml-1 align-text-bottom" style={{ color: "var(--gray-a10)" }} />
                          </Tooltip>
                        )}
                        {round(techMaxBonus, 2) > 100 && (
                          <Tooltip content="Boosted solve!">
                            {/* Using amber color for bonus indication */}
                            <LightningBoltIcon className="inline-block w-5 h-5 ml-1 align-text-bottom" style={{ color: "var(--amber-a8)" }} />
                          </Tooltip>
                        )}
                      </>
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
              {techSolvedBonus > 0 && (
                <>
                  {/* Show warning icon if the solved bonus is less than 100% */}
                  {round(techMaxBonus, 2) < 100 && (
                    <Tooltip content="Insufficient space!">
                      <ExclamationTriangleIcon className="inline-block w-5 h-5 ml-1 align-text-bottom" style={{ color: "var(--red-a8)" }} />
                    </Tooltip>
                  )}
                  {round(techMaxBonus, 2) === 100 && (
                    <Tooltip content="Valid solve!">
                      {/* Using amber color for bonus indication */}
                      <Crosshair2Icon className="inline-block w-5 h-5 ml-1 align-text-bottom" style={{ color: "var(--gray-a10)" }} />
                    </Tooltip>
                  )}
                  {round(techMaxBonus, 2) > 100 && (
                    <Tooltip content="Boosted solve!">
                      {/* Using amber color for bonus indication */}
                      <LightningBoltIcon className="inline-block w-5 h-5 ml-1 align-text-bottom" style={{ color: "var(--amber-a8)" }} />
                    </Tooltip>
                  )}
                </>
              )}
            </>
          )}
        </Text>
      </div>
    </Flex>
  );
};
