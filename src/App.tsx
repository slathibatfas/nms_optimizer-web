// src/App.tsx
import GridContainer from "./components/GridContainer/GridContainer";
import { useState, useEffect } from "react";
import InfoDialog from "./components/InfoDialog/InfoDialog";
import ChangeLogContent from "./components/InfoDialog/ChangeLogContent";
import InstructionsContent from "./components/InfoDialog/InstructionsContent";
import ErrorContent from "./components/InfoDialog/ErrorContent";
import NMSLogo from "./assets/svg/nms_logo.svg";
import NMSIcon from "./assets/img/nms_icon2.webp";
import { useOptimizeStore } from "./store/OptimizeStore";
import ErrorBoundary from './components/ErrorBoundry/ErrorBoundry';


const App: React.FC = () => {
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [showInstructionsDialog, setShowInstructionsDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState<boolean>(false);
  const { showError, setShowError } = useOptimizeStore();

  useEffect(() => {
    if (showError) {
      setShowErrorDialog(true);
    }
  }, [showError]);

  const handleCloseErrorDialog = () => {
    setShowError(false);
    setShowErrorDialog(false);
  };

  return (
    <>
      {/* The main container of the app */}
      <div className="flex flex-col items-center justify-center lg:min-h-screen">
        {/* Container Box */}
        <div className="relative mx-auto overflow-hidden border rounded-none shadow-lg border-white/5 lg:rounded-xl lg:shadow-xl backdrop-blur-xl bg-white/5">
          <div className="pt-3 pb-2 pl-6 sm:pl-8 sm:pb-6 sm:pt-6 bg-black/50" style={{ borderColor: "var(--gray-a1)" }}>
            <div className="flex items-center">
              <img src={NMSIcon} className="mr-4 h-14 sm:h-20 optimizer__header--icon" alt="No Man's Sky Logo" />
              <div >
                <img src={NMSLogo} className="h-5 mb-1 sm:h-9 sm:mb-2.5 optimizer__header--logo" alt="No Man's Sky Logo" />
                <span className="font-thin sm:font-normal sm:text-2xl optimizer__header--title">
                  Starship Optimizer <span className="font-thin">v0.99.9 (RC1)</span>
                </span>
              </div>
            </div>
          </div>
          {/* Main Layout */}
          <div className="flex flex-col lg:flex-row">
          <ErrorBoundary>
            <GridContainer setShowChangeLog={setShowInfoDialog} setShowInstructions={setShowInstructionsDialog} />
            </ErrorBoundary>
          </div>
        </div>

        {/* Footer Text */}
        <p className="pb-4 mt-4 text-center lg:pb-0">
          Built by jbelew (void23 / QQ9Y-EJRS-P8KGW) •{" "}
          <a href="https://github.com/jbelew/nms_optimizer-web" className="underline" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </p>
      </div>

      {showInfoDialog && <InfoDialog onClose={() => setShowInfoDialog(false)} content={<ChangeLogContent />} title="Changelog" />}
      {showInstructionsDialog && <InfoDialog onClose={() => setShowInstructionsDialog(false)} content={<InstructionsContent />} title="Instructions" />}
      {showErrorDialog && <InfoDialog onClose={handleCloseErrorDialog} content={<ErrorContent />} title="Error!" />}
    </>
  );
};
export default App;
