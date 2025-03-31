// src/hooks/useGridDeserializer.ts
import { useCallback, useEffect } from "react";
import { useGridStore, Grid, Cell } from "../store/useGridStore";
import { API_URL } from "../constants";
import { useShipTypesStore } from "./useShipTypes"; // Import useShipTypesStore

interface Module {
  id: string;
  type: string;
  label: string;
  image: string;
  bonus?: number;
  value?: number;
  adjacency: boolean;
  sc_eligible: boolean;
  // Add other properties as needed
}

interface TechTreeItem {
  label: string;
  key: string;
  modules: Module[]; // Array of modules
  image: string | null;
  color: string;
}

interface TechTree {
  [key: string]: TechTreeItem[];
}

// --- Utility Functions ---
const compressRLE = (input: string): string => {
  if (!input) return "";
  let compressed = "";
  let count = 1;
  for (let i = 0; i < input.length; i++) {
    if (i + 1 < input.length && input[i] === input[i + 1]) {
      count++;
    } else {
      compressed += input[i];
      if (count > 1) {
        compressed += count.toString();
      }
      count = 1;
    }
  }
  return compressed;
};

const decompressRLE = (input: string): string => {
  if (!input) return "";
  let decompressed = "";
  for (let i = 0; i < input.length; i++) {
    if (isNaN(parseInt(input[i + 1]))) {
      decompressed += input[i];
    } else {
      const count = parseInt(input[i + 1]);
      decompressed += input[i].repeat(count);
      i++;
    }
  }
  return decompressed;
};

const createEmptyCell = (supercharged = false, active = true): Cell => ({
  active,
  adjacency: false,
  adjacency_bonus: 0.0,
  bonus: 0.0,
  image: null,
  module: null,
  label: "",
  sc_eligible: false,
  supercharged: supercharged,
  tech: null,
  total: 0.0,
  type: "",
  value: 0,
});

const createGrid = (width: number, height: number): Grid => ({
  cells: Array.from({ length: height }, () =>
    Array.from({ length: width }, () => createEmptyCell(false, true))
  ),
  width,
  height,
});

// --- Grid Serialization/Deserialization Logic ---
const serialize = (grid: Grid): string => {
  let gridString = "";
  const techMap: { [key: string]: string } = {};
  const moduleMap: { [key: string]: string } = {};
  let nextTechCode = 3;
  let nextModuleCode = 0;
  let techString = "";
  let moduleString = "";

  for (const row of grid.cells) {
    for (const cell of row) {
      gridString += cell.active ? (cell.supercharged ? "2" : "1") : "0";
      techString += cell.tech ? (techMap[cell.tech] || (techMap[cell.tech] = String.fromCharCode(nextTechCode++))) : " ";
      moduleString += cell.module ? (moduleMap[cell.module] || (moduleMap[cell.module] = String.fromCharCode(nextModuleCode++ + 65))) : " ";
    }
  }

  const compressedTech = compressRLE(techString);
  const compressedModule = compressRLE(moduleString);
  const techMapString = Object.entries(techMap).map(([key, value]) => `${key}:${value}`).join(",");
  const moduleMapString = Object.entries(moduleMap).map(([key, value]) => `${key}:${value}`).join(",");
  return encodeURIComponent(`${gridString}|${compressedTech}|${compressedModule}|${techMapString}|${moduleMapString}`);
};

