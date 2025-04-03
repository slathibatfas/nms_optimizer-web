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

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can log the error to an error reporting service here
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <>
          <div className="flex flex-col items-center justify-center h-full p-8">
            <ExclamationTriangleIcon className="w-16 h-16 shadow-lg" style={{ color: "#C44A34" }} />
            <h1 className="pt-2 text-2xl font-semibold tracking-widest text-center" style={{ color: "#e6c133", fontFamily: "GeosansLight" }}>
              -kzzkt- Error! -kzzkt-
            </h1>
            <h2 className="pb-4 font-semibold ">Something went wrong.</h2>
            <div style={{ whiteSpace: "pre-wrap" }}>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </div>
          </div>
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
