// src/context/DialogContext.tsx
import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { DialogContext, type DialogType } from "./dialog-utils";

/**
 * Provider component that manages the state and logic for routed dialogs.
 * It syncs the active dialog with the URL.
 */
export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const location = useLocation();
	const navigate = useNavigate();

	const [activeDialog, setActiveDialog] = useState<DialogType>(null);
	const [isFirstVisit, setIsFirstVisit] = useState(
		() => !localStorage.getItem("hasVisitedNMSOptimizer")
	);

	// Effect to sync dialog state with URL
	useEffect(() => {
		const path = location.pathname.substring(1); // remove leading '/'
		if (path === "about" || path === "instructions" || path === "changelog" || path === "translation") {
			setActiveDialog(path);
		} else {
			setActiveDialog(null);
		}
	}, [location.pathname]);

	const openDialog = useCallback(
		(dialog: NonNullable<DialogType>) => {
			navigate(`/${dialog}`);
		},
		[navigate]
	);

	const closeDialog = useCallback(() => {
		if (activeDialog) {
			navigate("/");
		}
	}, [activeDialog, navigate]);

	const onFirstVisitInstructionsDialogOpened = useCallback(() => {
		if (isFirstVisit) {
			setIsFirstVisit(false);
			localStorage.setItem("hasVisitedNMSOptimizer", "true");
		}
	}, [isFirstVisit]);

	const value = {
		activeDialog,
		openDialog,
		closeDialog,
		isFirstVisit,
		onFirstVisitInstructionsDialogOpened,
	};

	return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>;
};