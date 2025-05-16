// src/App.tsx

// --- React & External Libraries ---
import { Suspense, useEffect, useState, useCallback, useMemo, FC } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { ScrollArea } from "@radix-ui/themes";
import ReactGA from "react-ga4";

// --- Components ---
import Buymeacoffee from "./components/BuyMeACoffee/BuyMeACoffee";
import { GridTable } from "./components/GridTable/GridTable";
import GridTableButtons from "./components/GridTableButtons/GridTableButtons";
import TechTreeComponent from "./components/TechTree/TechTree";
import ErrorContent from "./components/AppDialog/ErrorContent";
import InfoDialog from "./components/AppDialog/AppDialog"; // Still used for ErrorDialog
import AppHeader from "./components/AppHeader/AppHeader";
import MessageSpinner from "./components/MessageSpinner/MessageSpinner";
import OptimizationAlertDialog from "./components/AppDialog/OptimizationAlertDialog";
import ShipSelection from "./components/ShipSelection/ShipSelection";

// --- Constants ---
import { API_URL, TRACKING_ID, APP_NAME } from "./constants";

// --- Hooks ---
import { useAppLayout } from "./hooks/useAppLayout";
import { useUrlSync } from "./hooks/useUrlSync";
import { useOptimize } from "./hooks/useOptimize";
import { ShipTypeDetail, useFetchShipTypesSuspense, useShipTypesStore } from "./hooks/useShipTypes";

// --- Stores ---
import { useGridStore } from "./store/GridStore";
import { useOptimizeStore } from "./store/OptimizeStore";

// --- Page Components ---
import ChangelogPage from "./pages/ChangeLogPage";
import InstructionsPage from "./pages/InstructionsPage";
import AboutPage from "./pages/AboutPage";

/**
 * Loading fallback component for Suspense.
 * Defined outside App to prevent re-definition on App's re-render.
 */
const AppLoadingFallback = () => (
  <div className="flex flex-col items-center justify-center messageSpinner__spinner" style={{ color: "var(--red-a10)" }}>
    <MessageSpinner isVisible={true} initialMessage="Waking the server!" showRandomMessages={false} />
  </div>
);
/**
 * The main App component.
 *
 * This component contains the main layout of the app, including the header,
 * main layout, and footer. It also contains three dialogs: the instructions
 * dialog, the change log dialog, and the error dialog.
 */
