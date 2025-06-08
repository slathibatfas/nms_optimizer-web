// src/components/AppHeader/AppHeader.tsx
import React from "react";
import NMSIcon from "../../assets/img/nms_icon.webp";
import NMSShip from "../../assets/img/resized_ship.webp";
import { IconButton, Tooltip } from "@radix-ui/themes";
import { CounterClockwiseClockIcon } from "@radix-ui/react-icons";
import { APP_VERSION } from "../../constants";
import { useBreakpoint } from "../../hooks/useBreakpoint"; // Import the hook
import ReactGA from "react-ga4";

interface AppHeaderInternalProps {
	onShowChangelog: () => void;
}

const AppHeaderInternal: React.FC<AppHeaderInternalProps> = ({ onShowChangelog }) => {
	// Use breakpoint for 'sm' (640px) as per Tailwind's default
	const isSmallAndUp = useBreakpoint("640px");

	return (
		<header className="flex flex-col pt-3 pb-1 pl-6 lg:rounded-t-xl sm:pr-8 header sm:pb-4 sm:pt-6 backdrop-blur-xl">
			<div className="flex items-center w-full">
				<img
					src={NMSIcon}
					className="mr-2 h-[56] w-[32] sm:mr-4 header__icon sm:h-[88] sm:w-[50]"
					alt="No Man's Sky Icon"
				/>
				<div>
					<img
						loading="eager"
						src="/assets/svg/nms_logo.svg"
						className="h-[20] w-[234] mb-1 sm:mb-2 sm:h-[32] sm:w-[374] header__logo"
						alt="No Man's Sky Logo"
					/>
					<h2 className="text-base sm:text-2xl header__title">
						Technology Layout Optimizer <strong>AI</strong>{" "}
						<span className="mr-2 font-thin">{APP_VERSION}</span>
						<div className="hidden sm:inline">
							<Tooltip content="Changelog">
								<IconButton
									className="shadow-sm"
									variant="soft"
									size={isSmallAndUp ? "2" : "1"} // Use the hook for dynamic sizing
									aria-label="Changelog"
									onClick={() => {
										ReactGA.event({
											category: "User Interactions",
											action: "showChangelog",
										});
										onShowChangelog();
									}}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											ReactGA.event({
												category: "User Interactions",
												action: "showChangelog",
											});
											onShowChangelog();
										}
									}}
								>
									<CounterClockwiseClockIcon className="w-4 h-4 sm:w-5 sm:h-5" />
								</IconButton>
							</Tooltip>
						</div>
					</h2>
				</div>
				<div className="flex items-end ml-auto">
					{" "}
					<img
						src={NMSShip}
						className="hidden opacity-25 md:h-[56] md:w-[180] lg:w-[254] lg:h-[72] md:inline fade-horizontal"
						alt="Starship Image"
					/>
				</div>
			</div>
		</header>
	);
};

// Memoize the component as it has no props and its content is static.
const AppHeader = React.memo(AppHeaderInternal);

export default AppHeader;
