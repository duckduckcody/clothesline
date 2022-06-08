/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ['configs/**/*.ts', 'utils/**/*.ts', 'scripts/**/*.ts'],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules',
    '<rootDir>/apify_storage',
  ],
};
