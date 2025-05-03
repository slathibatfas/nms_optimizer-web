import GridControlButtons from "./GridControlButtons";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mocking the IconButton, Tooltip, PlusIcon, and MinusIcon components
jest.mock("@radix-ui/themes", () => {
  const actual = jest.requireActual("@radix-ui/themes");
  return {
    ...actual,
    IconButton: jest.fn(({ children, ...props }) => (
      <button {...props}>{children}</button>
    )),
    Tooltip: jest.fn(({ children }) => <div>{children}</div>),
  };
});

jest.mock("@radix-ui/react-icons", () => {
  const actual = jest.requireActual("@radix-ui/react-icons");
  return {
    ...actual,
    PlusIcon: jest.fn(() => <svg>PlusIcon</svg>),
    MinusIcon: jest.fn(() => <svg>MinusIcon</svg>),
  };
});

describe("GridControlButtons() GridControlButtons method", () => {
  // Happy Path Tests
  describe("Happy Paths", () => {
    it("renders activate button when isFirstInactiveRow is true", () => {
      render(
        <GridControlButtons
          rowIndex={0}
          activateRow={jest.fn()}
          deActivateRow={jest.fn()}
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
          activateRow={jest.fn()}
          deActivateRow={jest.fn()}
          hasModulesInGrid={false}
          isFirstInactiveRow={false}
          isLastActiveRow={true}
        />,
      );

      expect(screen.getByRole("button")).toBeInTheDocument();
      expect(screen.getByRole("button")).toHaveTextContent("MinusIcon");
    });

    it("calls activateRow function when activate button is clicked", () => {
      const activateRowMock = jest.fn();
      render(
        <GridControlButtons
          rowIndex={0}
          activateRow={activateRowMock}
          deActivateRow={jest.fn()}
          hasModulesInGrid={false}
          isFirstInactiveRow={true}
          isLastActiveRow={false}
        />,
      );

      fireEvent.click(screen.getByRole("button"));
      expect(activateRowMock).toHaveBeenCalledWith(0);
    });

    it("calls deActivateRow function when deactivate button is clicked", () => {
      const deActivateRowMock = jest.fn();
      render(
        <GridControlButtons
          rowIndex={0}
          activateRow={jest.fn()}
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
          activateRow={jest.fn()}
          deActivateRow={jest.fn()}
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
          activateRow={jest.fn()}
          deActivateRow={jest.fn()}
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
