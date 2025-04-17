// src/hooks/useShipTypes.tsx
import { API_URL } from "../constants";
import { create } from "zustand";

// Define the structure for the details of a single ship type
export interface ShipTypeDetail {
  label: string;
  type: string; // You could potentially use a union type like 'Starship' | 'Multi-Tool' if the types are fixed
}

// Define the structure of the ship types data using the detailed interface
export interface ShipTypes {
  [key: string]: ShipTypeDetail;
}

type Resource<T> = {
  read: () => T;
};

/**
 * Creates a resource from a promise, which can be used with React Suspense.
 * (Implementation remains the same)
 */
const createResource = <T,>(promise: Promise<T>): Resource<T> => {
  // ... (createResource implementation as before)
  let status: "pending" | "success" | "error" = "pending";
  let result: T;
  let error: Error;

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
    read() {
      if (status === "pending") throw suspender;
      if (status === "error") throw error;
      return result!;
    },
  };
};


// Store successful fetches - Note: The type parameter for Resource is now the updated ShipTypes
const cache = new Map<string, Resource<ShipTypes>>();

/**
 * Fetches ship types and stores them in the cache.
 * (Implementation remains the same)
 */
export function fetchShipTypes(): Resource<ShipTypes> {
  // ... (fetchShipTypes implementation as before)
  const cacheKey = "shipTypes";

  if (!cache.has(cacheKey)) {
    const promise = fetch(`${API_URL}/platforms`)
      .then((res) => {
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
        if (error instanceof TypeError && error.message === "Failed to fetch") {
          console.error("Likely a network issue or server not running.");
        }
        throw error;
      });

    cache.set(cacheKey, createResource(promise));
  }
  return cache.get(cacheKey)!;
}

/**
 * Custom React hook to fetch ship types using Suspense.
 * (Implementation remains the same)
 */
export function useFetchShipTypesSuspense(): ShipTypes {
  return fetchShipTypes().read();
}

// --- Zustand Store ---
export interface ShipTypesState {
  shipTypes: ShipTypes | null;
  selectedShipType: string;
  setSelectedShipType: (shipType: string) => void;
}

const LOCAL_STORAGE_KEY = 'selectedPlatform';

export const useShipTypesStore = create<ShipTypesState>((set) => {
  // --- Logic to read initial state and update URL/localStorage if needed ---
  const urlParams = new URLSearchParams(window.location.search);
  const platformFromUrl = urlParams.get("platform");
  const platformFromStorage = localStorage.getItem(LOCAL_STORAGE_KEY);

  let initialShipType: string;
  let updateUrlNeeded = false;
  let updateStorageNeeded = false;

  if (platformFromUrl) {
    // 1. Priority: URL parameter (for shared links)
    initialShipType = platformFromUrl;
    // Ensure localStorage matches the URL param
    if (platformFromStorage !== initialShipType) {
        localStorage.setItem(LOCAL_STORAGE_KEY, initialShipType);
        console.log(`useShipTypesStore: Initialized from URL param '${initialShipType}', updated localStorage.`);
    } else {
        console.log(`useShipTypesStore: Initialized from URL param '${initialShipType}'.`);
    }
  } else if (platformFromStorage) {
    // 2. Priority: LocalStorage (user's last selection)
    initialShipType = platformFromStorage;
    updateUrlNeeded = true; // Update URL to reflect the stored value
    console.log(`useShipTypesStore: Initialized from localStorage '${initialShipType}', will update URL.`);
  } else {
    // 3. Fallback: Default to "standard"
    initialShipType = "standard";
    updateUrlNeeded = true; // Update URL with the default
    updateStorageNeeded = true; // Store the default
    console.log(`useShipTypesStore: No URL param or localStorage found. Defaulting to '${initialShipType}', will update URL and localStorage.`);
  }

  // Update the URL *after* determining the initial state, only if needed
  if (updateUrlNeeded) {
    const url = new URL(window.location.href);
    url.searchParams.set("platform", initialShipType);
    // Use replaceState so navigating back doesn't go to the URL without the param
    window.history.replaceState({}, '', url.toString());
    console.log("useShipTypesStore: Updated URL.");
  }

  // Update localStorage if needed (only when defaulting)
  if (updateStorageNeeded) {
    localStorage.setItem(LOCAL_STORAGE_KEY, initialShipType);
    console.log("useShipTypesStore: Updated localStorage with default.");
  }
  // --- End of initial state logic ---

  return {
    shipTypes: null, // Initialize as null
    selectedShipType: initialShipType, // Use the determined initial type
    setSelectedShipType: (shipType) => {
      set({ selectedShipType: shipType });

      // Update localStorage
      localStorage.setItem(LOCAL_STORAGE_KEY, shipType);
      console.log(`useShipTypesStore: Set selectedShipType to '${shipType}' and updated localStorage.`);

      // Update URL
      const url = new URL(window.location.href);
      url.searchParams.set("platform", shipType);
      // Use pushState for user-driven changes to add to history
      window.history.pushState({}, "", url);
    },
  };
});
