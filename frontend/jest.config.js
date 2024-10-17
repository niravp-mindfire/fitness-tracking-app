module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}', // include all source files
    '!src/**/*.d.ts', // exclude type declaration files
    '!src/index.tsx', // exclude entry point if you don't want it in the coverage report
  ],
  coverageDirectory: 'coverage', // Directory where Jest should output its coverage files
  coverageReporters: ['json', 'lcov', 'text', 'clover'], // Types of reports to generate
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
};
