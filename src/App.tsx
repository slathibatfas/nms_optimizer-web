// src/App.tsx

// --- React & External Libraries ---
import { Suspense, useEffect, useState, useCallback } from "react";
import { Tooltip, ScrollArea } from "@radix-ui/themes";
import ReactGA from "react-ga4";

// --- Components ---
import Buymeacoffee from "./components/BuyMeACoffee/BuyMeACoffee";
import GridTable from "./components/GridTable/GridTable";
import GridTableButtons from "./components/GridTableButtons/GridTableButtons";
import TechTreeComponent from "./components/TechTree/TechTree";
import ChangeLogContent from "./components/AppDialog/ChangeLogContent";
import ErrorContent from "./components/AppDialog/ErrorContent";
import InfoDialog from "./components/AppDialog/AppDialog";
import AppHeader from "./components/AppHeader/AppHeader"; // Import the new header
import InstructionsContent from "./components/AppDialog/InstructionsContent";
import MessageSpinner from "./components/MessageSpinner/MessageSpinner";
import ShipSelection from "./components/ShipSelection/ShipSelection";

// --- Constants ---
import { API_URL, TRACKING_ID } from "./constants";

// --- Hooks ---
import { useAppLayout } from "./hooks/useAppLayout";
import { useUrlSync } from "./hooks/useUrlSync";
import { useOptimize } from "./hooks/useOptimize";
import { ShipTypeDetail, useFetchShipTypesSuspense, useShipTypesStore } from "./hooks/useShipTypes";

// --- Stores ---
import { useGridStore } from "./store/GridStore";
import { useOptimizeStore } from "./store/OptimizeStore";

/**
 * Defines the possible types of dialogs that can be active.
 */
type ActiveDialog = "changelog" | "instructions" | "error" | null;

/**
 * The main App component.
 *
 * This component contains the main layout of the app, including the header,
 * main layout, and footer. It also contains three dialogs: the instructions
 * dialog, the change log dialog, and the error dialog.
 */
