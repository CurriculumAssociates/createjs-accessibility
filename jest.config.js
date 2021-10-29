module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // The test environment that will be used for testing
  testEnvironment: 'jsdom',

  // A map from regular expressions to paths to transformers
  // transform: {
  //   '^.+\\.jsx$': 'babel-jest',
  //   '^.+\\.js$': 'babel-jest'
  // },

  // The paths to modules that run some code to configure or set up the testing environment before each test
  setupFiles: ['jest-canvas-mock'],
};
