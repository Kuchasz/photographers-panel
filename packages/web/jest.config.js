/** @type {import('jest').Config} */
const config = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    testMatch: ['<rootDir>/**/*.test.{ts,tsx}'],
    moduleNameMapper: {
        '^@pp/(.*)$': '<rootDir>/../$1/src',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};

module.exports = config; 