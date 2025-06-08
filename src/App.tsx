// src/App.tsx

// --- React & External Libraries ---
import { Suspense, useEffect, useState, useCallback, useMemo, FC, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ScrollArea, Separator } from "@radix-ui/themes";
import { Tooltip } from "@radix-ui/themes";
import ReactGA from "react-ga4";

// --- Components ---
import Buymeacoffee from "./components/BuyMeACoffee/BuyMeACoffee";
import { GridTable } from "./components/GridTable/GridTable";
import GridTableButtons from "./components/GridTableButtons/GridTableButtons";
import TechTreeComponent from "./components/TechTree/TechTree";
import ErrorContent from "./components/AppDialog/ErrorContent";
import AppDialog from "./components/AppDialog/AppDialog";
import AppHeader from "./components/AppHeader/AppHeader";
import MessageSpinner from "./components/MessageSpinner/MessageSpinner";
import OptimizationAlertDialog from "./components/AppDialog/OptimizationAlertDialog";
import ShipSelection from "./components/ShipSelection/ShipSelection";

// --- Constants ---
import { TRACKING_ID, APP_NAME } from "./constants";

// --- Hooks ---
import { useAppLayout } from "./hooks/useAppLayout";
import { useUrlSync } from "./hooks/useUrlSync";
import { useOptimize } from "./hooks/useOptimize";
import { ShipTypeDetail, useFetchShipTypesSuspense, useShipTypesStore } from "./hooks/useShipTypes";

// --- Stores ---
import { useGridStore } from "./store/GridStore";
import { useOptimizeStore } from "./store/OptimizeStore";

