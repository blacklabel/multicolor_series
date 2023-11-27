import type { Config } from 'jest';

const config: Config = {
    preset: "ts-jest",
    clearMocks: true,
    testEnvironment: "jest-environment-jsdom",
    modulePaths: ["."],
    // TO DO: remove once refactored the coloredarea series.
    testPathIgnorePatterns: ["tests/jest-snapshot/coloredarea-series.test.ts"]
};

export default config;
