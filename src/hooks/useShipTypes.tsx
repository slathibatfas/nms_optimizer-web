// src/hooks/useShipTypes.tsx
import { API_URL } from "../constants";
import { create } from "zustand";

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
  let status: "pending" | "success" | "error" = "pending"; // Initial status of the resource
  let result: T; // Variable to store the resolved value of the promise
  let error: Error; // Variable to store any error that occurs during promise resolution

  // Create a suspender by handling the promise
  const suspender = promise
    .then((res) => {
      status = "success"; // Update status to success when the promise resolves
      result = res; // Store the resolved value
    })
    .catch((err) => {
      status = "error"; // Update status to error if the promise rejects
      error = err; // Store the error
    });

  return {
    /**
     * Reads the resource, throwing if it's still pending or errored, or returning the result.
     *
     * @throws Will throw the promise if pending, or the error if there was an error.
     * @returns {T} The result of the promise if successful.
     */
    read() {
      if (status === "pending") throw suspender; // Throw the promise for suspense, if it's still pending
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

  if (!cache.has(cacheKey)) {
    // Create a promise to fetch the ship types
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
        // Check if it's a network error (e.g., connection refused)
        if (error instanceof TypeError && error.message === "Failed to fetch") {
          console.error("Likely a network issue or server not running.");
        }
        throw error; // Re-throw to be caught by Suspense
      });

    // Store the promise in the cache
    cache.set(cacheKey, createResource(promise));
  }

  // Return the cached resource
  return cache.get(cacheKey)!;
}
/**
 * Custom React hook to fetch ship types using Suspense.
 * Utilizes a cached resource to minimize unnecessary network requests.
 *
 * @returns {ShipTypes} The fetched ship types data.
 * @throws Will throw the promise if the fetch is pending, or an error if it failed.
 */
export function useFetchShipTypesSuspense(): ShipTypes {
  // Retrieve and return the ship types resource, triggering Suspense if necessary
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
