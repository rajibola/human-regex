import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/human-regex.ts",
  output: [
    {
      file: "dist/human-regex.esm.js",
      format: "esm",
      sourcemap: true,
    },
    {
      file: "dist/human-regex.cjs.js",
      format: "cjs",
      sourcemap: true,
    },
  ],
  plugins: [resolve(), commonjs(), typescript(), terser()],
};
