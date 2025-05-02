
 // src/setupTests.ts
 import '@testing-library/jest-dom';
 
// Mock import.meta.env for Jest environments
// Vite automatically provides import.meta.env in development and build,
// but Jest needs it defined explicitly.
Object.defineProperty(global, 'import.meta', {
  value: {
    env: {
      // Provide a default value for VITE_API_URL for tests
      VITE_API_URL: 'http://mock-api.test',
      // Add any other VITE_ variables your application uses here
    },
  },
  writable: true, // Allows tests to potentially override specific env vars if needed
});