const App: React.FC = () => {
  // State to control the visibility of dialogs
  const [activeDialog, setActiveDialog] = useState<ActiveDialog>(null);
  // Initialize state directly from localStorage to avoid flicker.
  // The function ensures localStorage is read only once on mount.
  // Need the setter function to turn off the glow on click.
  const [isFirstVisit, setIsFirstVisit] = useState(() => !localStorage.getItem('hasVisitedNMSOptimizer'));

  const { grid, activateRow, deActivateRow, resetGrid, setIsSharedGrid, isSharedGrid } = useGridStore();
  const selectedShipType = useShipTypesStore((state) => state.selectedShipType);

  const { solving, handleOptimize, gridContainerRef } = useOptimize();
  useUrlSync(); // Initialize URL synchronization

  // Retrieve error state from the optimize store
  const { showError, setShowError } = useOptimizeStore();

  // Retrieve build version from environment variables
  const build = import.meta.env.VITE_BUILD_VERSION;

  // Fetch ship types data using the suspense hook
  // This will suspend rendering until the data is loaded
  const shipTypes = useFetchShipTypesSuspense();

  // Derive details and label *after* shipTypes data is available
  const selectedShipTypeDetails: ShipTypeDetail | undefined = shipTypes ? shipTypes[selectedShipType] : undefined;
  const selectedShipTypeLabel = selectedShipTypeDetails?.label || `Unknown (${selectedShipType})`;

  // --- Use the custom layout hook ---
  const { gridRef, gridHeight, columnWidth, isLarge } = useAppLayout();

  // --- Get URL update functions from the sync hook ---
  const { updateUrlForShare, updateUrlForReset } = useUrlSync();

  // Whether there are any modules in the grid
  const hasModulesInGrid = grid.cells.flat().some((cell) => cell.module !== null);

  useEffect(() => {
    ReactGA.initialize(TRACKING_ID);
    console.log("API_URL:", API_URL);

    // If it was determined to be the first visit during initialization,
    // set the flag in localStorage now so subsequent loads/refreshes know.
    if (isFirstVisit) {
      localStorage.setItem('hasVisitedNMSOptimizer', 'true');
    }
  }, []);

  // Effect to sync the error state from the store with the local activeDialog state
  useEffect(() => {
    if (showError) {
      setActiveDialog("error");
    }
  }, [showError]);

  /**
   * Closes any active dialog and resets the error state in the store if it was an error dialog.
   */
  const handleCloseDialog = useCallback(() => {
    if (activeDialog === "error") {
      setShowError(false); // Reset error state in the store
    }
    setActiveDialog(null); // Close any dialog
  }, [activeDialog, setShowError]);

  /**
   * Handles showing the instructions dialog and turns off the first visit glow if active.
   */
  const handleShowInstructions = useCallback(() => {
    setActiveDialog("instructions");
    if (isFirstVisit) {
      setIsFirstVisit(false); // Turn off the glow
    }
    // localStorage is already set in the initial useEffect, no need to set it again here.
  }, [isFirstVisit, setIsFirstVisit]); // Add setIsFirstVisit dependency

  /**
   * Handles the click event of the share button.
   */
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
    resetGrid(); // Call the original resetGrid function
    updateUrlForReset(); // Update the URL using the hook's function
    setIsSharedGrid(false);
  }, [resetGrid, setIsSharedGrid, updateUrlForReset]); // Depend on the hook's function

  // Removed the useEffect for popstate handling as it's now in useUrlSync

  // Define a simple loading component or use MessageSpinner
  const AppLoadingFallback = () => (
    <div className="flex flex-col items-center justify-center messageSpinner__spinner" style={{ color: "var(--red-a10)" }}>
      <MessageSpinner isVisible={true} initialMessage="Waking the server!" showRandomMessages={false} />
    </div>
  );

  return (
    <>
      <Suspense fallback={<AppLoadingFallback />}>
        {/* The main container of the app */}
        <main className="flex flex-col items-center justify-center lg:min-h-screen">
          {/* Container Box */}
          <section className="relative mx-auto border rounded-none shadow-lg app lg:rounded-xl lg:shadow-xl backdrop-blur-xl bg-white/5">
            <AppHeader />

            {/* Main Layout */}
            <section className="p-6 pt-4 lg:p-8 md:p-8 md:pt-4 gridContainer" ref={gridContainerRef}>
              <div className="flex flex-col items-start gridContainer__layout lg:flex-row">
                <div className="flex-grow w-auto gridContainer__grid lg:flex-shrink-0" ref={gridRef}>
                  <header className="flex flex-wrap items-center gap-2 mb-4 text-xl font-semibold uppercase sm:text-2xl sidebar__title">
                    {/* Show ShipSelection only if not a shared grid */}
                    {!isSharedGrid && (
                      <Tooltip content="Select Technology Platform" delayDuration={500}>
                        <span className="flex-shrink-0">
                          {/* ShipSelection uses the same fetched shipTypes, no extra Suspense needed here */}
                          <ShipSelection solving={solving} />
                        </span>
                      </Tooltip>
                    )}
                    {/* Platform Label */}
                    <span className="hidden sm:inline" style={{ color: "var(--accent-11)" }}>
                      PLATFORM:
                    </span>
                    {/* Display the derived label (now correctly loaded) */}
                    <span className="flex-1 min-w-0">{selectedShipTypeLabel}</span>
                  </header>

                  <GridTable
                    grid={grid}
                    solving={solving}
                    shared={isSharedGrid}
                    activateRow={activateRow}
                    deActivateRow={deActivateRow}
                    resetGrid={resetGrid}
                  />

                  <GridTableButtons
                    onShowInstructions={handleShowInstructions} // Use the new handler
                    onShowChangeLog={() => setActiveDialog("changelog")}
                    onShare={handleShareClick}
                    onReset={handleResetGrid}
                    isSharedGrid={isSharedGrid}
                    hasModulesInGrid={hasModulesInGrid}
                    solving={solving}
                    columnWidth={columnWidth}
                    isFirstVisit={isFirstVisit} // Pass down the first visit state
                  />
                </div>

                {/* Tech Tree Section (Conditionally Rendered) */}
                {!isSharedGrid &&
                  (isLarge ? (
                    // Desktop: Scrollable sidebar
                    <ScrollArea
                      className={`gridContainer__sidebar p-4 ml-4 border shadow-md rounded-xl backdrop-blur-xl`}
                      style={{ height: gridHeight ? `${gridHeight}px` : "528px" }}
                    >
                      <TechTreeComponent handleOptimize={handleOptimize} solving={solving} />
                    </ScrollArea>
                  ) : (
                    // Mobile: Tech Tree below GridTable
                    <aside className="items-start flex-grow-0 flex-shrink-0 w-full pt-8">
                      <TechTreeComponent handleOptimize={handleOptimize} solving={solving} />
                    </aside>
                  ))}
              </div>
            </section>
          </section>

          {/* Footer Text */}
          <footer className="flex flex-wrap items-center justify-center gap-2 pt-4 pb-4 text-xs text-center lg:pb-0 sm:text-sm lg:text-base">
            Built by jbelew (NMS: void23 | QQ9Y-EJRS-P8KGW) / <a href="https://github.com/jbelew/nms_optimizer-web" className="underline" target="_blank" rel="noopener noreferrer">GitHub</a> / <a href="https://discord.com/invite/JM4WyNfH" className="underline" target="_blank" rel="noopener noreferrer">Discord</a> / {build} / <Buymeacoffee />
          </footer>
        </main>
      </Suspense>

      {/* Info Dialogs */}
      <InfoDialog isOpen={activeDialog === "changelog"} onClose={handleCloseDialog} content={<ChangeLogContent />} title="Changelog" />
      <InfoDialog isOpen={activeDialog === "instructions"} onClose={handleCloseDialog} content={<InstructionsContent />} title="Instructions" />
      <InfoDialog isOpen={activeDialog === "error"} onClose={handleCloseDialog} content={<ErrorContent />} title="Error!" />
    </>
  );
};
export default App;
