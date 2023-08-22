import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from "@rollup/plugin-terser";
import filesize from 'rollup-plugin-filesize';

export default {
    input: './src/index.mjs',
    external: ['react', 'ramda', '@jadesrochers/fpstreamline', 'd3-format' ],
    output: [
      {
          format: 'cjs',
          file: './dist/reacthelpers-cjs.js',
          name: 'reacthelpers',
      },
    ],
    plugins: [
        babel({
            exclude: 'node_modules/**',
        }),
        nodeResolve(),
        commonjs(),
        terser(),
        filesize(),
    ]
}
