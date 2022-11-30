import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import babel, { getBabelOutputPlugin } from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";

export default [
  // Configuration for NodeJS builds
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.js",
      format: "es",
      name: "bundle",
      sourcemap: "inline",
    },
    plugins: [
      typescript({
        tsconfig: "tsconfig.build.json",
      }),
      nodeResolve({
        preferBuiltins: true,
        jsnext: true,
        main: true,
      }),
      commonjs({
        include: ["node_modules/**"],
        sourceMap: true,
      }),
      json(),
    ],
  },
  // Configuration for Browser-based builds
  {
    input: "src/index.ts",
    output: {
      file: "dist/main.js",
      format: "cjs",
      name: "bundle",
      sourcemap: "inline",
      plugins: [
        getBabelOutputPlugin({
          sourceMaps: "both",
          presets: [
            [
              "@babel/preset-env",
              {
                targets: {
                  chrome: "88",
                  ie: "11",
                  edge: "88",
                  firefox: "79",
                  safari: "13.1.3",
                },
              },
            ],
          ],
        }),
      ],
    },
    plugins: [
      typescript({
        tsconfig: "tsconfig.build.json",
        compilerOptions: {
          target: "es6",
          lib: ["es6", "dom", "es2016", "es2017"],
        },
      }),
      nodeResolve({
        preferBuiltins: true,
        jsnext: true,
        main: true,
      }),
      commonjs({
        include: ["node_modules/**", "src/**"],
        sourceMap: true,
      }),
      babel({
        babelHelpers: "runtime",
        sourceMaps: "both",
      }),
      json(),
    ],
  },
];
