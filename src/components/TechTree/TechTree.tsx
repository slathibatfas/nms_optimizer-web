// src/components/TechTree/TechTree.tsx
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Separator } from "@radix-ui/themes";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useFetchTechTreeSuspense } from "../../hooks/useTechTree";
import MessageSpinner from "../MessageSpinner/MessageSpinner";
import { TechTreeRow } from "../TechTreeRow/TechTreeRow";
import { useShipTypesStore } from "../../hooks/useShipTypes"; // Import the store

// Define interfaces to ensure type safety
interface TechTreeModule {
  label: string;
  id: string;
  image: string;
}

interface TechTreeItem {
  label: string;
  key: string;
  modules: TechTreeModule[];
  image: string | null; // Add image property
}

interface TechTree {
  [key: string]: TechTreeItem[];
}

// --- Image Map (This is the key part) ---
type TypeImageMap = {
  [key: string]: string;
};

const typeImageMap: TypeImageMap = {
  Weaponry: "weaponry.png",
  "Defensive Systems": "defensive.png",
  Hyperdrive: "hyperdrive.png",
  Utilities: "utilities.png",
};

interface TechTreeComponentProps {
  handleOptimize: (tech: string) => Promise<void>;
  solving: boolean;
}

/**
 * TechTreeSection component renders a section of the tech tree.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.type - The type of technology.
 * @param {TechTreeItem[]} props.technologies - Array of technology items.
 * @param {number} props.index - The index of the section.
 * @param {(tech: string) => Promise<void>} props.handleOptimize - Function to handle optimization.
 * @param {boolean} props.solving - Indicates whether solving is in progress.
 * @param {string} props.selectedShipType - The selected ship type.
 *
 * @returns {JSX.Element} - The rendered component.
 */
const TechTreeSection: React.FC<{
  type: string;
  technologies: TechTreeItem[]; // Corrected type
  index: number; // Accept index
  handleOptimize: (tech: string) => Promise<void>;
  solving: boolean;
  selectedShipType: string; // Add this prop
}> = ({ type, technologies, handleOptimize, solving }) => {
  // Determine the image path from the typeImageMap
  const imagePath = typeImageMap[type] ? `/assets/img/icons/${typeImageMap[type]}` : null;

  return (
    <div className="mb-6 lg:mb-6 last:mb-0 sidebar__section">
      <div className="flex items-center">
        {/* Conditionally render the image if imagePath is available */}
        {imagePath && <img src={imagePath} alt={type} className="w-8 h-8 mr-2 opacity-25" />}
        <h2 className="text-2xl font-semibold tracking-widest sidebar__title">{type.toUpperCase()}</h2>
      </div>

      <Separator orientation="horizontal" size="4" className="mt-2 mb-4 sidebar__separator" />

      {/* Render each technology as a TechTreeRow, sorted by label */}
      {technologies
        .sort((a, b) => a.label.localeCompare(b.label))
        .map((tech) => (
          <TechTreeRow
            key={tech.key}
            label={tech.label}
            tech={tech.key}
            handleOptimize={handleOptimize}
            solving={solving}
            modules={tech.modules}
            techImage={tech.image} // Pass the tech.image here
          />
        ))}
    </div>
  );
};

const TechTreeContent: React.FC<TechTreeComponentProps> = React.memo(({ handleOptimize, solving }) => {
  const selectedShipType = useShipTypesStore((state) => state.selectedShipType); // Get selectedShipType from the store
  const techTree = useFetchTechTreeSuspense(selectedShipType); // Pass selectedShipType to useFetchTechTreeSuspense

  // Correctly map and add modules to each technology object
  const processedTechTree = useMemo(() => {
    const result: TechTree = {};
    Object.entries(techTree).forEach(([category, technologies]) => {
      result[category] = technologies.map((tech: TechTreeItem) => ({
        ...tech,
        modules: tech.modules || [], // Handle cases where modules might be missing
        image: tech.image || null, // Handle cases where image might be missing
      }));
    });
    return result;
  }, [techTree]);

  const renderedTechTree = useMemo(
    () =>
      Object.entries(processedTechTree).map(([type, technologies], index) => (
        <TechTreeSection
          key={type}
          type={type}
          technologies={technologies}
          handleOptimize={handleOptimize}
          solving={solving}
          index={index}
          selectedShipType={selectedShipType}
        />
      )),
    [processedTechTree, handleOptimize, solving, selectedShipType]
  );

  return <>{renderedTechTree}</>;
});

const TechTreeComponent: React.FC<TechTreeComponentProps> = (props) => {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setError(null);
  }, [props]);

  return (
    <Suspense fallback={<MessageSpinner solving={true} initialMessage="LOADING!" />}>
      {error ? (
        <div className="flex flex-col items-center justify-center h-full">
          <ExclamationTriangleIcon className="w-16 h-16" style={{ color: "#C44A34" }} />
          <h2 className="pt-4 text-2xl text-center" style={{ color: "#e6c133" }}>
            -kzzkt- Error! -kzzkt-
          </h2>
          <p className="text-center sidebar__error">
            Problem connecting to the server!
            <br />
            {error.message}
          </p>
        </div>
      ) : (
        <ErrorBoundary onError={setError}>
          <TechTreeContent {...props} />
        </ErrorBoundary>
      )}
    </Suspense>
  );
};

interface ErrorBoundaryProps {
  onError: (error: Error) => void;
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError(error);
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return null; // Render nothing, error is handled by parent
    }
    return this.props.children;
  }
}

export default TechTreeComponent;
