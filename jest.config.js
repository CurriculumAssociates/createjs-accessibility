module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // This will be used to configure minimum threshold enforcement for coverage results.
  // coverageThreshold: {
  //   global: {
  //     branches: 10,
  //     functions: 5,
  //     lines: 8,
  //     statements: 8,
  //   },
  // },

  // The paths to modules that run some code to configure or set up the testing environment before
  // each test
  setupFiles: ['jest-canvas-mock'],

  // The test environment that will be used for testing
  testEnvironment: 'jsdom',
};
