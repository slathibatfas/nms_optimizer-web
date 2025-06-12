// src/components/TechTreeRow/TechTreeRow.tsx
import React, { useEffect } from "react";
import { useGridStore } from "../../store/GridStore";
import { useTechStore } from "../../store/TechStore";
import { IconButton, Text, Tooltip, Checkbox, Avatar } from "@radix-ui/themes";
import {
	UpdateIcon,
	ResetIcon,
	ChevronDownIcon,
	ExclamationTriangleIcon,
	Crosshair2Icon,
	LightningBoltIcon,
	DoubleArrowLeftIcon,
} from "@radix-ui/react-icons";
// import { GoLightBulb } from "react-icons/go";

import { SlPuzzle } from "react-icons/sl";
import { Accordion } from "radix-ui";
import { useShakeStore } from "../../store/ShakeStore";

import "./TechTreeRow.css";

/**
 * Props for the TechTreeRow component.
 */
export interface TechTreeRowProps {
	/** The display label for the technology. */
	label: string;
	/** The unique identifier for the technology. */
	tech: string;
	/** Async function to handle the optimization process for a given technology. */
	handleOptimize: (tech: string) => Promise<void>;
	/** Boolean indicating if an optimization process is currently active. */
	solving: boolean;
	/** Array of modules associated with this technology. */
	modules: { label: string; id: string; image: string; type?: string }[];
	/** The filename of the image representing the technology (e.g., "hyperdrive.webp"). Null if no specific image. */
	techImage: string | null;
}

function round(value: number, decimals: number) {
	return Number(Math.round(Number(value + "e" + decimals)) + "e-" + decimals);
}

/**
 * A forwardRef-wrapped Accordion.Trigger component to be used within the TechTreeRow.
 * This is defined outside the main component to prevent re-creation on every render of TechTreeRow.
 */
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
AccordionTrigger.displayName = "AccordionTrigger";

/**
 * Props for the BonusStatusIcon component.
 */
interface BonusStatusIconProps {
	/** The maximum potential bonus for the technology. */
	techMaxBonus: number;
	/** The bonus achieved from the current solved state for the technology. */
	techSolvedBonus: number;
}

/**
 * Displays an icon indicating the status of the technology's bonus based on solved and max values.
 */
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

/**
 * Renders a single row in the technology tree, allowing users to optimize, reset, and view module details.
 */
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
	const OptimizeIconComponent = hasTechInGrid ? UpdateIcon : DoubleArrowLeftIcon;
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
			const isChecked = prevChecked.includes(moduleId);
			return isChecked ? prevChecked.filter((id) => id !== moduleId) : [...prevChecked, moduleId];
		});
	};

	const handleOptimizeClick = async () => {
		if (isGridFull() && !hasTechInGrid) {
			setShaking(true); // Trigger the shake
			setTimeout(() => {
				// TODO: Consider making this a configurable constant or part of the shake store
				setShaking(false); // Stop the shake after a delay
			}, 500); // Adjust the duration as needed
		} else {
			handleResetGridTech(tech);
			clearTechMaxBonus(tech);
			clearTechSolvedBonus(tech);
			await handleOptimize(tech);
		}
	};

	const currentCheckedModules = checkedModules[tech] || [];
	const techColor = getTechColor(tech ?? "white");

	const baseImagePath = "/assets/img/buttons/";
	const fallbackImage = `${baseImagePath}infra.webp`;
	const imagePath = techImage ? `${baseImagePath}${techImage}` : fallbackImage;
	// If techImage is "hyperdrive.webp", imagePath2x will be "/assets/img/buttons/hyperdrive@x2.webp"
	const imagePath2x = techImage
		? `${baseImagePath}${techImage.replace(/\.(webp|png|jpg|jpeg)$/, "@x2.$1")}`
		: fallbackImage.replace(/\.(webp|png|jpg|jpeg)$/, "@x2.$1"); // Also handle fallback

	return (
		<div className="flex gap-2 mt-2 mb-2 ml-1 items-top optimizationButton">
			{/* Optimize Button */}
			<Tooltip delayDuration={1000} content={tooltipLabel}>
				<IconButton
					onClick={handleOptimizeClick}
					disabled={(isGridFull() && !hasTechInGrid) || solving}
					aria-label={`${tooltipLabel} ${label}`}
					id={tech}
					className={`techRow__resetButton !shadow-sm ${!solving ? "!cursor-pointer" : ""}`.trim()}
				>
					<OptimizeIconComponent />
				</IconButton>
			</Tooltip>

			{/* Reset Button */}
			<Tooltip delayDuration={1000} content="Reset">
				<IconButton
					onClick={handleReset}
					disabled={!hasTechInGrid || solving}
					aria-label={`Reset ${label}`}
					className={`techRow__resetButton !shadow-sm ${hasTechInGrid && !solving ? "!cursor-pointer" : ""}`.trim()}
				>
					<ResetIcon />
				</IconButton>
			</Tooltip>

			{/* Avatar with srcSet */}
			<Avatar
				size="2"
				radius="full"
				alt={label}
				fallback="IK"
				src={imagePath}
				srcSet={`${imagePath} 1x, ${imagePath2x} 2x`}
			/>
			{modules.some((module) => module.type === "reward") ? (
				<Accordion.Root
					className="flex-1 pt-1 pb-1 font-medium border-b-1 AccordionRoot"
					style={{ borderColor: "var(--accent-track)" }}
					type="single"
					collapsible
				>
					<Accordion.Item className="AccordionItem" value="item-1">
						<AccordionTrigger>
							<Text className="techRow__label">
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
				<Text as="label" htmlFor={tech} className="flex-1 block pt-1 font-medium techRow__label">
					{label}
					<BonusStatusIcon techMaxBonus={techMaxBonus} techSolvedBonus={techSolvedBonus} />
				</Text>
			)}
		</div>
	);
};

/**
 * Memoized version of TechTreeRowComponent to prevent unnecessary re-renders.
 */
export const TechTreeRow = React.memo(TechTreeRowComponent);
