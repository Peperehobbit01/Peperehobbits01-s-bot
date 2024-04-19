/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: [
      '/node_modules/',
      '/tests/'
  ],
  testMatch: [
      '**/tests/**',
      '!**/tests/**/example.ts',
  ],
};