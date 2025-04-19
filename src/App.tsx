// src/App.tsx
import GridContainer from "./components/GridContainer/GridContainer";
import { useState, useEffect, Suspense } from "react";
import InfoDialog from "./components/InfoDialog/InfoDialog";
import ChangeLogContent from "./components/InfoDialog/ChangeLogContent";
import InstructionsContent from "./components/InfoDialog/InstructionsContent";
import ErrorContent from "./components/InfoDialog/ErrorContent";
import NMSLogo from "./assets/svg/nms_logo.svg";
import NMSIcon from "./assets/img/nms_icon2.webp";
import { useOptimizeStore } from "./store/OptimizeStore";
import ErrorBoundary from "./components/ErrorBoundry/ErrorBoundry";
import ReactGA from "react-ga4";
import Buymeacoffee from "./components/BuyMeACoffee/BuyMeACoffee";
import MessageSpinner from "./components/MessageSpinner/MessageSpinner"; // Import your spinner

/**
 * The main App component.
 *
 * This component contains the main layout of the app, including the header,
 * main layout, and footer. It also contains three dialogs: the instructions
 * dialog, the change log dialog, and the error dialog.
 *
 * @returns {ReactElement} The App component.
 */
const App: React.FC = () => {
  // State to control the visibility of dialogs
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [showInstructionsDialog, setShowInstructionsDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState<boolean>(false);
  const TRACKING_ID = "G-P5VBZQ69Q9"; // your Measurement ID

  // Retrieve error state from the optimize store
  const { showError, setShowError } = useOptimizeStore();

  // Retrieve build version from environment variables
  const build = import.meta.env.VITE_BUILD_VERSION;

  useEffect(() => {
    ReactGA.initialize(TRACKING_ID);
  }, []);

  // Effect to open the error dialog when an error occurs
  useEffect(() => {
    if (showError) {
      setShowErrorDialog(true);
    }
  }, [showError]);

  /**
   * Handler function to close the error dialog
   */
  const handleCloseErrorDialog = () => {
    setShowError(false);
    setShowErrorDialog(false);
  };

  // Define a simple loading component or use MessageSpinner
  const AppLoadingFallback = () => (
    <div className="flex flex-col items-center justify-center messageSpinner__spinner--big" style={{ color: "var(--red-a10)" }}>
      <MessageSpinner isVisible={true} initialMessage="" showRandomMessages={true} />
    </div>
  );

  return (
    <>
      <Suspense fallback={<AppLoadingFallback />}>
        {/* The main container of the app */}
        <div className="flex flex-col items-center justify-center lg:min-h-screen">
          {/* Container Box */}
          <div className="relative mx-auto overflow-hidden border rounded-none shadow-lg border-white/5 lg:rounded-xl lg:shadow-xl backdrop-blur-xl bg-white/5">
            {/* Header */}
            <div className="pt-3 pb-2 pl-6 sm:pl-8 sm:pb-6 sm:pt-8 bg-black/25" style={{ borderColor: "var(--gray-a1)" }}>
              <div className="flex items-center">
                <img src={NMSIcon} className="mr-4 h-14 sm:h-20 optimizer__header--icon" alt="No Man's Sky Logo" />
                <div>
                  <img src={NMSLogo} className="h-5 mb-1 sm:mb-2 sm:h-9 optimizer__header--logo" alt="No Man's Sky Logo" />
                  <span className="font-thin sm:font-normal sm:text-2xl optimizer__header--title">
                    <span className="font-extrabold" style={{ color: "var(--accent-11)" }}>
                      Neural{" "}
                    </span>
                    Technology Optimizer <span className="font-thin">v2.0</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Main Layout */}
            <div className="flex flex-col lg:flex-row">
              {/* GridContainer wrapped in ErrorBoundary for error handling */}
              <ErrorBoundary>
                <GridContainer setShowChangeLog={setShowInfoDialog} setShowInstructions={setShowInstructionsDialog} />
              </ErrorBoundary>
            </div>
          </div>

          {/* Footer Text */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4 pb-4 text-center lg:pb-0">
            <span className="text-sm sm:text-base">
              Built by jbelew (NMS: void23 / QQ9Y-EJRS-P8KGW) •{" "}
              <a href="https://github.com/jbelew/nms_optimizer-web" className="underline" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>{" "}
              • {build}
            </span>
            <Buymeacoffee />
          </div>
        </div>
      </Suspense>

      {/* Info Dialogs */}
      {showInfoDialog && <InfoDialog onClose={() => setShowInfoDialog(false)} content={<ChangeLogContent />} title="Changelog" />}
      {showInstructionsDialog && <InfoDialog onClose={() => setShowInstructionsDialog(false)} content={<InstructionsContent />} title="Instructions" />}
      {showErrorDialog && <InfoDialog onClose={handleCloseErrorDialog} content={<ErrorContent />} title="Error!" />}
    </>
  );
};
export default App;