const App: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // --- State Hooks ---
  // Initialize state directly from localStorage to avoid flicker.
  // Need the setter function to turn off the glow on click.
  const [isFirstVisit, setIsFirstVisit] = useState(() => !localStorage.getItem("hasVisitedNMSOptimizer"));

  // --- Store Hooks ---
  const { grid, activateRow, deActivateRow, resetGrid, setIsSharedGrid, isSharedGrid } = useGridStore();
  const selectedShipType = useShipTypesStore((state) => state.selectedShipType);
  const { showError, setShowError } = useOptimizeStore();

  // --- Custom Hooks & Data Fetching ---
  // Fetch ship types data using the suspense hook. This will suspend rendering until the data is loaded.
  const shipTypes = useFetchShipTypesSuspense();
  const { solving, handleOptimize, gridContainerRef, patternNoFitTech, clearPatternNoFitTech, handleForceCurrentPnfOptimize } = useOptimize();
  // Call useUrlSync once and destructure its return values
  const { updateUrlForShare, updateUrlForReset } = useUrlSync();
  // containerRef is for div.gridContainer__container (for height)
  // gridTableRef is for GridTable element (for columnWidth)
  const { containerRef: appLayoutContainerRef, gridTableRef: appLayoutGridTableRef, gridHeight, columnWidth, isLarge } = useAppLayout();

  // --- Environment Variables ---
  const build = import.meta.env.VITE_BUILD_VERSION;

  // --- Memoized Derived Values ---
  const selectedShipTypeDetails = useMemo<ShipTypeDetail | undefined>(() => {
    // shipTypes is guaranteed by Suspense to be populated here.
    return shipTypes[selectedShipType];
  }, [shipTypes, selectedShipType]);
  const selectedShipTypeLabel = useMemo<string>(() => {
    return selectedShipTypeDetails?.label || `Unknown (${selectedShipType})`;
  }, [selectedShipTypeDetails, selectedShipType]);
  // Memoize hasModulesInGrid calculation as it depends on `grid` which might be large.
  const hasModulesInGrid = useMemo(() => {
    return grid && grid.cells ? grid.cells.flat().some((cell) => cell.module !== null) : false;
  }, [grid]);

  // --- Callback Hooks ---
  /**
   * Closes any active dialog and resets the error state in the store if it was an error dialog.
   */
  useEffect(() => {
    ReactGA.initialize(TRACKING_ID);
    console.log("API_URL:", API_URL);

    // Set localStorage item only once on initial mount if it hasn't been set.
    // The `isFirstVisit` state is used for UI purposes (e.g., glow effect).
    if (!localStorage.getItem("hasVisitedNMSOptimizer")) {
      localStorage.setItem("hasVisitedNMSOptimizer", "true");
    }
    // Empty dependency array ensures this effect runs only once on mount.
  }, []);

  useEffect(() => {
    // Set title for the main page when no specific page route is active
    if (location.pathname === "/") {
      document.title = APP_NAME;
    }
  }, [location.pathname]);

  /**
   * Handles showing the instructions dialog and turns off the first visit glow if active.
   */
  const handleShowInstructions = useCallback(() => {
    navigate("/instructions");
    // The isFirstVisit logic will be handled by the InstructionsPage via onOpen prop
  }, [navigate]);

  /**
   * Callback for when the instructions page is opened, to turn off the first visit glow.
   */
  const handleFirstVisitInstructionsOpened = useCallback(() => {
    if (isFirstVisit) {
      setIsFirstVisit(false);
    }
  }, [isFirstVisit, setIsFirstVisit]);

  const handleShareClick = useCallback(() => {
    const shareUrl = updateUrlForShare();
    const newWindow = window.open(shareUrl, "_blank", "noopener,noreferrer");

    ReactGA.event({
      category: "User Interactions",
      action: "shareLink",
    });

    if (newWindow) {
      newWindow.focus();
    }
  }, [updateUrlForShare]);

  /**
   * Handles the click event of the reset button.
   */
  const handleResetGrid = useCallback(() => {
    ReactGA.event({
      category: "User Interactions",
      action: "resetGrid",
    });
    resetGrid();
    updateUrlForReset();
    setIsSharedGrid(false);
  }, [resetGrid, setIsSharedGrid, updateUrlForReset]);

  // --- Memoized Component Instances for Dialog Content ---
  const errorDialogContent = useMemo(() => <ErrorContent />, []);

  return (
    <>
      <Suspense fallback={<AppLoadingFallback />}>
        <main className="flex flex-col items-center justify-center lg:min-h-screen">
          <section className="relative mx-auto border rounded-none shadow-lg app lg:rounded-xl lg:shadow-xl backdrop-blur-xl bg-white/5">
            <AppHeader />

            <section className="flex flex-col items-start p-6 pt-4 gridContainer lg:p-8 md:p-8 md:pt-4 lg:flex-row" ref={gridContainerRef}>
              <div className="flex-grow w-auto gridContainer__container lg:flex-shrink-0" ref={appLayoutContainerRef}>
                <header className="flex flex-wrap items-center gap-2 mb-4 text-xl font-semibold uppercase sm:text-2xl sidebar__title">
                  {!isSharedGrid && (
                    <span className="flex-shrink-0">
                      <ShipSelection solving={solving} />
                    </span>
                  )}
                  <span className="hidden sm:inline" style={{ color: "var(--accent-11)" }}>
                    PLATFORM:
                  </span>
                  <span className="flex-1 min-w-0">{selectedShipTypeLabel}</span>
                </header>

                <GridTable
                  grid={grid} // TODO: GridTable should ideally handle a potentially null grid if the store can produce it.
                  solving={solving}
                  shared={isSharedGrid}
                  activateRow={activateRow}
                  deActivateRow={deActivateRow}
                  ref={appLayoutGridTableRef}
                  resetGrid={resetGrid}
                />

                <GridTableButtons
                  onShowInstructions={handleShowInstructions}
                  // onShowChangeLog is removed; Link will be used in GridTableButtons
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
                    className={`gridContainer__sidebar p-4 ml-6 border shadow-md rounded-xl backdrop-blur-xl`}
                    style={{ height: gridHeight ? `${gridHeight}px` : "528px" }}
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

          <footer className="flex flex-wrap items-center justify-center gap-1 pt-4 pb-4 text-xs text-center lg:pb-0 sm:text-sm lg:text-base">
            Built by jbelew (NMS: void23 / QQ9Y-EJRS-P8KGW) •{" "}
            <a href="https://github.com/jbelew/nms_optimizer-web" className="underline" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            •
            <a href="https://discord.com/invite/JM4WyNfH" className="underline" target="_blank" rel="noopener noreferrer">
              Discord
            </a>{" "}
            • {build} • <Buymeacoffee />
          </footer>
        </main>
      </Suspense>

      {/* Routed Dialogs/Pages */}
      <Routes>
        {/* Add a route for the root path to satisfy this Routes block and prevent the warning. 
            It renders nothing as App.tsx handles the main content for the root path. */}
        <Route path="/" element={null} />
        <Route path="/changelog" element={<ChangelogPage />} />
        <Route path="/instructions" element={<InstructionsPage onOpen={handleFirstVisitInstructionsOpened} />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>

      {/* Non-routed Dialogs */}
      <InfoDialog
        isOpen={showError} // This remains as is
        onClose={() => setShowError(false)}
        content={errorDialogContent}
        title="Error!"
      />

      <OptimizationAlertDialog
        isOpen={!!patternNoFitTech}
        technologyName={patternNoFitTech}
        onClose={clearPatternNoFitTech}
        onForceOptimize={handleForceCurrentPnfOptimize}
      />
    </>
  );
};
export default App;
