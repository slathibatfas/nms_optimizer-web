// src/components/InfoDialog/InfoDialog.tsx
import React, { useEffect, ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Button, Theme } from "@radix-ui/themes";

interface InfoDialogProps {
  onClose: () => void;
  title?: string;
  content: ReactNode; 
}

const InfoDialog: React.FC<InfoDialogProps> = ({ onClose, content, title = "Information" }) => {
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
        <Theme appearance="dark">
          <Dialog.Overlay className="infodialog__overlay" />
          <Dialog.Content className="infodialog__content">
            <Dialog.Title className="text-2xl font-semibold tracking-widest uppercase infodialog__title">{title}</Dialog.Title>
            <Dialog.Description className="hidden infodialog__description">
              {/* Default description */}
              This dialog contains information.
            </Dialog.Description>

            <div className="infodialog__container">
              {content} {/* Render the passed content here */}
            </div>
            <Dialog.Close asChild>
              <Button variant="soft" color="gray"className="infodialog__close">
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
