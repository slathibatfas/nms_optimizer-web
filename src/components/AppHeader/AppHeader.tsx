// src/components/AppHeader/AppHeader.tsx
import "./AppHeader.css";

import { CounterClockwiseClockIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import { IconButton, Separator, Tooltip } from "@radix-ui/themes";
import React from "react";
import ReactGA from "react-ga4";
import { useTranslation } from "react-i18next";
import { CgShapeRhombus } from "react-icons/cg";

import { APP_VERSION } from "../../constants";
import LanguageSelector from "../LanguageSelector/LanguageSelector"; // Import the new component

interface AppHeaderProps {
	onShowChangelog: () => void;
	onShowTranslationRequestDialog: () => void; // Add new prop
}

const AppHeaderInternal: React.FC<AppHeaderProps> = ({
	onShowChangelog,
	onShowTranslationRequestDialog, // Destructure new prop
}) => {
	const { t } = useTranslation();

	return (
		<header className="relative flex flex-col items-center p-4 sm:px-8 sm:pt-6 sm:pb-4 header lg:rounded-t-xl">
			<div className="!absolute !top-2 !right-4 sm:!top-4 sm:!right-8 z-10 !cursor-pointer flex items-center">
				<LanguageSelector />
				<IconButton
					className="!ml-px !hidden sm:!inline"
					color="amber"
					radius="full"
					variant="ghost"
					aria-label={t("translationRequest.openDialogLabel") || "Open translation request dialog"}
					onClick={() => {
						ReactGA.event({
							category: "User Interactions",
							action: "show_translation_request_dialog",
						});
						onShowTranslationRequestDialog();
					}}
				>
					<InfoCircledIcon />
				</IconButton>
			</div>
			<h1 className="text-2xl sm:text-4xl header__logo--text">NO MAN&apos;S SKY</h1>

			<div className="flex items-center w-full gap-2 m-1 mb-2">
				<Separator size="1" orientation="horizontal" color="cyan" decorative className="flex-1" />
				<CgShapeRhombus
					className="flex-shrink-0 w-4 h-4 sm:w-4 sm:h-4"
					style={{ color: "var(--accent-track)" }}
				/>
				<Separator size="1" orientation="horizontal" color="cyan" decorative className="flex-1" />
			</div>

			<h2 className="items-center text-xs sm:text-base header__title">
				<strong>{t("appHeader.subTitle")}</strong>
				<span className="font-thin"> {APP_VERSION}</span>&nbsp;&nbsp;
				<Tooltip content={t("buttons.changelog")}>
					<IconButton
						className="shadow-sm"
						variant="ghost"
						radius="full"
						size="1"
						aria-label={t("buttons.changelog")}
						onClick={() => {
							ReactGA.event({
								category: "User Interactions",
								action: "showChangelog",
							});
							onShowChangelog();
						}}
					>
						<CounterClockwiseClockIcon className="w-4 h-4 sm:w-5 sm:h-5" />
					</IconButton>
				</Tooltip>
			</h2>
		</header>
	);
};

// Memoize the component
const AppHeader = React.memo(AppHeaderInternal);
export default AppHeader;
