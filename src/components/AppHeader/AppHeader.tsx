// src/components/AppHeader/AppHeader.tsx
import "./AppHeader.css";
import "flag-icons/css/flag-icons.min.css";

import { CounterClockwiseClockIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import { DropdownMenu, IconButton, Separator, Tooltip } from "@radix-ui/themes";
import React, { useMemo } from "react";
import ReactGA from "react-ga4";
import { useTranslation } from "react-i18next";
import { CgShapeRhombus } from "react-icons/cg";

import { APP_VERSION } from "../../constants";
import { useBreakpoint } from "../../hooks/useBreakpoint";

interface AppHeaderProps {
	onShowChangelog: () => void;
	onShowTranslationRequestDialog: () => void; // Add new prop
}

// Manual mapping for language codes to flag icon CSS classes.
// Add entries here as you add support for new languages.
const languageFlagClasses: Record<string, string> = {
	en: "fi fi-us",
	de: "fi fi-de",
	es: "fi fi-es",
	fr: "fi fi-fr",
	// Add other languages and their flag classes
};

const AppHeaderInternal: React.FC<AppHeaderProps> = ({
	onShowChangelog,

	onShowTranslationRequestDialog, // Destructure new prop
}) => {
	// Use breakpoint for 'sm' (640px) as per Tailwind's default
	const isSmallAndUp = useBreakpoint("640px");
	const { t, i18n } = useTranslation();
	const currentLanguage = i18n.language.split("-")[0]; // Get base language code

	const supportedLanguages = useMemo(() => {
		// Get language codes for which resources are loaded by i18next
		const availableLanguageCodes = Object.keys(i18n.services.resourceStore.data || {});
		return availableLanguageCodes
			.map((code) => {
				// Directly get the resource for the specific language code from the 'translation' namespace.
				// Fallback to uppercase code if the nativeName is not found in that language's bundle.
				// Cast getResource to string | undefined to ensure label is typed as string.
				const label =
					(i18n.getResource(code, "translation", "languageInfo.nativeName") as
						| string
						| undefined) ?? code.toUpperCase();
				const flagClass = languageFlagClasses[code] || "fi fi-xx"; // Fallback flag
				return { code, label, flagClass };
			})
			.filter((lang) => lang.label && lang.label !== lang.code.toUpperCase()) // Ensure translation exists
			.sort((a, b) => a.label.localeCompare(b.label)); // Sort by label
		// Dependencies: re-calculate if the i18n instance or its loaded resources change.
	}, [i18n]);

	const handleLanguageChange = (langCode: string) => {
		void i18n.changeLanguage(langCode); // Explicitly ignore the promise
		ReactGA.event("language_selection", {
			language: langCode,
		});
	};

	const currentFlagClass =
		supportedLanguages.find((lang) => lang.code === currentLanguage)?.flagClass || "fi fi-xx";

	return (
		// Add 'relative' to establish a positioning context for the absolutely positioned IconButton
		<header className="relative flex flex-col items-center p-4 sm:px-8 sm:pt-6 sm:pb-4 header lg:rounded-t-xl">
			<div className="!absolute !top-2 !right-4 sm:!top-4 sm:!right-8 z-10 !cursor-pointer flex items-center">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<IconButton
							variant="soft"
							radius="full"
							size={isSmallAndUp ? "2" : "1"}
							aria-label={t("languageInfo.changeLanguage") || "Change language"}
						>
							<span className={`${currentFlagClass} text-sm sm:text-base`} />
						</IconButton>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content
						color="cyan"
						sideOffset={5}
						align="end"
						style={{ backgroundColor: "var(--accent-2)" }}
					>
						<DropdownMenu.Label className="selectLanguage__header">
							{t("languageInfo.selectLanguage") || "Select Language"}
						</DropdownMenu.Label>
						<DropdownMenu.RadioGroup value={currentLanguage} onValueChange={handleLanguageChange}>
							{supportedLanguages.map((lang) => (
								<DropdownMenu.RadioItem key={lang.code} value={lang.code} className="font-medium">
									<span className={`${lang.flagClass} mr-2`} />
									{lang.label}
								</DropdownMenu.RadioItem>
							))}
						</DropdownMenu.RadioGroup>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
				<IconButton
					className="!ml-[1] !hidden sm:!inline"
					color="amber"
					radius="full"
					variant="ghost"
					aria-label={t("translationRequest.openDialogLabel") || "Open translation request dialog"}
					onClick={() => {
						ReactGA.event("show_translation_request_dialog");
						onShowTranslationRequestDialog();
					}}
				>
					<InfoCircledIcon />
				</IconButton>
			</div>
			<h1 className="text-2xl sm:text-4xl header__logo--text">
				NO MAN&apos;S SK<span style={{ letterSpacing: "0.0em" }}>Y</span>
			</h1>

			<div className="flex items-center w-full gap-2 m-1 mb-2">
				<Separator size="1" orientation="horizontal" color="cyan" decorative className="flex-1" />
				<CgShapeRhombus
					className="flex-shrink-0 w-4 h-4 sm:w-4 sm:h-4"
					style={{ color: "var(--accent-track)" }}
				/>
				<Separator size="1" orientation="horizontal" color="cyan" decorative className="flex-1" />
			</div>

			<h2 className="items-center gap-1 text-xs sm:text-base header__title">
				{t("appHeader.subTitle")}&nbsp;
				<span className="font-thin"> {APP_VERSION}</span>
				<Tooltip content={t("buttons.changelog")}>
					<IconButton
						className="shadow-sm !cursor-pointer"
						variant="ghost"
						radius="full"
						size="1"
						aria-label={t("buttons.changelog")}
						onClick={() => {
							ReactGA.event({
								category: "User Interactions",
								action: "showChangelog",
							});
							onShowChangelog();
						}}
					>
						&nbsp;
						<CounterClockwiseClockIcon className="w-4 h-4 sm:w-5 sm:h-5" />
					</IconButton>
				</Tooltip>
			</h2>
		</header>
	);
};

// Memoize the component as it has no props and its content is static.
const AppHeader = React.memo(AppHeaderInternal);

export default AppHeader;
