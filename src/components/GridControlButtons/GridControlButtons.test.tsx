import GridControlButtons from "./GridControlButtons";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

// Mocking the IconButton, Tooltip, PlusIcon, and MinusIcon components
vi.mock("@radix-ui/themes", () => {
  const actual = vi.importActual("@radix-ui/themes");
  return {
    ...actual,
    IconButton: vi.fn(({ children, ...props }) => (
      <button {...props}>{children}</button>
    )),
    Tooltip: vi.fn(({ children }) => <div>{children}</div>),
  };
});

vi.mock("@radix-ui/react-icons", () => {
  const actual = vi.importActual("@radix-ui/react-icons");
  return {
    ...actual,
    PlusIcon: vi.fn(() => <svg>PlusIcon</svg>),
    MinusIcon: vi.fn(() => <svg>MinusIcon</svg>),
  };
});

describe("GridControlButtons() GridControlButtons method", () => {
  // Happy Path Tests
  describe("Happy Paths", () => {
    it("renders activate button when isFirstInactiveRow is true", () => {
      render(
        <GridControlButtons
          rowIndex={0}
          activateRow={vi.fn()}
          deActivateRow={vi.fn()}
          hasModulesInGrid={false}
          isFirstInactiveRow={true}
          isLastActiveRow={false}
        />,
      );

      expect(screen.getByRole("button")).toBeInTheDocument();
      expect(screen.getByRole("button")).toHaveTextContent("PlusIcon");
    });

    it("renders deactivate button when isLastActiveRow is true", () => {
      render(
        <GridControlButtons
          rowIndex={0}
          activateRow={vi.fn()}
          deActivateRow={vi.fn()}
          hasModulesInGrid={false}
          isFirstInactiveRow={false}
          isLastActiveRow={true}
        />,
      );

      expect(screen.getByRole("button")).toBeInTheDocument();
      expect(screen.getByRole("button")).toHaveTextContent("MinusIcon");
    });

    it("calls activateRow function when activate button is clicked", () => {
      const activateRowMock = vi.fn();
      render(
        <GridControlButtons
          rowIndex={0}
          activateRow={activateRowMock}
          deActivateRow={vi.fn()}
          hasModulesInGrid={false}
          isFirstInactiveRow={true}
          isLastActiveRow={false}
        />,
      );

      fireEvent.click(screen.getByRole("button"));
      expect(activateRowMock).toHaveBeenCalledWith(0);
    });

    it("calls deActivateRow function when deactivate button is clicked", () => {
      const deActivateRowMock = vi.fn();
      render(
        <GridControlButtons
          rowIndex={0}
          activateRow={vi.fn()}
          deActivateRow={deActivateRowMock}
          hasModulesInGrid={false}
          isFirstInactiveRow={false}
          isLastActiveRow={true}
        />,
      );

      fireEvent.click(screen.getByRole("button"));
      expect(deActivateRowMock).toHaveBeenCalledWith(0);
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("does not render any button when both isFirstInactiveRow and isLastActiveRow are false", () => {
      render(
        <GridControlButtons
          rowIndex={0}
          activateRow={vi.fn()}
          deActivateRow={vi.fn()}
          hasModulesInGrid={false}
          isFirstInactiveRow={false}
          isLastActiveRow={false}
        />,
      );

      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("disables buttons when hasModulesInGrid is true", () => {
      render(
        <GridControlButtons
          rowIndex={0}
          activateRow={vi.fn()}
          deActivateRow={vi.fn()}
          hasModulesInGrid={true}
          isFirstInactiveRow={true}
          isLastActiveRow={true}
        />,
      );

      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });
  });
});
