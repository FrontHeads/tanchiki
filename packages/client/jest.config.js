import dotenv from 'dotenv';
dotenv.config();

export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass|png|svg|jpg)$': 'identity-obj-proxy',
  },
  globals: {
    __SERVER_PORT__: process.env.SERVER_PORT || 5000,
    __SLACK_FEEDBACK_WEBHOOK_URL__: process.env.__SLACK_FEEDBACK_WEBHOOK_URL__ || '',
  },
  setupFiles: ['<rootDir>/src/tests/setup.ts', 'jest-canvas-mock'],
};
