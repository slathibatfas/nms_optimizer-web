// src/App.tsx
import { Box, Flex } from "@radix-ui/themes";
import GridContainer from "./components/GridContainer/GridContainer";
import { useState, useEffect } from "react";
import InfoDialog from "./components/InfoDialog/InfoDialog";
import ChangeLogContent from "./components/InfoDialog/ChangeLogContent";
import InstructionsContent from "./components/InfoDialog/InstructionsContent";
import ErrorContent from "./components/InfoDialog/ErrorContent";
import NMSLogo from "./assets/svg/nms_logo.svg";
import NMSIcon from "./assets/img/nms_icon2.webp";
import { useOptimizeStore } from "./store/useOptimize";

const App: React.FC = () => {
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [showInstructionsDialog, setShowInstructionsDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState<boolean>(false);
  const { showError, setShowError } = useOptimizeStore(); // Uses global state

  console.log("App.tsx: useOptimize state ->", showError);

  useEffect(() => {
    console.log("App.tsx: useEffect triggered, showError =", showError);
    if (showError) {
      setShowErrorDialog(true);
    }
  }, [showError]);

  // Reset showError when the dialog is closed
  const handleCloseErrorDialog = () => {
    setShowError(false);
    setShowErrorDialog(false);
  };

  return (
    <>
      {/* The main container of the app */}
      <Flex className="items-start justify-center optimizer lg:pt-16 lg:items-top lg:p-4">
        {/* Container Box */}
        <Box
          className="optimizer__container relative min-w-[min-content] max-w-fit mx-auto overflow-hidden p-4 lg:p-8 rounded-none shadow-lg lg:rounded-xl lg:border-1 lg:shadow-xl backdrop-blur-lg"
          style={{ borderColor: "var(--gray-3)" }}
        >
          {/* Background Overlay */}
          <Box className="absolute inset-0 z-0 bg-white rounded-none optimizer__overlay opacity-10"></Box>
          <Box asChild className="p-0 optimizer__header">
            <div className="pb-2 mb-4 border-b sm:pb-4 sm:mb-6" style={{ borderColor: "var(--accent-a5)" }}>
              <div className="flex items-center">
                <img src={NMSIcon} className="mr-4 h-14 sm:h-20 optimizer__header--icon" alt="No Man's Sky Logo" />
                <div>
                  <img src={NMSLogo} className="h-5 mb-1 sm:h-9 sm:mb-2 optimizer__header--logo" alt="No Man's Sky Logo" />
                  <span className="font-thin sm:font-light sm:text-2xl optimizer__header--title">Starship Optimizer - v0.98</span>
                </div>
              </div>
            </div>
          </Box>
          {/* Main Layout */}
          <GridContainer setShowChangeLog={setShowInfoDialog} setShowInstructions={setShowInstructionsDialog} /> {/* Render GridContainer */}
        </Box>
      </Flex>
      <Box className="p-4 font-light text-center lg:p-0">
        Built by jbelew (void23 / QQ9Y-EJRS-P8KGW) •{" "}
        <a href="https://github.com/jbelew/nms_optimizer-web" className="underline" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </Box>
      {showInfoDialog && <InfoDialog onClose={() => setShowInfoDialog(false)} content={<ChangeLogContent />} />}
      {showInstructionsDialog && <InfoDialog onClose={() => setShowInstructionsDialog(false)} content={<InstructionsContent />} />}
      {showErrorDialog && <InfoDialog onClose={handleCloseErrorDialog} content={<ErrorContent />} />}
    </>
  );
};
export default App;
