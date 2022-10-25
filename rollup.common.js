import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import babel, { getBabelOutputPlugin } from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";

export default [
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.js",
      format: "es",
      name: "bundle",
      sourcemap: true,
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
      }),
      json(),
    ],
  },
  {
    input: "src/index.ts",
    output: {
      file: "dist/main.js",
      format: "cjs",
      name: "bundle",
      sourcemap: true,
      plugins: [
        getBabelOutputPlugin({
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
          target: "es5",
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
      }),
      babel({
        babelHelpers: "runtime",
      }),
      json(),
    ],
  },
];
