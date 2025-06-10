import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, beforeEach, vi, type Mock } from "vitest";
import { TechTreeRow, type TechTreeRowProps } from "./TechTreeRow"; // Import TechTreeRowProps from here
import { useGridStore } from "../../store/GridStore";
import { useTechStore } from "../../store/TechStore";
import * as RadixTooltip from "@radix-ui/react-tooltip"; // Import for Tooltip.Provider
import { useShakeStore } from "../../store/ShakeStore";

// Mock stores
vi.mock("../../store/GridStore");
vi.mock("../../store/TechStore");
vi.mock("../../store/ShakeStore");

// Mock Radix UI components and icons to simplify testing
vi.mock("@radix-ui/react-icons", () => ({
	UpdateIcon: () => <svg data-testid="update-icon" />,
	ResetIcon: () => <svg data-testid="reset-icon" />,
	ChevronDownIcon: () => <svg data-testid="chevron-down-icon" />,
	DoubleArrowLeftIcon: () => <svg data-testid="double-arrow-left-icon" />,
	ExclamationTriangleIcon: () => <svg data-testid="exclamation-triangle-icon" />,
	Crosshair2Icon: () => <svg data-testid="crosshair2-icon" />,
	LightningBoltIcon: () => <svg data-testid="lightning-bolt-icon" />,
}));

vi.mock("radix-ui", () => ({
	Accordion: {
		Root: ({ children }: { children: React.ReactNode }) => (
			<div data-testid="accordion-root">{children}</div>
		),
		Item: ({ children }: { children: React.ReactNode }) => (
			<div data-testid="accordion-item">{children}</div>
		),
		Header: ({ children }: { children: React.ReactNode }) => (
			<div data-testid="accordion-header">{children}</div>
		),
		Trigger: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => (
			<button {...props} data-testid="accordion-trigger">
				{children}
			</button>
		),
		Content: ({ children }: { children: React.ReactNode }) => (
			<div data-testid="accordion-content">{children}</div>
		),
	},
}));

describe("TechTreeRow", () => {
	const mockHandleOptimize = vi.fn();
	const mockSetShaking = vi.fn();

	// Define the mock for the getTechColor function itself
	const mockGetTechColorImplementation = vi.fn().mockReturnValue("blue");

	// Define specific mocks for store actions to assert calls
	const mockResetGridTech = vi.fn();
	const mockClearTechMaxBonus = vi.fn();
	const mockClearTechSolvedBonus = vi.fn();
	const mockIsGridFull = vi.fn().mockReturnValue(false);
	const mockHasTechInGrid = vi.fn().mockReturnValue(false);

	beforeEach(() => {
		// Clear mocks before each test
		mockGetTechColorImplementation.mockClear().mockReturnValue("blue");
		mockHandleOptimize.mockClear();
		mockSetShaking.mockClear();
		mockResetGridTech.mockClear();
		mockClearTechMaxBonus.mockClear();
		mockClearTechSolvedBonus.mockClear();
		mockIsGridFull.mockClear().mockReturnValue(false);
		mockHasTechInGrid.mockClear().mockReturnValue(false);

		vi.mocked(useGridStore).mockImplementation((selector?: (state: any) => any) => {
			const mockState = {
				hasTechInGrid: mockHasTechInGrid,
				isGridFull: mockIsGridFull,
				resetGridTech: mockResetGridTech,
			};
			if (selector) {
				return selector(mockState);
			}
			return mockState;
		});

		// Mock useTechStore implementation to handle selectors
		vi.mocked(useTechStore).mockImplementation((selector?: (state: any) => any) => {
			const mockState = {
				max_bonus: {},
				clearTechMaxBonus: mockClearTechMaxBonus,
				solved_bonus: {},
				clearTechSolvedBonus: mockClearTechSolvedBonus,
				checkedModules: {},
				setCheckedModules: vi.fn(),
				clearCheckedModules: vi.fn(),
				getTechColor: mockGetTechColorImplementation,
			};
			if (selector) {
				return selector(mockState);
			}
			return mockState;
		});

		vi.mocked(useShakeStore).mockReturnValue({
			setShaking: mockSetShaking,
		});
	});

	const defaultProps: TechTreeRowProps = {
		label: "Hyperdrive",
		tech: "hyperdrive",
		handleOptimize: mockHandleOptimize,
		solving: false,
		modules: [],
		techImage: "hyperdrive.webp",
	};

	test("renders the label and optimize button with initial icon", () => {
		render(
			<RadixTooltip.Provider>
				<TechTreeRow {...defaultProps} />
			</RadixTooltip.Provider>
		);

		expect(screen.getByText("Hyperdrive")).toBeInTheDocument();
		// The optimize button's aria-label is "Solve Hyperdrive" in the initial state
		const optimizeButton = screen.getByLabelText("Solve Hyperdrive");
		expect(optimizeButton).toBeInTheDocument();
		// Check for the correct initial icon (DoubleArrowLeftIcon)
	});

	test("calls handleOptimize and resets relevant states when optimize button is clicked (not solving, grid not full)", async () => {
		mockHasTechInGrid.mockReturnValue(false); // Ensure it's the "Solve" state
		mockIsGridFull.mockReturnValue(false); // Ensure grid is not full

		render(
			<RadixTooltip.Provider>
				<TechTreeRow {...defaultProps} solving={false} />
			</RadixTooltip.Provider>
		);

		const optimizeButton = screen.getByLabelText("Solve Hyperdrive");
		fireEvent.click(optimizeButton);

		// Check that store reset functions are called before handleOptimize
		expect(mockResetGridTech).toHaveBeenCalledWith(defaultProps.tech);
		expect(mockClearTechMaxBonus).toHaveBeenCalledWith(defaultProps.tech);
		expect(mockClearTechSolvedBonus).toHaveBeenCalledWith(defaultProps.tech);

		// Check that handleOptimize is called
		expect(mockHandleOptimize).toHaveBeenCalledWith(defaultProps.tech);
		expect(mockHandleOptimize).toHaveBeenCalledTimes(1);

		// Ensure shake is not triggered
		expect(mockSetShaking).not.toHaveBeenCalled();
	});
});
