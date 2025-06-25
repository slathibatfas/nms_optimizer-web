// src/context/dialog-utils.ts
import { createContext, useContext } from "react";

// Define the types for the dialogs
export type DialogType = "about" | "instructions" | "changelog" | null;

// Define the shape of the context
export interface DialogContextType {
	activeDialog: DialogType;
	openDialog: (dialog: NonNullable<DialogType>) => void;
	closeDialog: () => void;
	isFirstVisit: boolean;
	onFirstVisitInstructionsDialogOpened: () => void;
}

// Create the context with a default value
export const DialogContext = createContext<DialogContextType | undefined>(undefined);

/**
 * Custom hook for easy consumption of the DialogContext.
 * Throws an error if used outside of a DialogProvider.
 */
export const useDialog = () => {
	const context = useContext(DialogContext);
	if (context === undefined) {
		throw new Error("useDialog must be used within a DialogProvider");
	}
	return context;
};