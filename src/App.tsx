// src/App.tsx

// --- React & External Libraries ---
import { Suspense, useEffect, useState, useCallback, useMemo, FC, lazy } from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom"; // Added Link
import { ScrollArea, Separator, Text } from "@radix-ui/themes";
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
import { TRACKING_ID } from "./constants"; // APP_NAME will come from i18n

// --- Hooks ---
import { useAppLayout } from "./hooks/useAppLayout";
import { useUrlSync } from "./hooks/useUrlSync";
import { useOptimize } from "./hooks/useOptimize";
import { ShipTypeDetail, useFetchShipTypesSuspense, useShipTypesStore } from "./hooks/useShipTypes";

// --- Stores ---
import { useGridStore } from "./store/GridStore";
import { useOptimizeStore } from "./store/OptimizeStore";

// --- i18n ---
import { useTranslation, Trans } from "react-i18next";

// --- Page Components ---
const ChangelogPage = lazy(() => import("./pages/ChangeLogPage"));
const InstructionsPage = lazy(() => import("./pages/InstructionsPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));

// --- Page Content ---
import InstructionsContent from "./components/AppDialog/InstructionsContent";
import AboutContent from "./components/AppDialog/AboutContent";
import ChangelogContent from "./components/AppDialog/ChangeLogContent"; // Assuming you'll create/use this for dialog
import TranslationRequestContent from "./components/AppDialog/TranslationRequestContent";

/**
 * Fallback UI shown during initial application load or when main content suspends.
 */
const AppLoadingFallback = () => {
	const { t } = useTranslation();
	return (
		<main className="flex flex-col items-center justify-center lg:min-h-screen">
			<MessageSpinner
				isVisible={true}
				isInset={true}
				initialMessage={t("loadingMessage")}
				showRandomMessages={false}
			/>
		</main>
	);
};

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
	const { t } = useTranslation();
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
		return (
			selectedShipTypeDetails?.label || t("unknownPlatform", { platformKey: selectedShipType })
		);
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

	const [showTranslationRequestDialog, setShowTranslationRequestDialog] = useState(false);
	const handleShowTranslationRequestDialog = useCallback(() => {
		setShowTranslationRequestDialog(true);
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

	const handleCloseTranslationRequestDialog = useCallback(() => {
		setShowTranslationRequestDialog(false);
	}, []);

	// Memoize content elements for dialogs to prevent unnecessary re-renders of AppDialog
	const aboutDialogContent = useMemo(() => <AboutContent />, []);
	const instructionsDialogContent = useMemo(() => <InstructionsContent />, []);
	const changelogDialogContent = useMemo(() => <ChangelogContent />, []);
	const translationRequestDialogContent = useMemo(() => <TranslationRequestContent />, []);

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
			<section className="relative mx-auto border rounded-none app lg:rounded-xl backdrop-blur-xl bg-white/5">
				<AppHeader onShowChangelog={handleShowChangelog} />
				<section
					className="flex flex-col items-start p-4 pt-2 gridContainer sm:pt-4 sm:p-8 lg:flex-row"
					ref={gridContainerRef}
				>
					<div
						className="flex-grow w-auto gridContainer__container lg:flex-shrink-0"
						ref={appLayoutContainerRef}
					>
						<header className="flex flex-wrap items-center gap-2 mb-2 text-xl sm:mb-4 sm:text-2xl heading-styled">
							{!isSharedGrid && (
								<span className="self-start flex-shrink-0 shadow-sm">
									<ShipSelection solving={solving} />
								</span>
							)}
							<span className="self-start hidden sm:inline" style={{ color: "var(--accent-11)" }}>
								{t("platformLabel")}
							</span>
							<span
								className="self-start flex-1 min-w-0 mt-[3] sm:mt-0"
								style={{ textWrap: "balance" }}
							>
								{t(`platforms.${selectedShipType}`)}
							</span>
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
						<p className="mt-4 text-sm text-center sm:text-base">
							Looking for volunteer translators! Click{" "}
							<a
								href="#"
								role="button"
								onClick={handleShowTranslationRequestDialog}
								className="underline"
								style={{ color: "var(--accent-11)" }}
							>
								here
							</a>{" "}
							for more information.
						</p>
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
							<aside className="items-start flex-grow-0 flex-shrink-0 w-full pt-8 pr-1">
								<TechTreeComponent handleOptimize={handleOptimize} solving={solving} />
							</aside>
						))}
				</section>
			</section>

			<footer className="flex flex-col items-center justify-center gap-1 p-4 text-xs text-center lg:pb-0 sm:text-sm">
				<div className="gap-1 font-light">
					<Trans
						i18nKey="footer.issuePrompt"
						components={{
							1: (
								<Link
									className="underline"
									to="https://github.com/jbelew/nms_optimizer-web/issues/new/choose"
									target="_blank"
									rel="noopener noreferrer"
								/>
							),
						}}
					>
						Something off with your solve or found a bug?{" "}
						<Link
							className="underline"
							to="https://github.com/jbelew/nms_optimizer-web/issues/new/choose"
							target="_blank"
							rel="noopener noreferrer"
						>
							Open an issue on GitHub
						</Link>{" "}
						and let us know!
					</Trans>
					<br />
					{t("footer.builtBy", { buildVersion: build })}
				</div>
				<Separator decorative />
				<div className="flex flex-wrap items-center justify-center gap-1 font-light">
					<Trans i18nKey="footer.supportPrompt" />
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
				titleKey="dialogs.titles.about"
				title={t("dialogs.titles.about")}
				content={aboutDialogContent}
			/>
			{/* Dialog for "Instructions" information */}
			<AppDialog
				isOpen={showInstructionsDialog}
				onClose={handleCloseInstructionsDialog}
				titleKey="dialogs.titles.instructions"
				title={t("dialogs.titles.instructions")}
				content={instructionsDialogContent}
			/>
			{/* Dialog for "Changelog" information */}
			<AppDialog
				isOpen={showChangelogDialog}
				onClose={handleCloseChangelogDialog}
				titleKey="dialogs.titles.changelog"
				title={t("dialogs.titles.changelog")}
				content={changelogDialogContent}
			/>
			{/* Dialog for "Translation Request" information */}
			<AppDialog
				isOpen={showTranslationRequestDialog}
				onClose={handleCloseTranslationRequestDialog}
				titleKey="dialogs.titles.translationRequest" // You'll need to add this key to your i18n files
				title={t("dialogs.titles.translationRequest")}
				content={translationRequestDialogContent}
			/>
		</main>
	);
};
/**
 * Root application component.
 * Sets up routing, Suspense for data loading, and global dialogs.
 */
const App: FC = () => {
	const { t } = useTranslation();
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
		const appName = t("appName");
		switch (location.pathname) {
			case "/":
				document.title = appName;
				break;
			case "/instructions":
				document.title = `${t("dialogs.titles.instructions")} - ${appName}`;
				break;
			case "/about":
				document.title = `${t("dialogs.titles.about")} - ${appName}`;
				break;
			case "/changelog":
				document.title = `${t("dialogs.titles.changelog")} - ${appName}`;
				break;
			default:
				document.title = appName; // Default title
		}
	}, [location.pathname, t]);

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
				titleKey="dialogs.titles.serverError"
				title={t("dialogs.titles.serverError")}
			/>
		</>
	);
};

export default App;
