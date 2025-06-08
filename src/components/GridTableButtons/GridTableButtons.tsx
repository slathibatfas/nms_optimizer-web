import React from "react";
import { Button } from "@radix-ui/themes";
import {
	QuestionMarkCircledIcon,
	InfoCircledIcon,
	ResetIcon,
	Share2Icon,
} from "@radix-ui/react-icons";
import ReactGA from "react-ga4";
import { useBreakpoint } from "../../hooks/useBreakpoint";

interface GridTableButtonsProps {
	onShowInstructions: () => void;
	onShowAbout: () => void; // Changed from onShowChangeLog, assuming this is for the "About" section
	onShare: () => void; // Added onShare to props interface
	onReset: () => void;
	isSharedGrid: boolean;
	hasModulesInGrid: boolean;
	solving: boolean;
	columnWidth: string;
	isFirstVisit: boolean; // Add prop for first visit
}

const GridTableButtons: React.FC<GridTableButtonsProps> = ({
	onShowInstructions,
	onShowAbout, // Use the new prop
	onShare, // Keep onShare
	onReset,
	isSharedGrid,
	hasModulesInGrid,
	solving,
	columnWidth,
	isFirstVisit,
}) => {
	const isSmallAndUp = useBreakpoint("640px"); // sm breakpoint
	return (
		// Add 'relative' to establish a positioning context for the absolutely positioned reset button.
		<footer className="relative flex items-start pt-3 sm:pt-4 gridTable__footer">
			<div className="flex-1 flex-nowrap">
				{" "}
				{/* This div will contain the left-aligned buttons */}
				<Button
					size={isSmallAndUp ? "2" : "1"}
					variant={isFirstVisit ? "solid" : "soft"}
					className={`gridTable__button gridTable__button--instructions !cursor-pointer shadow-md !mr-2 p-0  ${
						isFirstVisit ? "button--glow" : ""
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
					size={isSmallAndUp ? "2" : "1"}
					variant="soft"
					className={`gridTable__button gridTable__button--about !cursor-pointer shadow-md !mr-2`} // Renamed class for clarity
					onClick={() => {
						ReactGA.event({
							category: "User Interactions",
							action: "showAbout",
						});
						onShowAbout();
					}}
				>
					<InfoCircledIcon />
					<span className="hidden sm:inline">About</span>
				</Button>
				{!isSharedGrid && (
					<Button
						size={isSmallAndUp ? "2" : "1"}
						variant="soft"
						className={`gridTable__button gridTable__button--changelog shadow-md ${
							!isSharedGrid && hasModulesInGrid ? "!cursor-pointer" : ""
						}`}
						onClick={onShare}
						disabled={isSharedGrid || !hasModulesInGrid}
					>
						<Share2Icon />
						<span className="hidden sm:inline">Share</span>
					</Button>
				)}
			</div>
			{/* This div will contain the Reset Grid button and be absolutely positioned. */}
			{/* Conditionally render the reset button container to avoid layout shift.
          Render if it's a shared grid (columnWidth will be "0px" correctly)
          OR if columnWidth is no longer its initial "0px" (meaning it's measured or a fallback for non-shared). */}
			{columnWidth !== "0px" && (
				<div
					className="absolute z-10" // Use 'absolute' positioning and a z-index if needed.
					style={{ right: columnWidth }}
				>
					<Button
						size={isSmallAndUp ? "2" : "1"}
						className={`gridTable__button gridTable__button--reset !cursor-pointer shadow-md`}
						variant="solid"
						onClick={onReset}
						disabled={solving}
					>
						<ResetIcon />
						<span className="font-bold">Reset Grid</span>
					</Button>
				</div>
			)}
		</footer>
	);
};

export default GridTableButtons;
