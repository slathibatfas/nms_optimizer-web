// src/components/AppHeader/AppHeader.tsx
import React from "react";
import { IconButton, Separator, Tooltip } from "@radix-ui/themes";
import { CounterClockwiseClockIcon } from "@radix-ui/react-icons";
import { CgShapeRhombus } from "react-icons/cg";
import { APP_VERSION } from "../../constants";
import { useBreakpoint } from "../../hooks/useBreakpoint"; // Import the hook
import ReactGA from "react-ga4";

interface AppHeaderProps {
	onShowChangelog: () => void;
}

const AppHeaderInternal: React.FC<AppHeaderProps> = ({ onShowChangelog }) => {
	// Use breakpoint for 'sm' (640px) as per Tailwind's default
	const isSmallAndUp = useBreakpoint("640px");

	return (
		<header className="flex flex-col items-center p-4 sm:px-8 sm:pt-6 sm:pb-4 header">
			<div className="text-3xl sm:text-4xl header__logo--text">
				NO MAN'S SK<span style={{ letterSpacing: "0.0em" }}>Y</span>
			</div>
			<div className="flex items-center w-full gap-2 m-1 mb-2">
				<Separator size="1" orientation="horizontal" color="cyan" decorative className="flex-1" />
				<CgShapeRhombus
					className="flex-shrink-0 w-4 h-4 sm:w-6 sm:h-6"
					style={{ color: "var(--accent-track)" }}
				/>
				<Separator size="1" orientation="horizontal" color="cyan" decorative className="flex-1" />
			</div>
			<h2 className="flex items-center gap-1 text-xs sm:text-base header__title">
				Technology Layout Optimizer<strong>AI</strong>
				<span className="mr-px font-thin"> {APP_VERSION}</span>
				<Tooltip content="Changelog">
					<IconButton
						className="shadow-sm !cursor-pointer"
						variant="ghost"
						radius="full"
						size="1"
						aria-label="Changelog"
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
