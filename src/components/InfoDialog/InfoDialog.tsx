// src/components/InfoDialog/InfoDialog.tsx
import React, { useEffect, ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Button, Theme } from "@radix-ui/themes";

interface InfoDialogProps {
  onClose: () => void;
  content: ReactNode; // Accept any React node as content
}

const InfoDialog: React.FC<InfoDialogProps> = ({ onClose, content }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <Dialog.Root open={true} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="infodialog__overlay" />
        <Theme appearance="dark" accentColor="blue">
          <Dialog.Title className="infodialog__title">Info</Dialog.Title>
          <Dialog.Description className="infodialog__description">
              {/* Default description */}
              This dialog contains information.
            </Dialog.Description>
          <Dialog.Content className="infodialog__content">
            <div className="infodialog__container">
              {content} {/* Render the passed content here */}
            </div>
            <Dialog.Close asChild>
              <Button variant="soft" className="infodialog__close">
                <Cross2Icon />
              </Button>
            </Dialog.Close>
          </Dialog.Content>
        </Theme>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default InfoDialog;
