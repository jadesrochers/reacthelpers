import babel from 'rollup-plugin-babel';
/* import autoExternal from 'rollup-plugin-auto-external'; */
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
    input: './index.js',
    external: ['react', 'react-dom'],
    output: {
        file: './dist/bundle.js',
        format: 'cjs',
        name: 'bundle',
    },
    output: {
        file: './dist/web.js',
        format: 'iife',
        name: 'bundle',
        globals: {
        'react': 'React'
      }
    },
    plugins: [
        babel({
            exclude: 'node_modules/**'
        }),
        resolve(),
        commonjs()
    ]
}
