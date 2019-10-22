import babel from 'rollup-plugin-babel';
export default {
    input: './index.js',
    output: {
        file: './dist/bundle.js',
        format: 'iife',
        name: 'bundle'
    },
    plugins: [
        babel({
            exclude: 'node_modules/**'
        })
    ]
}
