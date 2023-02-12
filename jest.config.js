/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  coverageDirectory: "./coverage",
  testMatch: ["**/?(*.)+(spec).ts"],
  moduleDirectories: ["node_modules", "<rootDir>/src"],
  resetMocks: true,
  clearMocks: true,
  setupFiles: ["dotenv/config"],
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  moduleFileExtensions: [
    "ts",
    "js",
    "json",
    "node"
  ],
  collectCoverageFrom: [
    "src/**/*.{ts,js}",
    "!src/**/*.d.ts"
  ]
};