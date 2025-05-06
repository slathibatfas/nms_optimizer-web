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
  const { selectedShipType, setSelectedShipType } = useShipTypesStore();
  const { serializeGrid, deserializeGrid } = useGridDeserializer();

  // Effect to handle initial URL state and popstate events
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const platformFromUrl = urlParams.get("platform");
      const gridFromUrl = urlParams.get("grid");

      // Update shared state based on grid param presence
      setIsSharedGrid(!!gridFromUrl);

      // Update selected platform if it differs from URL
      if (platformFromUrl && platformFromUrl !== selectedShipType) {
        // Note: This might trigger a grid reset via the store's logic
        setSelectedShipType(platformFromUrl, false); // Pass false to prevent URL update loop
      }

      // If grid param exists and we're not already considered shared (or state changed), deserialize
      // Avoid re-deserializing if only the platform changed via popstate
      if (gridFromUrl && !isSharedGrid) {
         deserializeGrid(gridFromUrl);
      } else if (!gridFromUrl && isSharedGrid) {
         // If grid param removed via back/forward, reflect this
         setIsSharedGrid(false);
         // Optionally reset grid here if desired when navigating away from shared link
      }
    };

    // Initial check on mount
    handlePopState();

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
    // Dependencies: Include functions/state used inside handlePopState and its callees
  }, [setIsSharedGrid, selectedShipType, setSelectedShipType, deserializeGrid, isSharedGrid]);

  // Function to update URL when sharing
  const updateUrlForShare = useCallback(() => {
    const serializedGrid = serializeGrid();
    const url = new URL(window.location.href);
    url.searchParams.set("grid", serializedGrid);
    // Ensure platform is also in the shared URL
    url.searchParams.set("platform", selectedShipType);
    return url.toString();
  }, [serializeGrid, selectedShipType]);

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