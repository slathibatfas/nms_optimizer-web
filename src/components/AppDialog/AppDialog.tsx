// src/components/InfoDialog/InfoDialog.tsx
import "./AppDialog.css";

import * as Dialog from "@radix-ui/react-dialog";
import {
	CounterClockwiseClockIcon,
	Cross2Icon,
	ExclamationTriangleIcon,
	GlobeIcon,
	InfoCircledIcon,
	QuestionMarkCircledIcon,
} from "@radix-ui/react-icons";
import { Button, Theme } from "@radix-ui/themes";
import React, { ReactNode, useCallback, useEffect } from "react";

interface AppDialogProps {
	onClose: () => void;
	title?: string;
	titleKey?: string; // Add a prop for the translation key
	isOpen: boolean;
	content: ReactNode;
}

/**
 * A Dialog component for displaying information to the user.
 *
 * @param {AppDialogProps} props
 * @prop {() => void} onClose - A callback to be called when the dialog is closed.
 * @prop {string} [title="Information"] - The title of the dialog.
 * @prop {ReactNode} content - The content to be displayed in the dialog.
 *
 * @returns {ReactElement}
 */
const AppDialog: React.FC<AppDialogProps> = ({
	onClose,
	content,
	isOpen,
	titleKey, // Use the new prop
	title = "Information",
}) => {
	/**
	 * Handle the Escape key, closing the dialog if it is pressed.
	 *
	 * @param {KeyboardEvent} event
	 */
	const handleEscapeKey = useCallback(
		(event: KeyboardEvent) => event.key === "Escape" && onClose(),
		[onClose]
	);

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
		<Dialog.Root
			open={isOpen} // Control open state
			onOpenChange={(open) => !open && onClose()}
			modal={true} // Keep it modal
		>
			<Dialog.Portal>
				<Theme appearance="dark">
					<Dialog.Overlay className="appDialog__overlay" />
					<Dialog.Content className="appDialog__content">
						<Dialog.Title className="flex items-center gap-2 text-xl sm:text-2xl heading-styled">
							{titleKey === "dialogs.titles.instructions" && (
								<QuestionMarkCircledIcon
									className="w-6 h-6"
									style={{ color: "var(--accent-11)" }}
								/>
							)}
							{titleKey === "dialogs.titles.changelog" && (
								<CounterClockwiseClockIcon
									className="w-6 h-6"
									style={{ color: "var(--accent-11)" }}
								/>
							)}
							{titleKey === "dialogs.titles.about" && (
								<InfoCircledIcon className="w-6 h-6" style={{ color: "var(--accent-11)" }} />
							)}
							{titleKey === "dialogs.titles.serverError" && (
								<ExclamationTriangleIcon
									className="inline w-6 h-6"
									style={{ color: "var(--red-9)" }}
								/>
							)}
							{titleKey === "dialogs.titles.translationRequest" && (
								<GlobeIcon className="w-6 h-6" style={{ color: "var(--accent-11)" }} />
							)}
							{title}
						</Dialog.Title>
						<Dialog.Description className="hidden appDialog__description">
							This dialog contains information.
						</Dialog.Description>
						<div className="text-sm appDialog__container">{content}</div>
						<Dialog.Close asChild>
							<Button
								variant="soft"
								color="cyan"
								className="appDialog__close"
								aria-label="Close dialog"
							>
								<Cross2Icon />
							</Button>
						</Dialog.Close>
					</Dialog.Content>
				</Theme>
			</Dialog.Portal>
		</Dialog.Root>
	);
};

export default AppDialog;
