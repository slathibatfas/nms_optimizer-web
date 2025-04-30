// src/components/ErrorBoundary/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from "react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   * React lifecycle method that gets called when there is an error in the component
   * or any of its children. This method updates the state so that the next render
   * will show the error fallback UI.
   *
   * @param error - The error that was thrown
   */
  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  /**
   * React lifecycle method that gets called after a component has thrown an error.
   * This method can be used to log the error to an error reporting service.
   *
   * @param error - The error that was thrown
   * @param errorInfo - An object with componentStack property containing information about which component threw the error
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can log the error to an error reporting service here
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  /**
   * Render method of the ErrorBoundary component. If there is an error, the method
   * renders the error fallback UI. Otherwise, it renders the children.
   */
  render() {
    // If there is an error, render the error fallback UI
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <ExclamationTriangleIcon className="w-16 h-16 shadow-lg" style={{ color: "#C44A34" }} />
          <h1 className="pt-2 text-2xl font-semibold tracking-widest" style={{ color: "#e6c133", fontFamily: "GeosansLight" }}>
            -kzzkt- Error! -kzzkt-
          </h1>
          <h2 className="pb-4 font-semibold">Something went wrong.</h2>
          <span className="font-mono text-xs text-left lg:text-base" style={{ whiteSpace: "pre-wrap" }}>
            {this.state.error?.toString()}
            <br />
            {this.state.errorInfo?.componentStack}
          </span>
        </div>
      );
    }

    // Render the children if there is no error
    return this.props.children;
  }
}

export default ErrorBoundary;
