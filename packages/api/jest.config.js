/** @type {import('jest').Config} */
const config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['<rootDir>/**/*.test.ts'],
    moduleNameMapper: {
        '^@pp/(.*)$': '<rootDir>/../$1/src',
    },
};

module.exports = config; 