/** @type {import('jest').Config} */
const config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    projects: [
        '<rootDir>/packages/utils/jest.config.js',
        '<rootDir>/packages/api/jest.config.js',
        '<rootDir>/packages/web/jest.config.js',
    ],
};

module.exports = config; 