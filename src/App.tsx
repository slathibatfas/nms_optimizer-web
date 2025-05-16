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
import ChangelogPage from "./pages/ChangeLogPage";
import InstructionsPage from "./pages/InstructionsPage";
import AboutPage from "./pages/AboutPage";

/**
 * Suspense fallback for initial app load.
 */
const AppLoadingFallback = () => (
  <main className="flex flex-col items-center justify-center lg:min-h-screen">
    <MessageSpinner isVisible={true} isInset={true} initialMessage="Activating interface!" showRandomMessages={false} />
  </main>
);

/**
 * Renders the primary application UI, including data-dependent components.
 * Suspends if initial data (e.g., ship types) is not yet available.
 */
const MainAppContent: FC<{
  isFirstVisit: boolean;
}> = ({ isFirstVisit }) => {
  const navigate = useNavigate();

  // --- Store Hooks ---
  const { grid, activateRow, deActivateRow, resetGrid, setIsSharedGrid, isSharedGrid } = useGridStore();
  const selectedShipType = useShipTypesStore((state) => state.selectedShipType);

  // --- Custom Hooks & Data Fetching ---
  const shipTypes = useFetchShipTypesSuspense(); // This will suspend if data is not ready
  const { solving, handleOptimize, gridContainerRef, patternNoFitTech, clearPatternNoFitTech, handleForceCurrentPnfOptimize } = useOptimize();
  const { updateUrlForShare, updateUrlForReset } = useUrlSync();
  const { containerRef: appLayoutContainerRef, gridTableRef: appLayoutGridTableRef, gridHeight, columnWidth, isLarge } = useAppLayout();

  // --- Environment Variables ---
  const build = import.meta.env.VITE_BUILD_VERSION;

  // --- Memoized Derived Values ---
  const selectedShipTypeDetails = useMemo<ShipTypeDetail | undefined>(() => {
    return shipTypes[selectedShipType];
  }, [shipTypes, selectedShipType]);

  const selectedShipTypeLabel = useMemo<string>(() => {
    return selectedShipTypeDetails?.label || `Unknown (${selectedShipType})`;
  }, [selectedShipTypeDetails, selectedShipType]);

  const hasModulesInGrid = useMemo(() => {
    return grid && grid.cells ? grid.cells.flat().some((cell) => cell.module !== null) : false;
  }, [grid]);

  // --- Callback Hooks ---
  useEffect(() => {
    if (!localStorage.getItem("hasVisitedNMSOptimizer")) {
      localStorage.setItem("hasVisitedNMSOptimizer", "true");
    }
  }, []);

  const handleShowInstructions = useCallback(() => {
    navigate("/instructions");
  }, [navigate]);

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
    <>
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

      {/* Dialogs related to MainAppContent's state */}
      <OptimizationAlertDialog
        isOpen={!!patternNoFitTech}
        technologyName={patternNoFitTech}
        onClose={clearPatternNoFitTech}
        onForceOptimize={handleForceCurrentPnfOptimize}
      />
    </>
  );
};

/**
 * Top-level application component. Manages global layout, routing,
 * Suspense for initial content, and global dialogs.
 */
const App: FC = () => {
  const location = useLocation();
  const [isFirstVisit, setIsFirstVisit] = useState(() => !localStorage.getItem("hasVisitedNMSOptimizer"));
  const { showError, setShowError } = useOptimizeStore(); // For the global ErrorDialog

  useEffect(() => {
    ReactGA.initialize(TRACKING_ID);
    // This effect runs once on App mount for GA initialization.
  }, []);

  useEffect(() => {
    if (location.pathname === "/") {
      document.title = APP_NAME;
    }
  }, [location.pathname]);

  const handleFirstVisitInstructionsOpened = useCallback(() => {
    if (isFirstVisit) {
      setIsFirstVisit(false);
    }
  }, [isFirstVisit, setIsFirstVisit]);

  const errorDialogContent = useMemo(() => <ErrorContent />, []);

  return (
    <>
      <Suspense fallback={<AppLoadingFallback />}>
        <MainAppContent isFirstVisit={isFirstVisit} />
      </Suspense>

      {/* Routed Dialogs/Pages */}
      <Routes>
        <Route path="/" element={null} /> {/* Main content is handled by MainAppContent */}
        <Route path="/changelog" element={<ChangelogPage />} />
        <Route path="/instructions" element={<InstructionsPage onOpen={handleFirstVisitInstructionsOpened} />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>

      {/* Non-routed Dialogs managed by App */}
      <InfoDialog isOpen={showError} onClose={() => setShowError(false)} content={errorDialogContent} title="Error!" />
    </>
  );
};

export default App;
