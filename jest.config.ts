import type { Config } from 'jest';

const config: Config = {
    preset: "ts-jest",
    clearMocks: true,
    testEnvironment: "jest-environment-jsdom",
    modulePaths: ["."]
};

export default config;
