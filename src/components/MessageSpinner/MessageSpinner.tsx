// src/components/MessageSpinner/MessageSpinner.tsx
import { Text, Spinner } from "@radix-ui/themes";
import React, { useState, useEffect } from "react";


interface MessageSpinnerProps {
  isVisible: boolean;
  isInset?: boolean;
  initialMessage: string;
  showRandomMessages?: boolean;
  color?: string;
}

// --- Define your random messages here (remains the same) ---
const randomMessages = [
  "-{{ Asking the Atlas for guidance! }}-",
  "-{{ Recalibrating supercharge node alignments! }}-",
  "-{{ Harmonizing upgrade stack interactions! }}-",
  "-{{ Polishing the chrome! }}-",
  "-{{ Just a few more calculations... honest! }}-",
  "-{{ Attempting to refine the solution! }}-",
  "-{{ Debugging plasma injector routines! }}-",
  "-{{ Checking for Geknip residue! }}-",
  "-{{ Don't worry, I know a guy! }}-",
  "-{{ Interfacing with anomaly schematics! }}-",
  "-{{ Compiling multi-threaded tech stack! }}-",
  "-{{ Decrypting legacy tech artifacts! }}-",
  "-{{ Optimizing the optimization! }}-",
  "-{{ Harmonizing upgrade stack interactions! }}-",
  "-{{ If you think you can fit more than two weapons in here, you're high on NipNip! }}-",
  "-{{ I'm a highly trained Neural Network, not a miracle worker! }}-",
];
// --- End of random messages ---

/**
 * MessageSpinner component that displays a loading spinner overlay.
 * Can optionally show random messages after a delay for longer operations.
 */
const MessageSpinner: React.FC<MessageSpinnerProps> = ({ isInset = true, isVisible, initialMessage, showRandomMessages = false }) => {
  const [showAdditionalMessage, setShowAdditionalMessage] = useState(false);
  const [currentRandomMessage, setCurrentRandomMessage] = useState<string>("");

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    // Only run the random message logic if showRandomMessages is true and the spinner is visible
    if (showRandomMessages && isVisible) {
      setShowAdditionalMessage(false); // Reset visibility when conditions change
      setCurrentRandomMessage(""); // Clear previous message

      timer = setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * randomMessages.length);
        setCurrentRandomMessage(randomMessages[randomIndex]);
        setShowAdditionalMessage(true); // Set to show after delay
      }, 2500); // Delay before showing random message

      // Cleanup function
      return () => {
        if (timer) clearTimeout(timer);
      };
    } else {
      // Ensure state is reset if conditions aren't met
      setShowAdditionalMessage(false);
      setCurrentRandomMessage("");
    }
    // Depend on both isVisible and showRandomMessages
  }, [isVisible, showRandomMessages]);

  // Use the isVisible prop to control rendering of the entire component
  if (!isVisible) return null;

  // Determine if the random message should be displayed based on state and props
  const displayRandomMessage = showRandomMessages && showAdditionalMessage;

    // Conditionally add classes based on isInset
    const containerClasses = `
    z-50 flex flex-col items-center justify-center bg-opacity-50
    ${isInset ? "absolute inset-0" : ""}
  `;

  return (
    // Restore original container class
    <div className={containerClasses.trim()}>
      <Spinner className="messageSpinner__spinner"/>
      
      {initialMessage && (
      <Text className="pt-4 text-xl font-bold shadow-sm sm:text-2xl messageSpinner__header">{initialMessage}</Text>
      )}
      <Text
        className="text-sm font-semibold text-center shadow-sm sm:text-normal messageSpinner__random"
        style={{
          color: displayRandomMessage ? "#e6c133" : "transparent", // Use transparent color to hide when not ready/enabled
          minHeight: "1.5em", // Maintain minimum height to prevent layout shift (adjust as needed)
          userSelect: "none", // Prevent selecting the placeholder space
        }}
      >
        {displayRandomMessage ? currentRandomMessage : "\u00A0"}
      </Text>
    </div>
  );
};

export default MessageSpinner;
