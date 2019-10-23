import babel from 'rollup-plugin-babel';
/* import autoExternal from 'rollup-plugin-auto-external'; */
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
    input: './index.js',
    external: ['react'],
    output: {
        file: './dist/bundle.js',
        format: 'cjs',
        name: 'bundle',
    },
    plugins: [
        babel({
            exclude: 'node_modules/**'
        }),
        resolve(),
        commonjs()
    ]
}
