// src/components/TechTreeRow/TechTreeRow.tsx
import React, { useEffect } from "react";
import { useGridStore } from "../../store/GridStore";
import { useTechStore } from "../../store/TechStore";
import { IconButton, Text, Tooltip, Checkbox } from "@radix-ui/themes";
import {
	UpdateIcon,
	ResetIcon,
	ChevronDownIcon,
	DoubleArrowLeftIcon,
	ExclamationTriangleIcon,
	Crosshair2Icon,
	LightningBoltIcon,
} from "@radix-ui/react-icons";
import { Accordion } from "radix-ui";
import { useShakeStore } from "../../store/ShakeStore";

import "./TechTreeRow.css";

interface TechTreeRowProps {
	label: string;
	tech: string;
	handleOptimize: (tech: string) => Promise<void>;
	solving: boolean;
	modules: { label: string; id: string; image: string; type?: string }[];
	techImage: string | null; // Add techImage prop
}

function round(value: number, decimals: number) {
	return Number(Math.round(Number(value + "e" + decimals)) + "e-" + decimals);
}

// Define AccordionTrigger outside TechTreeRow to prevent re-creation on every render
const AccordionTrigger = React.forwardRef(
	(
		{ children, className, ...props }: { children: React.ReactNode; className?: string },
		forwardedRef: React.Ref<HTMLButtonElement>
	) => (
		<Accordion.Header className="AccordionHeader">
			<Accordion.Trigger
				className={`AccordionTrigger ${className || ""}`}
				{...props}
				ref={forwardedRef}
			>
				{children}
				<ChevronDownIcon className="AccordionChevron" aria-hidden />
			</Accordion.Trigger>
		</Accordion.Header>
	)
);
AccordionTrigger.displayName = "AccordionTrigger"; // Optional: for better debugging

// --- Helper Component for Bonus Status Icons ---
interface BonusStatusIconProps {
	techMaxBonus: number;
	techSolvedBonus: number;
}

const BonusStatusIcon: React.FC<BonusStatusIconProps> = ({ techMaxBonus, techSolvedBonus }) => {
	if (techSolvedBonus <= 0) {
		return null;
	}

	const roundedMaxBonus = round(techMaxBonus, 2);

	if (roundedMaxBonus < 100) {
		return (
			<Tooltip content="Insufficient space!">
				<ExclamationTriangleIcon
					className="inline-block w-5 h-5 ml-1 align-text-bottom"
					style={{ color: "var(--red-a8)" }}
				/>
			</Tooltip>
		);
	}
	if (roundedMaxBonus === 100) {
		return (
			<Tooltip content="Valid solve!">
				<Crosshair2Icon
					className="inline-block w-5 h-5 ml-1 align-text-bottom"
					style={{ color: "var(--gray-a10)" }}
				/>
			</Tooltip>
		);
	}
	// roundedMaxBonus > 100
	return (
		<Tooltip content="Boosted solve!">
			<LightningBoltIcon
				className="inline-block w-5 h-5 ml-1 align-text-bottom"
				style={{ color: "var(--amber-a8)" }}
			/>
		</Tooltip>
	);
};

