import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import GridCell from "./GridCell"; // Correct import path
import { useGridStore, GridStore, Cell, Grid } from "../../store/useGridStore";
import { act } from "react-dom/test-utils";
import { TooltipProvider } from "@radix-ui/react-tooltip";

jest.mock("../../store/useGridStore");
jest.useFakeTimers(); // Enable fake timers

describe("GridCell Component", () => {
  const mockSetShaking = jest.fn();
  const mockCell: Cell = {
    label: "Test Cell",
    supercharged: false,
    active: true,
    image: null,
    adjacency: false,
    adjacency_bonus: 0,
    bonus: 0,
    module: null,
    sc_eligible: false,
    tech: null,
    total: 0,
    type: "",
    value: 0,
  };
  const mockGrid: Grid = { cells: [[mockCell]], height: 1, width: 1 };

  beforeEach(() => {
    (useGridStore as jest.MockedFunction<typeof useGridStore>).mockClear();
    mockSetShaking.mockClear();
    jest.clearAllTimers();
  });

  it("renders a grid cell with correct props", () => {
    const mockGridStore = {
      toggleCellActive: jest.fn(),
      toggleCellSupercharged: jest.fn(),
      grid: createGrid(10, 6),
      result: null,
      setGrid: jest.fn(),
      resetGrid: jest.fn(),
      setResult: jest.fn(),
      activateRow: jest.fn(),
      deActivateRow: jest.fn(),
      hasTechInGrid: jest.fn(),
      resetGridTech: jest.fn(),
      setCellActive: jest.fn(),
      setCellSupercharged: jest.fn(),
      setCellTech: jest.fn(),
      setCellModule: jest.fn(),
      modules: {},
      setModules: jest.fn(),
    } as unknown as GridStore;
    (useGridStore as jest.MockedFunction<typeof useGridStore>).mockReturnValue(mockGridStore);
    render(
      <TooltipProvider>
        <GridCell rowIndex={0} columnIndex={0} cell={mockCell} grid={mockGrid} setShaking={mockSetShaking} />
      </TooltipProvider>
    );
    expect(screen.getByRole("gridCell")).toBeInTheDocument();
    expect(screen.getByRole("gridCell")).toHaveClass("gridCell gridCell--interactive gridCell--active");
  });
  

  it("does not toggle cell active state on short press (simulated touch)", () => {
    const mockGridStore = {
      toggleCellActive: jest.fn(),
      toggleCellSupercharged: jest.fn(),
      grid: createGrid(10, 6),
      result: null,
      setGrid: jest.fn(),
      resetGrid: jest.fn(),
      setResult: jest.fn(),
      activateRow: jest.fn(),
      deActivateRow: jest.fn(),
      hasTechInGrid: jest.fn(),
      resetGridTech: jest.fn(),
      setCellActive: jest.fn(),
      setCellSupercharged: jest.fn(),
      setCellTech: jest.fn(),
      setCellModule: jest.fn(),
      modules: {},
      setModules: jest.fn(),
    } as unknown as GridStore;
    (useGridStore as jest.MockedFunction<typeof useGridStore>).mockReturnValue(mockGridStore);
    render(
      <TooltipProvider>
        <GridCell rowIndex={0} columnIndex={0} cell={mockCell} grid={mockGrid} setShaking={mockSetShaking} />
      </TooltipProvider>
    );
    const gridCell = screen.getByRole("gridCell");

    // Simulate a short touch (less than 500ms)
    act(() => {
      fireEvent.touchStart(gridCell);
      jest.advanceTimersByTime(499); // Advance by 499ms
      fireEvent.touchEnd(gridCell);
      jest.advanceTimersByTime(50); // Advance by 50ms
    });

    expect(mockGridStore.toggleCellActive).not.toHaveBeenCalled();
  });

  it("renders image if image prop is provided", () => {
    const mockGridStore = {
      toggleCellActive: jest.fn(),
      toggleCellSupercharged: jest.fn(),
      grid: createGrid(10, 6),
      result: null,
      setGrid: jest.fn(),
      resetGrid: jest.fn(),
      setResult: jest.fn(),
      activateRow: jest.fn(),
      deActivateRow: jest.fn(),
      hasTechInGrid: jest.fn(),
      resetGridTech: jest.fn(),
      setCellActive: jest.fn(),
      setCellSupercharged: jest.fn(),
      setCellTech: jest.fn(),
      setCellModule: jest.fn(),
      modules: {},
      setModules: jest.fn(),
    } as unknown as GridStore;
    (useGridStore as jest.MockedFunction<typeof useGridStore>).mockReturnValue(mockGridStore);
    const mockCellWithImage: Cell = { ...mockCell, image: "test.jpg" };
    render(
      <TooltipProvider>
        <GridCell rowIndex={0} columnIndex={0} cell={mockCellWithImage} grid={mockGrid} setShaking={mockSetShaking} />
      </TooltipProvider>
    );
    expect(screen.getByRole("gridCell")).toHaveStyle({ backgroundImage: `url(/assets/img/test.jpg)` });
  });
});

const createGrid = (width: number, height: number): Grid => ({
  cells: Array.from({ length: height }, () => Array.from({ length: width }, () => createEmptyCell(false, true))),
  width,
  height,
});

const createEmptyCell = (supercharged = false, active = true): Cell => ({
  active,
  adjacency: false,
  adjacency_bonus: 0.0,
  bonus: 0.0,
  image: null,
  module: null,
  label: "",
  sc_eligible: false,
  supercharged: supercharged,
  tech: null,
  total: 0.0,
  type: "",
  value: 0,
});
