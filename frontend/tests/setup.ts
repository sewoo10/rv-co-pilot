const { expect } = require('chai');
import { vi } from 'vitest';

// Define React Native global variables for test environment
global.__DEV__ = true;

// Mock expo-secure-store
vi.mock('expo-secure-store', () => ({
  setItemAsync: vi.fn(() => Promise.resolve()),
  getItemAsync: vi.fn(() => Promise.resolve(null)),
  deleteItemAsync: vi.fn(() => Promise.resolve()),
}));

beforeEach(() => {
    // Setup code for tests
});

afterEach(() => {
    // Cleanup code for tests
});