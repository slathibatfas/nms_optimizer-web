import React from "react";
import { Button } from "@radix-ui/themes";
import { QuestionMarkCircledIcon, CounterClockwiseClockIcon, ResetIcon, Share1Icon } from "@radix-ui/react-icons";
import ReactGA from "react-ga4";

interface GridTableButtonsProps {
  onShowInstructions: () => void;
  onShowChangeLog: () => void;
  onShare: () => void;
  onReset: () => void;
  isSharedGrid: boolean;
  hasModulesInGrid: boolean;
  solving: boolean;
  columnWidth: string;
  isFirstVisit: boolean; // Add prop for first visit
}

const GridTableButtons: React.FC<GridTableButtonsProps> = ({
  onShowInstructions,
  onShowChangeLog,
  onShare,
  onReset,
  isSharedGrid,
  hasModulesInGrid,
  solving,
  columnWidth,
  isFirstVisit, 
}) => {
  return (
    // Add 'relative' to establish a positioning context for the absolutely positioned reset button.
    <footer className="relative flex items-start gap-4 pt-4 sm:pt-6 gridTable__footer">
      <div className="flex-1 flex-nowrap"> {/* This div will contain the left-aligned buttons */}
        <Button
          variant="soft"
          className={`gridTable__button gridTable__button--instructions shadow-lg !mr-2 p-0 sm:!px-2 ${
            isFirstVisit ? 'button--glow' : ''
          }`}
          onClick={() => {
            ReactGA.event({
              category: "User Interactions",
              action: "showInstructions",
            });
            onShowInstructions();
          }}
        >
          <QuestionMarkCircledIcon />
          <span className="hidden sm:inline">Instructions</span>
        </Button>
        <Button
          variant="soft"
          className={`gridTable__button gridTable__button--changelog shadow-lg !mr-2 sm:!px-2`}
          onClick={() => {
            ReactGA.event({
              category: "User Interactions",
              action: "showChangeLog",
            });
            onShowChangeLog();
          }}
        >
          <CounterClockwiseClockIcon />
          <span className="hidden sm:inline">Change Log</span>
        </Button>
        {!isSharedGrid && (
          <Button variant="soft" className={`gridTable__button gridTable__button--changelog shadow-sm sm:!px-2`} onClick={onShare} disabled={isSharedGrid || !hasModulesInGrid}>
            <Share1Icon />
            <span className="hidden sm:inline">Share Link</span>
          </Button>
        )}
      </div>
      {/* This div will contain the Reset Grid button and be absolutely positioned. */}
      {/* Conditionally render the reset button container to avoid layout shift.
          Render if it's a shared grid (columnWidth will be "0px" correctly)
          OR if columnWidth is no longer its initial "0px" (meaning it's measured or a fallback for non-shared). */}
      {( columnWidth !== "0px") && (
        <div
          className="absolute z-10" // Use 'absolute' positioning and a z-index if needed.
          style={{ right: columnWidth }}
        >
          <Button className={`gridTable__button gridTable__button--reset shadow-sm`} variant="solid" onClick={onReset} disabled={solving}>
            <ResetIcon />
            <span className="font-bold">Reset Grid</span>
          </Button>
        </div>
      )}
    </footer>
  );
};

export default GridTableButtons;