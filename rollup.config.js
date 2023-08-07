import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from "rollup-plugin-node-resolve";
import external from 'rollup-plugin-peer-deps-external';
import typescript from '@rollup/plugin-typescript';
const packageJson = require("./package.json");

export default {
    input: 'src/index.ts',
    output: {
        file: './client/index.js',
        format: "umd",
        sourcemap: true,
        name: 'rax'
    },
    plugins: [
        external(),
        resolve(),
        commonjs(),
        typescript({ compilerOptions: {lib: ["es5", "es6", "dom"], target: "es5"}}),
        babel({
            exclude: 'node_modules/**',
            extensions: ['.ts', '.js'],
            presets: [
              '@babel/preset-env',
              '@babel/preset-typescript'
            ]
          }),
        // uglify()
    ],
    external: ['react', 'react-dom']
}

//    "main": "dist/cjs/index.js",
//   "module": "dist/esm/index.js",
