import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import { terser } from "rollup-plugin-terser";

export default {
    input: './src/index.js',
    external: ['react', 'ramda', '@jadesrochers/fpstreamline', 'd3-format' ],
    output: [
      {
          format: 'umd',
          file: './dist/reacthelpers-umd.js',
          name: 'reacthelpers',
      },
    ],
    plugins: [
        babel({
            exclude: 'node_modules/**',
        }),
        resolve(),
        commonjs(),
        terser(),
        filesize(),
    ]
}
