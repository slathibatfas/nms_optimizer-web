// src/hooks/useUrlSync.tsx
import { useEffect, useCallback } from "react";
import { useGridStore } from "../store/GridStore";
import { useShipTypesStore } from "./useShipTypes";
import { useGridDeserializer } from "./useGridDeserializer";

/**
 * Hook to synchronize application state (selected platform, grid)
 * with the browser URL query parameters.
 */
export const useUrlSync = () => {
  const { setIsSharedGrid, isSharedGrid } = useGridStore();
  const selectedShipTypeFromStore = useShipTypesStore((state) => state.selectedShipType);
  const setSelectedShipTypeInStore = useShipTypesStore((state) => state.setSelectedShipType);
  const { serializeGrid, deserializeGrid } = useGridDeserializer();

  // Effect to handle initial URL state and popstate events
  useEffect(() => {
    const handlePopState = () => {
      // console.log("useUrlSync: handlePopState triggered or initial load.");
      const urlParams = new URLSearchParams(window.location.search);
      const platformFromUrl = urlParams.get("platform");
      const gridFromUrl = urlParams.get("grid");

      // Sync platform from URL to store
      if (platformFromUrl && platformFromUrl !== selectedShipTypeFromStore) {
        // console.log(`useUrlSync: Platform in URL ('${platformFromUrl}') differs from store ('${selectedShipTypeFromStore}'). Updating store.`);
        setSelectedShipTypeInStore(platformFromUrl, false);
      }

      // Sync grid from URL to store
      if (gridFromUrl) {
        // If a grid is present in the URL, we are trying to load a shared grid.
        // Step 1: Ensure the application knows this is a shared grid context.
        // `isSharedGrid` here is from the store, potentially hydrated from localStorage.
        if (!isSharedGrid) { // If the store currently thinks it's NOT a shared grid
          setIsSharedGrid(true); // Tell the store it IS a shared grid context NOW.
          // By returning here, we allow this useEffect to re-run because `isSharedGrid` is a dependency.
          // On the next run, `isSharedGrid` (from the store) will be true.
          return;
        }
        // Step 2: `isSharedGrid` is now true (or was already true). Proceed to deserialize.
        // `deserializeGrid` itself will call `setGrid` and `setIsSharedGrid(true)` again,
        // ensuring the state is correctly updated with the grid from the URL.
        deserializeGrid(gridFromUrl);
      } else {
        // No grid in URL.
        // If the store currently thinks it's a shared grid (e.g., from a previous shared link
        // or persisted state), set `isSharedGrid` to false, as the current URL
        // doesn't represent a shared grid.
        if (isSharedGrid) { 
          setIsSharedGrid(false);
        }
      }
    };
    
    // Initial check on mount, delayed slightly to allow router to initialize
    const timerId = setTimeout(() => {
      handlePopState();
    }, 0);

    window.addEventListener("popstate", handlePopState);
    return () => {
      clearTimeout(timerId); // Ensure the timeout is cleared on unmount
      window.removeEventListener("popstate", handlePopState);
    };
  }, [selectedShipTypeFromStore, setSelectedShipTypeInStore, deserializeGrid, setIsSharedGrid, isSharedGrid]);

  // Function to update URL when sharing
  const updateUrlForShare = useCallback(() => {
    const serializedGrid = serializeGrid();
    const url = new URL(window.location.href);
    url.searchParams.set("grid", serializedGrid);
    url.searchParams.set("platform", selectedShipTypeFromStore);
    return url.toString();
  }, [serializeGrid, selectedShipTypeFromStore]);

  // Function to update URL on reset (removes grid param)
  const updateUrlForReset = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete("grid");
    window.history.pushState({}, "", url.toString()); 
  }, []);

  return { updateUrlForShare, updateUrlForReset };
};
