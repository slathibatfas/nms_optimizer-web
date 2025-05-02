/** @type {import('jest').Config} */
const config = {
  // Use ts-jest's ESM preset
  preset: 'ts-jest/presets/default-esm', // or 'ts-jest/presets/js-with-ts-esm'
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.ts', '.tsx'], // Treat these as ESM
  moduleNameMapper: {
    // Handle ESM module resolution for ts-jest
    '^(\\.{1,2}/.*)\\.js$': '$1',
    // Your existing alias
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  transform: {
    // Use ts-jest's ESM transformer
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: '<rootDir>/tsconfig.json', // Explicitly point to the tsconfig
      },
    ],
  },
};

module.exports = config;
