export default {
  testEnvironment: "node",      // Needed for Express + Supertest
  transform: {},                // Disable Babel transform, since Node ESM works natively
  verbose: true,                // Show detailed results
  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(test).js"], // Match `*.test.js`
};
