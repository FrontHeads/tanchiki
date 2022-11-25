import dotenv from 'dotenv';
dotenv.config();

export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  globals: {
    __SERVER_PORT__: process.env.SERVER_PORT || 3001,
  },
};
