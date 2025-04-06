// src/components/MessageSpinner/MessageSpinner.tsx
import { Text } from "@radix-ui/themes";
import React, { useState, useEffect } from "react";

interface MessageSpinnerProps {
  solving: boolean;
  initialMessage: string; // Required initial message prop
}

/**
 * MessageSpinner component that displays a loading spinner overlay when solving is true.
 *
 * @param {MessageSpinnerProps} props - The properties passed to the component.
 * @param {boolean} props.solving - Determines whether the spinner is visible.
 * @param {string} props.initialMessage - The initial message to display.
 * @returns {JSX.Element | null} The rendered spinner element or null.
 */
const MessageSpinner: React.FC<MessageSpinnerProps> = ({ solving, initialMessage }) => {
  const [showAdditionalMessage, setShowAdditionalMessage] = useState(false);

  useEffect(() => {
    if (solving) {
      const timer = setTimeout(() => setShowAdditionalMessage(true), 2500);
      return () => clearTimeout(timer);
    } else {
      setShowAdditionalMessage(false);
    }
  }, [solving]);

  if (!solving) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-opacity-75 rounded-lg">
      <div className="w-16 h-16 border-8 rounded-full border-slate-600 animate-spin messageSpinner"></div>
      <Text className="pt-4 text-2xl font-semibold !tracking-widest messageSpinner__header">{initialMessage}</Text>
      {showAdditionalMessage ? (
        <Text className="text-center" style={{ color: "#e6c133" }}>
          {`-{{ Attempting to refine the solution! }}-`}
        </Text>
      ) : (
        <Text style={{ color: "#e6c133" }}>
          <br />
        </Text>
      )}
    </div>
  );
};

export default MessageSpinner;
