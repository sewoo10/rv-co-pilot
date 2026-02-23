import { vi } from 'vitest';

// Mock React Native Platform
vi.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: (options: any) => options.ios || options.default,
  },
}));
