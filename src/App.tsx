// src/App.tsx
import { Box, Flex, Heading } from "@radix-ui/themes";
import GridContainer from "./components/GridContainer/GridContainer";
import { useState } from "react";
import InfoDialog from "./components/InfoDialog/InfoDialog";
import ChangeLogContent from "./components/InfoDialog/ChangeLogContent";
import InstructionsContent from "./components/InfoDialog/InstructionsContent";

const App: React.FC = () => {
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [showInstructionsDialog, setShowInstructionsDialog] = useState(false);

  return (
    <>
      {/* The main container of the app */}
      <Flex className="items-start justify-center optimizer lg:pt-16 lg:items-top lg:p-4">
        {/* Container Box */}
        <Box
          className="optimizer__container relative min-w-[min-content] max-w-fit mx-auto overflow-hidden p-6 lg:p-8 rounded-none shadow-lg lg:rounded-xl lg:border-1 lg:shadow-xl backdrop-blur-lg"
          style={{ borderColor: "var(--blue-1)" }}
        >
          {/* Background Overlay */}
          <Box className="absolute inset-0 z-0 bg-white rounded-none optimizer__overlay opacity-10"></Box>

          {/* Header */}
          <Box asChild className="pb-4 optimizer__header text-custom-cyan-light">
            <Heading as="h1" size="7" className="!font-bold optimizer__title" style={{ color: "var(--gray-12)" }}>
              No Man's Sky Starship Optimizer <span className="font-extralight" style={{ color: "var(--gray-11)" }}>v0.91α</span>
            </Heading>
          </Box>

          {/* Main Layout */}
          <GridContainer setShowChangeLog={setShowInfoDialog} setShowInstructions={setShowInstructionsDialog} /> {/* Render GridContainer */}
        </Box>
      </Flex>
      <Box className="p-4 font-light text-center lg:p-0">Built by jbelew (void23 / QQ9Y-EJRS-P8KGW) • <a href="https://github.com/jbelew/nms_optimizer-web" className="underline" target="_blank" rel="noopener noreferrer">GitHub</a></Box>
      {showInfoDialog && (
        <InfoDialog onClose={() => setShowInfoDialog(false)} content={<ChangeLogContent />} />
      )}
      {showInstructionsDialog && (
        <InfoDialog onClose={() => setShowInstructionsDialog(false)} content={<InstructionsContent />} />
      )}
    </>
  );
};

export default App;
