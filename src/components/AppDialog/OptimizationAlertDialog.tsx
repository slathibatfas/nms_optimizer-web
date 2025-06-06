// src/components/AppDialog/OptimizationAlertDialog.tsx
import { FC } from "react";
import { Dialog, Button, Flex } from "@radix-ui/themes";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface OptimizationAlertDialogProps {
  isOpen: boolean;
  technologyName: string | null; // The name of the technology that couldn't fit
  onClose: () => void; // Function to call when the dialog should be closed (e.g., Cancel or overlay click)
  onForceOptimize: () => Promise<void>; // Function to call when "Force Optimize" is clicked
}

const OptimizationAlertDialog: FC<OptimizationAlertDialogProps> = ({
  isOpen,
  technologyName,
  onClose,
  onForceOptimize,
}) => {
  if (!technologyName) return null; // Don't render if there's no technology name (though isOpen should also handle this)

  const handleForceOptimizeClick = async () => {
    await onForceOptimize();
    // The dialog will close automatically if onForceOptimize sets patternNoFitTech to null,
    // which in turn sets isOpen to false.
    // If onForceOptimize doesn't guarantee closure, onClose() might be needed here too,
    // but current logic in App.tsx suggests it will.
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(openStatus) => {
        if (!openStatus) {
          onClose(); // Call onClose when the dialog is closed by Escape key or overlay click
        }
      }}
    >
      <Dialog.Content maxWidth="500px" style={{ backgroundColor: "var(--accent-4)" }}>
        <Dialog.Title className="warningDialog__title">
          <ExclamationTriangleIcon className="inline w-6 h-6" style={{ color: "var(--amber-9)" }} /> Optimization Alert!
        </Dialog.Title>
        <Dialog.Description size="2" mb="4">
          <span className="block pb-2 text-xl font-semibold tracking-widest text-center errorContent__title">-kzzkt- Warning! -kzzkt-</span>
          <span className="block mb-2">
            There isn't enough space to effectively place all modules for the technology{" "}
            <span className="font-bold uppercase" style={{ color: "var(--accent-11)" }}>
              {technologyName}
            </span>
            . This usually happens when too many technologies are selected for your platform.
          </span>
          <span className="block">
            You can try <strong>"Force Optimize"</strong> for a more intensive solve, but it will probably fail to find an optimal layout. Consider reordering your technologies or selecting fewer to improve the result.
          </span>
        </Dialog.Description>
        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close><Button variant="soft" color="gray" onClick={onClose}>Cancel</Button></Dialog.Close>
          <Dialog.Close><Button onClick={handleForceOptimizeClick}>Force Optimize</Button></Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default OptimizationAlertDialog;