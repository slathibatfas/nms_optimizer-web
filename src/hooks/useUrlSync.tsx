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
      console.log("useUrlSync: handlePopState triggered or initial load.");
      const urlParams = new URLSearchParams(window.location.search);
      const platformFromUrl = urlParams.get("platform");
      const gridFromUrl = urlParams.get("grid");

      // Sync platform from URL to store
      // Pass `false` to setSelectedShipTypeInStore to prevent it from pushing a new history state,
      // as this function is reacting to an existing URL state (either initial or from popstate).
      if (platformFromUrl && platformFromUrl !== selectedShipTypeFromStore) {
        console.log(`useUrlSync: Platform in URL ('${platformFromUrl}') differs from store ('${selectedShipTypeFromStore}'). Updating store.`);
        setSelectedShipTypeInStore(platformFromUrl, false);
      }

      // Sync grid from URL to store
      if (gridFromUrl) {
        console.log("useUrlSync: Grid data found in URL. Deserializing.");
        deserializeGrid(gridFromUrl); // This will call setIsSharedGrid(true) internally if successful
      } else {
        // No grid data in URL
        if (isSharedGrid) { // If store thought it was shared, but URL no longer has grid
          console.log("useUrlSync: No grid data in URL, but store was shared. Setting isSharedGrid to false.");
          setIsSharedGrid(false);
          // Consider if gridStore.resetGrid() should be called here if navigating away from a shared link.
          // For now, just updating the flag. App.tsx can react to isSharedGrid changes.
        }
      }
    };

    // Initial check on mount
    handlePopState();

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [selectedShipTypeFromStore, setSelectedShipTypeInStore, deserializeGrid, setIsSharedGrid, isSharedGrid]);

  // Function to update URL when sharing
  const updateUrlForShare = useCallback(() => {
    const serializedGrid = serializeGrid();
    const url = new URL(window.location.href);
    url.searchParams.set("grid", serializedGrid);
    // Ensure platform is also in the shared URL
    url.searchParams.set("platform", selectedShipTypeFromStore);
    return url.toString();
  }, [serializeGrid, selectedShipTypeFromStore]);

  // Function to update URL on reset (removes grid param)
  const updateUrlForReset = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete("grid");
    window.history.pushState({}, "", url.toString()); // Use pushState to allow going back
  }, []);

  // No explicit return needed if the hook only manages side effects,
  // but could return update functions if preferred over direct calls in App.tsx
  return { updateUrlForShare, updateUrlForReset };
};