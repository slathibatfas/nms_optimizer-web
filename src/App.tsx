// src/App.tsx

import { ScrollArea } from "@radix-ui/themes";
import { type FC, lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import ReactGA from "react-ga4";
import { useTranslation } from "react-i18next";
import { Route, Routes, useLocation } from "react-router-dom";
// import { hideSplashScreen } from "vite-plugin-splash-screen/runtime";

import AppDialog from "./components/AppDialog/AppDialog";
import AppLoadingFallback from "./components/AppLoadingFallback/AppLoadingFallback";
import ErrorContent from "./components/AppDialog/ErrorContent";
import OptimizationAlertDialog from "./components/AppDialog/OptimizationAlertDialog";
import AppFooter from "./components/AppFooter/AppFooter";
import AppHeader from "./components/AppHeader/AppHeader";
import { GridTable } from "./components/GridTable/GridTable";
import GridTableButtons from "./components/GridTableButtons/GridTableButtons";
import ShipSelection from "./components/ShipSelection/ShipSelection";
import { TRACKING_ID } from "./constants"; // APP_NAME will come from i18n
import { DialogProvider } from "./context/DialogContext";
import { useDialog } from "./context/dialog-utils";
import { useAppLayout } from "./hooks/useAppLayout";
import { useOptimize } from "./hooks/useOptimize";
import { useFetchShipTypesSuspense, useShipTypesStore } from "./hooks/useShipTypes";
import { useUrlSync } from "./hooks/useUrlSync";
import { useGridStore } from "./store/GridStore";
import { useOptimizeStore } from "./store/OptimizeStore";

// --- Page Components ---
const TechTreeComponent = lazy(() => import("./components/TechTree/TechTree"));

// --- Page Content (for dialogs) ---
import AboutContent from "./components/AppDialog/AboutContent";
import ChangelogContent from "./components/AppDialog/ChangeLogContent";
import InstructionsContent from "./components/AppDialog/InstructionsContent";
import TranslationRequestContent from "./components/AppDialog/TranslationRequestContent";
import React from "react";

/**
 * Renders the main application content.
 * This component will suspend if `useFetchShipTypesSuspense` is fetching initial data.
 */
const MainAppContentInternal: FC<{
	buildVersion: string;
}> = ({ buildVersion }) => {
	const { t } = useTranslation();
	const { grid, activateRow, deActivateRow, resetGrid, setIsSharedGrid, isSharedGrid } =
		useGridStore();
	const {
		activeDialog,
		openDialog,
		closeDialog,
		isFirstVisit,
		onFirstVisitInstructionsDialogOpened,
	} = useDialog();

	const selectedShipType = useShipTypesStore((state) => state.selectedShipType);
	// Call useFetchShipTypesSuspense to ensure data is fetched/cached and to trigger Suspense.
	// The actual shipTypes data is typically consumed by child components (e.g., ShipSelection)
	// which also call this hook and benefit from the cache, or potentially via a store if it were populated there.
	useFetchShipTypesSuspense();
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
		gridTableTotalWidth, // Destructure the new total width
		resetButtonPositionStyle, // Destructure the new style
		isLarge,
	} = useAppLayout();

	const hasModulesInGrid = useMemo(() => {
		return grid && grid.cells ? grid.cells.flat().some((cell) => cell.module !== null) : false;
	}, [grid]);

	// --- Dialog Handlers ---
	// Note: showTranslationRequestDialog remains local to MainAppContent as it's not route-driven
	const [showTranslationRequestDialog, setShowTranslationRequestDialog] = useState(false);

	const DEFAULT_TECH_TREE_SCROLL_AREA_HEIGHT = "520px";

	const handleShowInstructions = useCallback(() => {
		openDialog("instructions");
		if (isFirstVisit) {
			onFirstVisitInstructionsDialogOpened();
		}
	}, [openDialog, isFirstVisit, onFirstVisitInstructionsDialogOpened]);

	const handleShowAboutPage = useCallback(() => {
		openDialog("about");
	}, [openDialog]);

	const handleShowChangelog = useCallback(() => {
		openDialog("changelog");
	}, [openDialog]);

	const handleShowTranslationRequestDialog = useCallback(() => {
		setShowTranslationRequestDialog(true);
	}, []);

	const handleCloseTranslationRequestDialog = useCallback(() => {
		setShowTranslationRequestDialog(false);
	}, []);

	// Memoize content elements for dialogs
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
			<section className="relative mx-auto border rounded-none app lg:rounded-xl bg-white/5 backdrop-blur-xl">
				<AppHeader
					onShowChangelog={handleShowChangelog}
					onShowTranslationRequestDialog={handleShowTranslationRequestDialog} // Pass the handler
				/>
				<section
					className="flex flex-col items-start p-4 pt-2 gridContainer sm:pt-4 sm:p-8 lg:flex-row"
					ref={gridContainerRef}
				>
					<div
						className="flex-grow w-auto gridContainer__container lg:flex-shrink-0"
						ref={appLayoutContainerRef}
					>
						<header
							className="flex flex-wrap items-center gap-2 mb-2 text-xl sm:mb-4 sm:text-2xl heading-styled"
							style={{ maxWidth: gridTableTotalWidth ? `${gridTableTotalWidth}px` : undefined }}
						>
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
								style={{
									textWrap: "balance",
									visibility: gridTableTotalWidth ? "visible" : "hidden",
								}}
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
							resetButtonPositionStyle={resetButtonPositionStyle} // Pass the style as a prop
							isFirstVisit={isFirstVisit}
						/>
					</div>
					{!isSharedGrid &&
						(isLarge ? (
							<ScrollArea
								className={`gridContainer__sidebar p-4 ml-4 shadow-md rounded-xl backdrop-blur-xl`}
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

			<AppFooter buildVersion={buildVersion} />

			{/* Dialogs related to MainAppContent's state */}
			<OptimizationAlertDialog
				isOpen={!!patternNoFitTech}
				technologyName={patternNoFitTech}
				onClose={clearPatternNoFitTech}
				onForceOptimize={handleForceCurrentPnfOptimize}
			/>
			{/* Dialog for "About" information */}
			<AppDialog
				isOpen={activeDialog === "about"}
				onClose={closeDialog}
				titleKey="dialogs.titles.about"
				title={t("dialogs.titles.about")}
				content={aboutDialogContent}
			/>
			{/* Dialog for "Instructions" information */}
			<AppDialog
				isOpen={activeDialog === "instructions"}
				onClose={closeDialog}
				titleKey="dialogs.titles.instructions"
				title={t("dialogs.titles.instructions")}
				content={instructionsDialogContent}
			/>
			{/* Dialog for "Changelog" information */}
			<AppDialog
				isOpen={activeDialog === "changelog"}
				onClose={closeDialog}
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

const MainAppContent = React.memo(MainAppContentInternal);

/**
 * Root application component.
 * Sets up routing, Suspense for data loading, and global dialogs.
 */
const App: FC = () => {
	const { t } = useTranslation();

	// Build version, now defined at the App level
	const build: string = (import.meta.env.VITE_BUILD_VERSION as string) ?? "devmode";
	const location = useLocation();
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

	const errorDialogContent = useMemo(() => <ErrorContent />, []);

	return (
		<>
			<DialogProvider>
				<Suspense fallback={<AppLoadingFallback />}>
					{/* <FadeIn> */}
					<MainAppContent buildVersion={build} />
					{/* </FadeIn> */}
				</Suspense>
			</DialogProvider>

			{/* Routes now render null for dialog-controlled pages */}
			<Routes>
				<Route path="/" element={null} />
				<Route path="/changelog" element={null} />
				<Route path="/instructions" element={null} />
				<Route path="/about" element={null} />
			</Routes>

			{/* Non-routed Dialogs managed by App (e.g., ErrorDialog) */}
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
