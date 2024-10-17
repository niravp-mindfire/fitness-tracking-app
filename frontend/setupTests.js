// setupTests.js
require('@testing-library/jest-dom'); // Import jest-dom matchers

// Mock ResizeObserver
class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver; // Assign mock to global scope