const TechTreeRowComponent: React.FC<TechTreeRowProps> = ({
	label,
	tech,
	handleOptimize,
	solving,
	modules,
	techImage,
}) => {
	const hasTechInGrid = useGridStore((state) => state.hasTechInGrid(tech));
	const isGridFull = useGridStore((state) => state.isGridFull);
	const handleResetGridTech = useGridStore((state) => state.resetGridTech);
	const {
		max_bonus,
		clearTechMaxBonus,
		solved_bonus,
		clearTechSolvedBonus,
		checkedModules,
		setCheckedModules,
		clearCheckedModules,
	} = useTechStore();
	const techMaxBonus = max_bonus?.[tech] ?? 0;
	const techSolvedBonus = solved_bonus?.[tech] ?? 0;
	const tooltipLabel = hasTechInGrid ? "Update" : "Solve";
	const IconComponent = hasTechInGrid ? UpdateIcon : DoubleArrowLeftIcon;
	const getTechColor = useTechStore((state) => state.getTechColor); // Get getTechColor function
	const { setShaking } = useShakeStore();

	useEffect(() => {
		return () => {
			clearCheckedModules(tech);
		};
	}, [tech, clearCheckedModules]);

	const handleReset = () => {
		handleResetGridTech(tech);
		clearTechMaxBonus(tech);
		clearTechSolvedBonus(tech);
	};

	const handleCheckboxChange = (moduleId: string) => {
		setCheckedModules(tech, (prevChecked = []) => {
			// Provide a default empty array
			// Provide a default empty array
			const isChecked = prevChecked.includes(moduleId);
			return isChecked ? prevChecked.filter((id) => id !== moduleId) : [...prevChecked, moduleId];
		});
	};

	const handleOptimizeClick = async () => {
		if (isGridFull() && !hasTechInGrid) {
			setShaking(true); // Trigger the shake
			setTimeout(() => {
				setShaking(false); // Stop the shake after a delay
			}, 500); // Adjust the duration as needed
		} else {
			handleResetGridTech(tech);
			clearTechMaxBonus(tech);
			clearTechSolvedBonus(tech);
			await handleOptimize(tech);
		}
	};

	// Get the checked modules for the current tech, or an empty array if undefined
	const currentCheckedModules = checkedModules[tech] || [];
	const techColor = getTechColor(tech ?? "white");

	// --- Image Path and SrcSet Construction ---
	const baseImagePath = "/assets/img/buttons/";
	const fallbackImage = `${baseImagePath}infra.webp`; // Fallback for browsers not supporting srcSet or if techImage is null

	const imagePath = techImage ? `${baseImagePath}${techImage}` : fallbackImage;

	// Prepare base styles for the IconButton
	const iconButtonBaseStyles: React.CSSProperties = {
		backgroundImage: `
      radial-gradient(circle, rgba(0, 0, 0, 0.3) 15%, rgba(0, 0, 0, 0.0) 100%),
      url('${imagePath}')
    `,
		backgroundSize: "fit",
		backgroundPosition: "center",
		backgroundRepeat: "no-repeat",
		// backgroundColor: "var(--accent-a8)",
	};

	// --- Determine dynamic styles and props for the Optimize IconButton ---
	let dynamicIconButtonStyles: React.CSSProperties = {};
	// Determine the base accent color for Radix props
	const finalAccentColor = techColor === "white" ? "gray" : techColor || "gray";
	const dataAccentColorProps: Record<string, string> = {
		"data-accent-color": finalAccentColor,
	};

	// Apply specific style overrides if not solving and techColor is white or gray
	if (!solving) {
		if (techColor === "white") {
			dynamicIconButtonStyles = {
				border: "2px solid var(--gray-a11)",
				backgroundColor: "var(--gray-a9)",
				color: "var(--accent-a6)", // Icon color (uses global accent)
			};
		} else if (techColor === "gray") {
			dynamicIconButtonStyles = {
				border: "2px solid var(--gray-7)",
				color: "var(--gray-a4)", // Icon color (uses global accent)
			};
		}
		// For other techColors when !solving, no specific dynamicIconButtonStyles are needed;
		// Radix default behavior with the `finalAccentColor` is used.
	}
	// If solving, no specific dynamicIconButtonStyles are applied here;
	// Radix default behavior with the `finalAccentColor` is used.

	return (
		<div className="flex gap-2 pl-1 mt-2 mb-2 items-top optimizationButton">
			<Tooltip delayDuration={1000} content={tooltipLabel}>
				<IconButton
					className={`techRow__optimizeButton !shadow-sm group ${!solving ? "!cursor-pointer" : "!cursor-not-allowed"}`.trim()}
					onClick={handleOptimizeClick}
					disabled={solving}
					variant="solid"
					style={{
						...iconButtonBaseStyles,
						...dynamicIconButtonStyles,
					}}
					{...dataAccentColorProps}
					aria-label={`${tooltipLabel} ${label}`}
					id={tech}
				>
					<IconComponent
						className={`${
							!solving ? "stroke-[var(--accent-a10)] stroke-1 [&>path]:stroke-inherit" : ""
						}`}
					/>
				</IconButton>
			</Tooltip>

			<Tooltip delayDuration={1000} content="Reset">
				<IconButton
					variant="solid"
					onClick={handleReset}
					disabled={!hasTechInGrid || solving}
					aria-label={`Reset ${label}`}
					className={`techRow__resetButton !shadow-sm ${hasTechInGrid && !solving ? "!cursor-pointer" : ""}`.trim()}
				>
					<ResetIcon />
				</IconButton>
			</Tooltip>

			{/* Merged div: combines layout and styling for the label/accordion area */}
			<div className="w-full pt-1 font-semibold techRow__label">
				{modules.some((module) => module.type === "reward") ? (
					<Accordion.Root
						className="w-full pb-1 border-b-1 AccordionRoot"
						style={{ borderColor: "var(--gray-a6)" }}
						type="single"
						collapsible
						defaultValue="item-1"
					>
						<Accordion.Item className="AccordionItem" value="item-1">
							<AccordionTrigger>
								<Text>
									{label}
									<BonusStatusIcon techMaxBonus={techMaxBonus} techSolvedBonus={techSolvedBonus} />
								</Text>
							</AccordionTrigger>
							<Accordion.Content className="pl-1 AccordionContent">
								{modules
									.filter((module) => module.type === "reward")
									.map((module) => (
										<div key={module.id} className="flex items-center gap-2 AccordionContentText">
											<Checkbox
												className="ml-1 CheckboxRoot"
												variant="soft"
												id={module.id}
												checked={currentCheckedModules.includes(module.id)}
												onClick={() => handleCheckboxChange(module.id)}
											/>
											<label className="Label" htmlFor={module.id}>
												{module.label}
											</label>
										</div>
									))}
							</Accordion.Content>
						</Accordion.Item>
					</Accordion.Root>
				) : (
					<>
						<Text as="label" htmlFor={tech}>
							{label}
						</Text>
						<BonusStatusIcon techMaxBonus={techMaxBonus} techSolvedBonus={techSolvedBonus} />
					</>
				)}
			</div>
		</div>
	);
};

// Memoize the component
export const TechTreeRow = React.memo(TechTreeRowComponent);
