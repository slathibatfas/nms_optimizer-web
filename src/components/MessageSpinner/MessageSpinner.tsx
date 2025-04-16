// src/components/MessageSpinner/MessageSpinner.tsx
import { Text } from "@radix-ui/themes";
import React, { useState, useEffect } from "react";

interface MessageSpinnerProps {
  solving: boolean;
  initialMessage: string; // Required initial message prop
}

// --- Define your random messages here ---
const randomMessages = [
  "-{{ Recalibrating flux capacitor! }}-",
  "-{{ Polishing the chrome! }}-",
  "-{{ Asking the Atlas for guidance! }}-",
  "-{{ Aligning plasma conduits! }}-",
  "-{{ Checking for Geknip residue! }}-",
  "-{{ Rerouting power to the main deflector! }}-",
  "-{{ Engaging the Infinite Improbability Drive! }}-",
  "-{{ Just a few more calculations... honest! }}-",
  "-{{ Optimizing the optimization! }}-",
  "-{{ Don't worry, I know a guy! }}-",
  "-{{ Attempting to refine the solution! }}-",
  "-{{ Optimizing module interlink harmonics! }}-",
  "-{{ Recalibrating supercharge node alignments! }}-",
  "-{{ Resolving tech blueprint inconsistencies! }}-",
  "-{{ Enhancing technology subsystem efficiency! }}-",
  "-{{ Adjusting thermal buffer tolerances! }}-",
  "-{{ Reinforcing upgrade module integrity! }}-",
  "-{{ Stabilizing nanite-driven enhancements! }}-",
  "-{{ Rebalancing energy flow matrices! }}-",
  "-{{ Validating blueprint schematic revisions! }}-",
  "-{{ Synchronizing with technology firmware! }}-",
  "-{{ Refining output calibration! }}-",
  "-{{ Performing module synergy diagnostics! }}-",
  "-{{ Harmonizing upgrade stack interactions! }}-",
  "-{{ Tuning procedural augmentation routines! }}-",
  "-{{ Initiating recursive tech optimization pass! }}-",
  "-{{ Compiling multi-threaded tech stack! }}-",
  "-{{ Rebuilding nanite optimization cache! }}-",
  "-{{ Decompressing upgrade fusion archive! }}-",
  "-{{ Verifying circuit mesh continuity! }}-",
  "-{{ Applying precision enhancement protocol! }}-",
  "-{{ Debugging plasma injector routines! }}-",
  "-{{ Realigning phase-shift conduits! }}-",
  "-{{ Processing quantum tuning array! }}-",
  "-{{ Refining adaptive tech overlays! }}-",
  "-{{ Executing flux harmonization loop! }}-",
  "-{{ Decrypting legacy tech artifacts! }}-",
  "-{{ Interfacing with anomaly schematics! }}-",
  "-{{ Resolving synthetic firmware conflicts! }}-",
  "-{{ Isolating unstable augmentation packets! }}-",
];
// --- End of random messages ---

/**
 * MessageSpinner component that displays a loading spinner overlay when solving is true.
 * It shows an initial message, and then a random message after a short delay.
 *
 * @param {MessageSpinnerProps} props - The properties passed to the component.
 * @param {boolean} props.solving - Determines whether the spinner is visible.
 * @param {string} props.initialMessage - The initial message to display.
 * @returns {JSX.Element | null} The rendered spinner element or null.
 */
const MessageSpinner: React.FC<MessageSpinnerProps> = ({ solving, initialMessage }) => {
  const [showAdditionalMessage, setShowAdditionalMessage] = useState(false);
  // --- Add state for the random message ---
  const [currentRandomMessage, setCurrentRandomMessage] = useState<string>("");
  // --- End state addition ---

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (solving) {
      // Reset additional message state on new solve start
      setShowAdditionalMessage(false);
      setCurrentRandomMessage(""); // Clear previous random message

      timer = setTimeout(() => {
        // --- Select and set a random message ---
        const randomIndex = Math.floor(Math.random() * randomMessages.length);
        setCurrentRandomMessage(randomMessages[randomIndex]);
        // --- End random message selection ---
        setShowAdditionalMessage(true);
      }, 2500); // Keep the original delay

      // Cleanup function
      return () => {
        if (timer) clearTimeout(timer);
      };
    } else {
      // Ensure state is reset if solving becomes false
      setShowAdditionalMessage(false);
      setCurrentRandomMessage("");
    }
  }, [solving]); // Dependency remains 'solving'

  if (!solving) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-opacity-75 rounded-lg">
      <div className="w-16 h-16 border-8 rounded-full shadow-2xl border-slate-600 animate-spin messageSpinner"></div>
      <Text className="pt-4 text-2xl font-bold shadow-2xl messageSpinner__header">{initialMessage}</Text>
      {showAdditionalMessage ? (
        // --- Render the random message from state ---
        <Text className="font-semibold text-center uppercase shadow-2xl" style={{ color: "#e6c133" }}>
          {currentRandomMessage}
        </Text>
      ) : (
        // --- End rendering random message ---
        // Keep the placeholder for layout consistency before the message appears
        <Text style={{ color: "#e6c133" }}>
          <br />
        </Text>
      )}
    </div>
  );
};

export default MessageSpinner;
