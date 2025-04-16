// src/components/InfoDialog/InfoDialog.tsx
import React, { useEffect, ReactNode, useCallback } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Button, Theme } from "@radix-ui/themes";

interface InfoDialogProps {
  onClose: () => void;
  title?: string;
  content: ReactNode;
}

/**
 * A Dialog component for displaying information to the user.
 *
 * @param {InfoDialogProps} props
 * @prop {() => void} onClose - A callback to be called when the dialog is closed.
 * @prop {string} [title="Information"] - The title of the dialog.
 * @prop {ReactNode} content - The content to be displayed in the dialog.
 *
 * @returns {ReactElement}
 */
const InfoDialog: React.FC<InfoDialogProps> = ({ onClose, content, title = "Information" }) => {
  /**
   * Handle the Escape key, closing the dialog if it is pressed.
   *
   * @param {KeyboardEvent} event
   */
  const handleEscapeKey = useCallback((event: KeyboardEvent) => event.key === "Escape" && onClose(), [onClose]);

  /**
   * Add a keydown event listener to the window for the Escape key.
   *
   * This is done to allow the dialog to be closed with the Escape key, in
   * addition to the close button.
   */
  useEffect(() => {
    window.addEventListener("keydown", handleEscapeKey);
    return () => window.removeEventListener("keydown", handleEscapeKey);
  }, [handleEscapeKey]);

  return (
    <Dialog.Root open onOpenChange={onClose}>
      <Dialog.Portal>
        <Theme appearance="dark">
          <Dialog.Overlay className="infodialog__overlay" />
          <Dialog.Content className="infodialog__content">
            <Dialog.Title className="text-2xl font-bold tracking-widest uppercase infodialog__title">{title}</Dialog.Title>
            <Dialog.Description className="hidden infodialog__description">This dialog contains information.</Dialog.Description>
            <div className="infodialog__container">{content}</div>
            <Dialog.Close asChild>
              <Button variant="soft" color="gray" className="infodialog__close">
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
