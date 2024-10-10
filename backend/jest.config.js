module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.ts'], // Adjust path to include your src files
    testMatch: ['**/*.test.ts'],
    moduleFileExtensions: ['js', 'ts', 'json'],
};
