module.exports = {
  testMatch: ["<rootDir>/**/*.test.{ts,js}"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
  reporters: ["default", ["jest-junit", { outputDirectory: "./reports/" }]],
  coverageReporters: ["text", "cobertura"],
  coverageDirectory: "./reports/coverage",
  globals: {
    __TEST__: true,
    __DEVELOPMENT__: false,
    __PRODUCTION__: false,
  },
};
