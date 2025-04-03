// src/hooks/useSSE.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import { API_URL } from "../constants";

interface UseSSEReturn {
  startStream: () => void;
  stopStream: () => void;
  messages: SSEMessage[];
  isStreamActive: boolean;
}

interface SSEMessage {
  type: string;
  message: string;
}

// Helper function for logging (can be expanded for different log levels)
const log = (message: string, data?: unknown) => {
  if (process.env.NODE_ENV === "development") {
    console.log(message, data || "");
  }
};

export const useSSE = (): UseSSEReturn => {
  const sseSourceRef = useRef<EventSource | null>(null);
  const [messages, setMessages] = useState<SSEMessage[]>([]);
  const [isStreamActive, setIsStreamActive] = useState(false);

  const stopStream = useCallback(() => {
    console.log("useSSE.tsx: stopStream called"); // Added console.log
    if (sseSourceRef.current) {
      log("Closing SSE connection.");
      sseSourceRef.current.close();
      sseSourceRef.current = null;
      setIsStreamActive(false);
      setMessages([]);
    }
  }, []);

  const startStream = useCallback(() => {
    console.log("useSSE.tsx: startStream called"); // Added console.log
    if (sseSourceRef.current) {
      log("SSE connection already active.");
      return;
    }

    const currentSseSource = new EventSource(`${API_URL}/stream`);
    sseSourceRef.current = currentSseSource;
    setIsStreamActive(true);

    currentSseSource.onopen = () => {
      console.log("useSSE.tsx: SSE connection opened."); // Added console.log
      log("SSE connection opened.");
    };

    currentSseSource.onmessage = (event) => {
      console.log("useSSE.tsx: SSE onmessage triggered"); // Added console.log
      log("Raw SSE message received:", event);
      try {
        const data = JSON.parse(event.data);
        log("Parsed SSE message:", data as SSEMessage);
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages, data];
          console.log("useSSE.tsx: messages updated:", newMessages); // Added console.log
          return newMessages;
        });
      } catch (error) {
        log("Error parsing SSE message:", error);
        log("Raw SSE message:", event.data);
      }
    };

    currentSseSource.onerror = (error) => {
      console.error("useSSE.tsx: SSE onerror triggered", error); // Added console.log
      stopStream();
    };
  }, [stopStream]); // Added stopStream to the dependency array

  useEffect(() => {
    return () => {
      stopStream();
    };
  }, [stopStream]);

  return { startStream, stopStream, messages, isStreamActive };
};
