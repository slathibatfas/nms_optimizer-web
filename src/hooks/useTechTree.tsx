// src/hooks/useTechTree.tsx
import { API_URL } from "../constants";
import { useTechStore } from "../store/TechStore"; // Import useTechStore
import { useEffect } from "react";

// Define the structure of the tech tree data (replace with your actual type)
interface TechTreeItem {
  label: string;
  key: string;
  modules: { label: string; id: string; image: string; type?: string }[];
  image: string | null;
  color: string; // Add color property
}

interface TechTree {
  [key: string]: TechTreeItem[];
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

const cache = new Map<string, Resource<TechTree>>(); // Store successful fetches

/**
 * Fetches a tech tree by ship type and stores it in the cache.
 * If the resource is already in the cache, it will return the cached version.
 * @param {string} shipType - The type of ship to fetch the tech tree for. Defaults to "standard".
 * @returns {Resource<TechTree>} An object with a read method that can be used with React Suspense.
 */
function fetchTechTree(shipType: string = "standard"): Resource<TechTree> {
  const cacheKey = shipType;
  // Check if the resource is already in the cache
  if (!cache.has(cacheKey)) {
    // Create a promise to fetch the tech tree
    const promise = fetch(`${API_URL}/tech_tree/${shipType}`)
      .then((res) => {
        // Check for HTTP errors
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        // Return the JSON response
        return res.json();
      })
      .then((data: TechTree) => {
        console.log(`Fetched tech tree for ${shipType}:`, data); // Log the data here
        return data;
      });

    // Store the promise in the cache
    cache.set(cacheKey, createResource(promise));
  }

  // Return the cached resource
  return cache.get(cacheKey)!;
}

/**
 * Custom React hook to fetch a tech tree for a given ship type using Suspense.
 *
 * @param {string} shipType - The type of ship to fetch the tech tree for. Defaults to "standard".
 * @returns {TechTree} The fetched tech tree data for the specified ship type.
 */
export function useFetchTechTreeSuspense(shipType: string = "standard"): TechTree {
  const techTree = fetchTechTree(shipType).read();
  const { setTechColors } = useTechStore();

  // Extract and set tech colors when the tech tree is available
  useEffect(() => {
    const colors: { [key: string]: string } = {};
    for (const category in techTree) {
      techTree[category].forEach((tech) => {
        colors[tech.key] = tech.color;
      });
    }
    setTechColors(colors);
  }, [techTree, setTechColors]);

  return techTree;
}
