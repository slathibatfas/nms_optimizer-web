import {
	InfoCircledIcon,
	QuestionMarkCircledIcon,
	ResetIcon,
	Share2Icon,
} from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";
import React from "react";
import ReactGA from "react-ga4";
import { useTranslation } from "react-i18next";

import { useBreakpoint } from "../../hooks/useBreakpoint";

interface GridTableButtonsProps {
	onShowInstructions: () => void;
	onShowAbout: () => void; // Changed from onShowChangeLog, assuming this is for the "About" section
	onShare: () => void; // Added onShare to props interface
	onReset: () => void;
	isSharedGrid: boolean;
	hasModulesInGrid: boolean;
	solving: boolean;
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
	isFirstVisit,
}) => {
	const isSmallAndUp = useBreakpoint("640px"); // sm breakpoint
	const { t } = useTranslation();
	return (
		<>
			<div className="col-span-7 mt-2 sm:mt-3">
				{/* This div will contain the left-aligned buttons */}
				<Button
					size={isSmallAndUp ? "2" : "1"}
					variant={isFirstVisit ? "solid" : "soft"}
					className={`gridTable__button gridTable__button--instructions shadow-md !mr-2 p-0  ${
						isFirstVisit ? "button--glow" : ""
					}`}
					onClick={() => {
						ReactGA.event({
							category: "User Interactions",
							action: "showInstructions",
						});
						onShowInstructions();
					}}
					aria-label={t("buttons.instructions")}
				>
					<QuestionMarkCircledIcon />
					<span className="hidden sm:inline">{t("buttons.instructions")}</span>
				</Button>
				<Button
					size={isSmallAndUp ? "2" : "1"}
					variant="soft"
					className={`gridTable__button gridTable__button--about shadow-md !mr-2`}
					onClick={() => {
						ReactGA.event({
							category: "User Interactions",
							action: "showAbout",
						});
						onShowAbout();
					}}
					aria-label={t("buttons.about")}
				>
					<InfoCircledIcon />
					<span className="hidden sm:inline">{t("buttons.about")}</span>
				</Button>
				{!isSharedGrid && (
					<Button
						size={isSmallAndUp ? "2" : "1"}
						variant="soft"
						className="shadow-md gridTable__button gridTable__button--changelog"
						onClick={onShare}
						disabled={solving || !hasModulesInGrid}
						aria-label={t("buttons.share")}
					>
						<Share2Icon />
						<span className="hidden sm:inline">{t("buttons.share")}</span>
					</Button>
				)}
			</div>

			<div className="flex justify-end col-span-3 mt-2 sm:mt-3">
				<Button
					size={isSmallAndUp ? "2" : "1"}
					className={`gridTable__button gridTable__button--reset shadow-md`}
					variant="solid"
					onClick={onReset}
					disabled={solving}
					aria-label={t("buttons.resetGrid")}
				>
					<ResetIcon />
					{t("buttons.resetGrid")}
				</Button>
			</div>
		</>
	);
};

export default GridTableButtons;
