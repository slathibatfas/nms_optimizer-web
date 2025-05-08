// src/setup.ts

import '@testing-library/jest-dom'; // Adds custom matchers like toBeInTheDocument()
import { vi } from 'vitest';

// Example: mock window.scrollTo if needed
Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true,
});