// --- Page Components ---
const ChangelogPage = lazy(() => import("./pages/ChangeLogPage"));
const InstructionsPage = lazy(() => import("./pages/InstructionsPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));

// --- Page Content ---
import InstructionsContent from "./components/AppDialog/InstructionsContent";
import AboutContent from "./components/AppDialog/AboutContent";
import ChangelogContent from "./components/AppDialog/ChangeLogContent"; // Assuming you'll create/use this for dialog

/**
 * Fallback UI shown during initial application load or when main content suspends.
 */
const AppLoadingFallback = () => (
	<main className="flex flex-col items-center justify-center lg:min-h-screen">
		<MessageSpinner
			isVisible={true}
			isInset={true}
			initialMessage="Activating Uplink!"
			showRandomMessages={false}
		/>
	</main>
);

// --- Constants for UI ---
const DEFAULT_TECH_TREE_SCROLL_AREA_HEIGHT = "520px";

/**
 * Renders the main application content.
 * This component will suspend if `useFetchShipTypesSuspense` is fetching initial data.
 */
const MainAppContent: FC<{
	isFirstVisit: boolean; // Prop to indicate if it's the user's first visit session
	onFirstVisitInstructionsDialogOpened: () => void; // Callback when instructions dialog is opened for the first time
}> = ({ isFirstVisit, onFirstVisitInstructionsDialogOpened }) => {
	const { grid, activateRow, deActivateRow, resetGrid, setIsSharedGrid, isSharedGrid } =
		useGridStore();
	const selectedShipType = useShipTypesStore((state) => state.selectedShipType);
	const shipTypes = useFetchShipTypesSuspense(); // This will suspend if data is not ready
	const {
		solving,
		handleOptimize,
		gridContainerRef,
		patternNoFitTech,
		clearPatternNoFitTech,
		handleForceCurrentPnfOptimize,
	} = useOptimize();
	const { updateUrlForShare, updateUrlForReset } = useUrlSync();
	const {
		containerRef: appLayoutContainerRef,
		gridTableRef: appLayoutGridTableRef,
		gridHeight,
		columnWidth,
		isLarge,
	} = useAppLayout();

	// --- State for Modals/Dialogs ---
	const build = import.meta.env.VITE_BUILD_VERSION;
	const selectedShipTypeDetails = useMemo<ShipTypeDetail | undefined>(() => {
		return shipTypes[selectedShipType];
	}, [shipTypes, selectedShipType]);

	const selectedShipTypeLabel = useMemo<string>(() => {
		return selectedShipTypeDetails?.label || `Unknown (${selectedShipType})`;
	}, [selectedShipTypeDetails, selectedShipType]);

	const hasModulesInGrid = useMemo(() => {
		return grid && grid.cells ? grid.cells.flat().some((cell) => cell.module !== null) : false;
	}, [grid]);

	const [showInstructionsDialog, setShowInstructionsDialog] = useState(false);

	const handleShowInstructions = useCallback(() => {
		setShowInstructionsDialog(true);
		if (isFirstVisit) {
			onFirstVisitInstructionsDialogOpened(); // Notify parent (App) that instructions were shown
		}
	}, [isFirstVisit, onFirstVisitInstructionsDialogOpened]);

	const [showAboutPage, setShowAboutPage] = useState(false);
	const handleShowAboutPage = useCallback(() => {
		setShowAboutPage(true);
	}, []);

	const [showChangelogDialog, setShowChangelogDialog] = useState(false);
	const handleShowChangelog = useCallback(() => {
		setShowChangelogDialog(true);
	}, []);

	const handleCloseInstructionsDialog = useCallback(() => {
		setShowInstructionsDialog(false);
	}, []);

	const handleCloseAboutDialog = useCallback(() => {
		setShowAboutPage(false);
	}, []);

	const handleCloseChangelogDialog = useCallback(() => {
		setShowChangelogDialog(false);
	}, []);

	const handleShareClick = useCallback(() => {
		const shareUrl = updateUrlForShare();
		const newWindow = window.open(shareUrl, "_blank", "noopener,noreferrer");
		ReactGA.event({ category: "User Interactions", action: "shareLink" });
		if (newWindow) newWindow.focus();
	}, [updateUrlForShare]);

	const handleResetGrid = useCallback(() => {
		ReactGA.event({ category: "User Interactions", action: "resetGrid" });
		resetGrid();
		updateUrlForReset();
		setIsSharedGrid(false);
	}, [resetGrid, setIsSharedGrid, updateUrlForReset]);

	return (
		<main className="flex flex-col items-center justify-center lg:min-h-screen">
			<section className="relative mx-auto border rounded-none shadow-lg app lg:rounded-xl backdrop-blur-xl bg-white/5">
				<AppHeader onShowChangelog={handleShowChangelog} />
				<section
					className="flex flex-col items-start p-4 gridContainer lg:p-8 md:pt-4 sm:p-8 lg:flex-row"
					ref={gridContainerRef}
				>
					<div
						className="flex-grow w-auto gridContainer__container lg:flex-shrink-0"
						ref={appLayoutContainerRef}
					>
						<header className="flex flex-wrap items-center gap-2 mb-2 text-xl sm:mb-4 sm:text-2xl heading-styled">
							{!isSharedGrid && (
								<Tooltip content="Select Technology Platform">
									<span className="self-start flex-shrink-0 shadow-sm">
										<ShipSelection solving={solving} />
									</span>
								</Tooltip>
							)}
							<span className="self-start hidden sm:inline" style={{ color: "var(--accent-11)" }}>
								PLATFORM:
							</span>
							<span className="self-start flex-1 min-w-0">{selectedShipTypeLabel}</span>
						</header>
						<GridTable
							grid={grid}
							solving={solving}
							shared={isSharedGrid}
							activateRow={activateRow}
							deActivateRow={deActivateRow}
							ref={appLayoutGridTableRef}
							resetGrid={resetGrid}
						/>
						<GridTableButtons
							onShowInstructions={handleShowInstructions}
							onShowAbout={handleShowAboutPage}
							onShare={handleShareClick}
							onReset={handleResetGrid}
							isSharedGrid={isSharedGrid}
							hasModulesInGrid={hasModulesInGrid}
							solving={solving}
							columnWidth={columnWidth}
							isFirstVisit={isFirstVisit}
						/>
					</div>
					{!isSharedGrid &&
						(isLarge ? (
							<ScrollArea
								className={`gridContainer__sidebar p-4 ml-6 shadow-md rounded-xl backdrop-blur-xl`}
								style={{
									height: gridHeight ? `${gridHeight}px` : DEFAULT_TECH_TREE_SCROLL_AREA_HEIGHT,
								}}
							>
								<TechTreeComponent handleOptimize={handleOptimize} solving={solving} />
							</ScrollArea>
						) : (
							<aside className="items-start flex-grow-0 flex-shrink-0 w-full pt-8">
								<TechTreeComponent handleOptimize={handleOptimize} solving={solving} />
							</aside>
						))}
				</section>
			</section>

			<footer className="flex flex-col items-center justify-center gap-1 p-4 text-xs text-center lg:pb-0 sm:text-sm lg:text-base">
				<div className="gap-1 font-light">
					Something off with your solve or found a bug?{" "}
					<a
						href="https://github.com/jbelew/nms_optimizer-web/issues/new/choose"
						className="underline"
						target="_blank"
					>
						Open an issue on GitHub
					</a>{" "}
					and let us know!
					<br />
					Built by jbelew (void23 | QQ9Y-EJRS-P8KGW) • {build}
				</div>
				<Separator decorative />
				<div className="flex flex-wrap items-center justify-center gap-1 font-light">
					If you found this application useful, consider supporting its development with
					<Buymeacoffee />
				</div>
			</footer>

			{/* Dialogs related to MainAppContent's state */}
			<OptimizationAlertDialog
				isOpen={!!patternNoFitTech}
				technologyName={patternNoFitTech}
				onClose={clearPatternNoFitTech}
				onForceOptimize={handleForceCurrentPnfOptimize}
			/>
			{/* Dialog for "About" information */}
			<AppDialog
				isOpen={showAboutPage}
				onClose={handleCloseAboutDialog}
				title="About"
				content={<AboutContent />}
			/>
			{/* Dialog for "Instructions" information */}
			<AppDialog
				isOpen={showInstructionsDialog}
				onClose={handleCloseInstructionsDialog}
				title="Instructions"
				content={<InstructionsContent />}
			/>
			{/* Dialog for "Changelog" information */}
			<AppDialog
				isOpen={showChangelogDialog}
				onClose={handleCloseChangelogDialog}
				title="Changelog"
				content={<ChangelogContent />}
			/>
		</main>
	);
};
/**
 * Root application component.
 * Sets up routing, Suspense for data loading, and global dialogs.
 */
const App: FC = () => {
	const location = useLocation();
	const [isFirstVisit, setIsFirstVisit] = useState(
		() => !localStorage.getItem("hasVisitedNMSOptimizer")
	);
	const { showError, setShowError } = useOptimizeStore();

	useEffect(() => {
		ReactGA.initialize(TRACKING_ID);
		// This effect runs once on App mount for GA initialization.
	}, []);

	useEffect(() => {
		// Set document title based on the current path
		switch (location.pathname) {
			case "/":
				document.title = APP_NAME;
				break;
			case "/instructions":
				document.title = `Instructions - ${APP_NAME}`;
				break;
			case "/about":
				document.title = `About - ${APP_NAME}`;
				break;
			case "/changelog":
				document.title = `Changelog - ${APP_NAME}`;
				break;
			default:
				document.title = APP_NAME; // Default title
		}
	}, [location.pathname]);

	const handleFirstVisitInstructionsOpened = useCallback(() => {
		if (isFirstVisit) {
			setIsFirstVisit(false);
			localStorage.setItem("hasVisitedNMSOptimizer", "true");
		}
	}, [isFirstVisit]); // setIsFirstVisit is stable, so not strictly needed if only isFirstVisit changes

	const errorDialogContent = useMemo(() => <ErrorContent />, []);

	return (
		<>
			<Suspense fallback={<AppLoadingFallback />}>
				<MainAppContent
					isFirstVisit={isFirstVisit}
					onFirstVisitInstructionsDialogOpened={handleFirstVisitInstructionsOpened}
				/>
			</Suspense>

			{/* Routed Dialogs/Pages */}
			<Routes>
				<Route path="/" element={null} /> {/* Main content is rendered by MainAppContent above */}
				<Route path="/changelog" element={<ChangelogPage />} />
				<Route path="/instructions" element={<InstructionsPage />} />
				<Route path="/about" element={<AboutPage />} />
			</Routes>

			{/* Non-routed Dialogs managed by App */}
			<AppDialog
				isOpen={showError}
				onClose={() => setShowError(false)}
				content={errorDialogContent}
				title="Server Error!"
			/>
		</>
	);
};

export default App;
