// src/hooks/useShipTypes.tsx
import { API_URL } from "../constants";
import { create } from "zustand";
import { useOptimizeStore } from "../store/OptimizeStore"; // Import useOptimizeStore

// Define the structure of the ship types data
export interface ShipTypes {
  [key: string]: string;
}

type Resource<T> = {
  read: () => T;
};

/**
 * Creates a resource from a promise, which can be used with React Suspense.
 *
 * @template T - The type of the resource.
 * @param {Promise<T>} promise - The promise to create the resource from.
 * @returns {Resource<T>} An object with a read method that will throw the promise
 * if the resource is pending, or the error if it failed, or return the result if successful.
 */
const createResource = <T,>(promise: Promise<T>): Resource<T> => {
  let status: "pending" | "success" | "error" = "pending";
  let result: T;
  let error: Error;

  // Create a suspender by handling the promise
  const suspender = promise
    .then((res) => {
      status = "success";
      result = res;
    })
    .catch((err) => {
      status = "error";
      error = err;
    });

  return {
    /**
     * Reads the resource, throwing if it's still pending or errored, or returning the result.
     *
     * @throws Will throw the promise if pending, or the error if there was an error.
     * @returns {T} The result of the promise if successful.
     */
    read() {
      if (status === "pending") throw suspender; // Throw the promise for suspense
      if (status === "error") throw error; // Throw the error if there was one
      return result!; // Return the result if successful
    },
  };
};

const cache = new Map<string, Resource<ShipTypes>>(); // Store successful fetches

/**
 * Fetches ship types and stores them in the cache.
 * If the resource is already in the cache, it will return the cached version.
 * @returns {Resource<ShipTypes>} An object with a read method that can be used with React Suspense.
 */
export function fetchShipTypes(): Resource<ShipTypes> {
  const cacheKey = "shipTypes";
  const { setShowError } = useOptimizeStore.getState();

  if (!cache.has(cacheKey)) {
    const promise = fetch(`${API_URL}/ship_types`)
      .then((res) => {
        // Check for HTTP errors (4xx or 5xx status codes)
        if (!res.ok) {
          console.error(`HTTP error fetching ship types: ${res.status} ${res.statusText}`);
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data: ShipTypes) => {
        console.log(`Fetched ship types:`, data);
        return data;
      })
      .catch((error) => {
        console.error("Error fetching ship types:", error);
        console.log("useShipTypes.tsx: catch block executed"); // Add this line
        // Check if it's a network error (e.g., connection refused)
        if (error instanceof TypeError && error.message === "Failed to fetch") {
          console.error("Likely a network issue or server not running.");
        }
        console.log("useShipTypes.tsx: setShowError(true) about to be called"); // Add this line
        setShowError(true); // Set showError to true on any error
        console.log("useShipTypes.tsx: setShowError(true) called"); // Add this line
        throw error; // Re-throw to be caught by Suspense
      });

    cache.set(cacheKey, createResource(promise));
  }

  return cache.get(cacheKey)!;
}
/**
 * Custom React hook to fetch ship types using Suspense.
 *
 * @returns {ShipTypes} The fetched ship types data.
 */
export function useFetchShipTypesSuspense(): ShipTypes {
  return fetchShipTypes().read();
}

// --- Zustand Store ---
interface ShipTypesState {
  shipTypes: ShipTypes | null; // shipTypes can be null initially
  selectedShipType: string;
  setSelectedShipType: (shipType: string) => void;
}

export const useShipTypesStore = create<ShipTypesState>((set) => ({
  shipTypes: null, // Initialize as null
  selectedShipType: (() => {
    // Read ship type from URL on initial load
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("ship") || "standard"; // Default to "standard" if not found
  })(),
  setSelectedShipType: (shipType) => {
    set({ selectedShipType: shipType });
    // Update URL when ship type changes
    const url = new URL(window.location.href);
    url.searchParams.set("ship", shipType);
    window.history.pushState({}, "", url);
  },
}));
