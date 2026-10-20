import { vi } from 'vitest';

// Installs a no-op ResizeObserver for tests that do not need layout measurements.
export function stubResizeObserver() {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      disconnect() {}
    },
  );
}
