export default {
  collectCoverageFrom: ["index.js"],
  coverageThreshold: {
    global: {
      branches: 65,
      functions: 100,
      lines: 95,
      statements: 95,
    },
  },
};
