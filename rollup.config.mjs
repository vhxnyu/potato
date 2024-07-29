import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'
import pkg from './package.json' assert { type: 'json' }

export default [
  // node
  {
    input: './src/index.ts',
    external: Object.keys(pkg.dependencies),
    output: [
      {
        dir: 'dist',
        format: 'cjs',
        entryFileNames: '[name].cjs',
        plugins: [],
        exports: 'named',
      },
      {
        dir: 'dist',
        format: 'esm',
        entryFileNames: '[name].mjs',
        exports: 'named',
      },
    ],
    plugins: [commonjs(), typescript({ module: 'esnext' })],
  },
  // zdjl cjs
  {
    input: './src/index.ts',
    external: ['axios'],
    output: {
      dir: 'dist',
      format: 'cjs',
      entryFileNames: '[name].zdjl.min.cjs',
      paths: {
        axios: 'axios@1.6.8/dist/axios.min.js',
      },
      exports: 'named',
    },
    plugins: [resolve(), commonjs(), typescript({ module: 'esnext' }), terser()],
  },
]
