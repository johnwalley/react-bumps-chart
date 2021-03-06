import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json';

export default [
  {
    input: 'src/index.js',
    external: ['react', 'styled-components'],
    plugins: [
      babel({
        exclude: 'node_modules/**',
      }),
      resolve(),
      commonjs({
        namedExports: {
          'react-sizeme': ['withSize'],
        },
      }),
      terser(),
    ],
    output: {
      file: pkg.main,
      format: 'umd',
      globals: { react: 'React', 'styled-components': 'styled' },
      name: 'reactRowingBlades',
      esModule: false,
    },
  },
  {
    input: 'src/index.js',
    external: ['react', 'styled-components'],
    plugins: [
      babel({
        exclude: 'node_modules/**',
      }),
      resolve(),
      commonjs({
        namedExports: {
          'react-sizeme': ['withSize'],
        },
      }),
    ],
    output: {
      file: pkg.module,
      format: 'esm',
    },
  },
];
