module.exports = {
  out: "docs",
  readme: "README.md",
  exclude: ["**/node_modules/**", "**/*.test.ts"],
  name: "CA Utils",
  entryPoints: ["packages/*"],
  entryPointStrategy: "packages",
  excludeExternals: true,
  excludePrivate: true,
  excludeInternal: true,
};
