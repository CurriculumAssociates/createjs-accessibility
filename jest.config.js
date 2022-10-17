module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected.
  // In this repo, were are using it to EXCLUDE the helper file __jestSharedSetup.js
  collectCoverageFrom: [
    'src/**/{!(__jestSharedSetup),}.(js|ts|tsx)',
  ],

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // This will be used to configure minimum threshold enforcement for coverage results.
  coverageThreshold: {
    global: {
      branches: 74,
      functions: 92,
      lines: 83,
      statements: 83,
    },
  },

  // The paths to modules that run some code to configure or set up the testing environment before
  // each test
  setupFiles: ['jest-canvas-mock'],

  // The test environment that will be used for testing
  testEnvironment: 'jsdom',

  // Define what files are included as tests
  testRegex: '.*\\/.+\\.test.(js|ts|tsx)$',
};
