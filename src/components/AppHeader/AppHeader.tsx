// src/components/AppHeader/AppHeader.tsx
import "./AppHeader.css";

import { CounterClockwiseClockIcon } from "@radix-ui/react-icons";
import { IconButton, Separator, Tooltip } from "@radix-ui/themes";
import React from "react";
import ReactGA from "react-ga4";
import { useTranslation } from "react-i18next";
import { CgShapeRhombus } from "react-icons/cg";

import { APP_VERSION } from "../../constants";

interface AppHeaderProps {
	onShowChangelog: () => void;
}

const AppHeaderInternal: React.FC<AppHeaderProps> = ({ onShowChangelog }) => {
	// Use breakpoint for 'sm' (640px) as per Tailwind's default
	const { t } = useTranslation();

	return (
		<header className="flex flex-col items-center p-4 sm:px-8 sm:pt-6 sm:pb-4 header lg:rounded-t-xl">
			<h1 className="text-3xl sm:text-4xl header__logo--text">
				NO MAN&apos;S SK<span style={{ letterSpacing: "0.0em" }}>Y</span>
			</h1>
			<div className="flex items-center w-full gap-2 m-1 mb-2">
				<Separator size="1" orientation="horizontal" color="cyan" decorative className="flex-1" />
				<CgShapeRhombus
					className="flex-shrink-0 w-4 h-4 sm:w-4 sm:h-4"
					style={{ color: "var(--accent-track)" }}
				/>
				<Separator size="1" orientation="horizontal" color="cyan" decorative className="flex-1" />
			</div>
			<h2 className="items-center gap-1 text-xs sm:text-base header__title">
				{t("appHeader.subTitle")}&nbsp;
				<strong>AI</strong>
				<span className="mr-px font-thin"> {APP_VERSION}</span>
				<Tooltip content={t("buttons.changelog")}>
					<IconButton
						className="shadow-sm !cursor-pointer"
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

// Memoize the component as it has no props and its content is static.
const AppHeader = React.memo(AppHeaderInternal);

export default AppHeader;