const deserialize = async (serializedGrid: string, shipType: string): Promise<Grid | null> => {
  try {
    if (!serializedGrid) {
      console.warn("No serialized grid data found. Skipping deserialization.");
      return null;
    }

    const decoded = decodeURIComponent(serializedGrid);
    if (!decoded) {
      console.error("Failed to decodeURIComponent. Skipping deserialization.");
      return null;
    }

    const [gridString, compressedTech, compressedModule, techMapString, moduleMapString] = decoded.split("|");

    // Check for undefined parts
    if ([gridString, compressedTech, compressedModule, techMapString, moduleMapString].some((part) => part === undefined)) {
      console.error("Invalid serialized grid format. Missing parts. Skipping deserialization.");
      return null;
    }

    if (gridString.length !== 60) {
      console.error("Invalid serialized grid format: gridString length is not 60. Skipping deserialization.");
      return null;
    }

    const decompressedTech = decompressRLE(compressedTech);
    const decompressedModule = decompressRLE(compressedModule);
    const techMap = techMapString.split(",").reduce((acc: { [key: string]: string }, entry) => {
      const [key, value] = entry.split(":");
      acc[value] = key;
      return acc;
    }, {});
    const moduleMap = moduleMapString.split(",").reduce((acc: { [key: string]: string }, entry) => {
      const [key, value] = entry.split(":");
      acc[value] = key;
      return acc;
    }, {});

    const newGrid = createGrid(10, 6);
    let index = 0;

    // Fetch modules directly here, using the shipType
    const modulesResponse = await fetch(`${API_URL}/tech_tree/${shipType}`);
    if (!modulesResponse.ok) {
      throw new Error(`Failed to fetch modules: ${modulesResponse.status} ${modulesResponse.statusText}`);
    }
    const techTreeData: TechTree = await modulesResponse.json();

    // Create a map of modules keyed by tech type and module ID
    const modulesMap: { [techKey: string]: { [moduleId: string]: Module } } = {};
    for (const techCategory in techTreeData) {
      const techTreeItems = techTreeData[techCategory];
      for (const techTreeItem of techTreeItems) {
        modulesMap[techTreeItem.key] = {}; // Initialize the tech type if it doesn't exist
        for (const module of techTreeItem.modules) {
          modulesMap[techTreeItem.key][module.id] = module;
        }
      }
    }

    // Log the modulesMap for inspection
    console.log("useGridDeserializer.tsx: modulesMap:", modulesMap);

    for (let r = 0; r < newGrid.height; r++) {
      for (let c = 0; c < newGrid.width; c++) {
        const char = gridString[index];
        newGrid.cells[r][c].active = char !== "0";
        newGrid.cells[r][c].supercharged = char === "2";
        const techChar = decompressedTech[index];
        const techName = techChar === " " ? null : techMap[techChar];
        const moduleChar = decompressedModule[index];
        const moduleName = moduleChar === " " ? null : moduleMap[moduleChar];

        newGrid.cells[r][c].tech = techName;

        if (moduleName && techName) {
          const moduleData = modulesMap[techName]?.[moduleName]; // Look up by tech type and module ID
          if (moduleData) {
            newGrid.cells[r][c].module = moduleData.id;
            newGrid.cells[r][c].type = moduleData.type;
            newGrid.cells[r][c].label = moduleData.label;
            newGrid.cells[r][c].image = moduleData.image;
            newGrid.cells[r][c].bonus = moduleData.bonus || 0.0;
            newGrid.cells[r][c].value = moduleData.value || 0;
            newGrid.cells[r][c].adjacency = moduleData.adjacency;
            newGrid.cells[r][c].sc_eligible = moduleData.sc_eligible;
          } else {
            console.warn(`Module not found for tech: ${techName}, module: ${moduleName}`);
          }
        }
        index++;
      }
    }
    return newGrid;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error deserializing grid:", error.message);
    } else {
      console.error("An unknown error occurred during grid deserialization:", error);
    }
    return null;
  }
};

// --- React Hook ---
export const useGridDeserializer = () => {
  const { setGrid, grid } = useGridStore();
  const selectedShipType = useShipTypesStore((state) => state.selectedShipType); // Get selectedShipType

  const serializeGrid = useCallback((): string => {
    return serialize(grid);
  }, [grid]);

  const deserializeGrid = useCallback(async (serializedGrid: string) => {
    const newGrid = await deserialize(serializedGrid, selectedShipType); // Pass selectedShipType
    if (newGrid) {
      console.log("useGridDeserializer.tsx: Deserialized Grid:", newGrid); // Log the newGrid object
      setGrid(newGrid);
    }
  }, [setGrid, selectedShipType]); // Add selectedShipType to the dependency array

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const serializedGrid = urlParams.get("grid");
    if (serializedGrid) {
      deserializeGrid(serializedGrid);
    }
  }, [deserializeGrid]);

  return { serializeGrid, deserializeGrid };
};
