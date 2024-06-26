import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import babel from '@rollup/plugin-babel';
import stripBanner from 'rollup-plugin-strip-banner';
import getBanner,{pkgJson} from './build/banner.mjs';



const plugins = [
    resolve(),
    commonjs(),
    stripBanner({
        include: '**/*.js',
        exclude: 'node_modules/**'
    }),
    babel({
        babelHelpers: 'bundled',
        exclude: ['node_modules/**']
    }),
]

if (process.env.NODE_ENV === 'production') {
    plugins.push(terser({
        output: {
            comments() {
                return false
            }
        }
    }))
}



const config = [];



let file = pkgJson.main
if (process.env.NODE_ENV === 'production') {
    file = file.replace(/\.js$/, '.min.js')
}


const base = {
    banner: getBanner(),
    sourcemap: true,//方便调试
}

const input = 'src/index.js'

config.push({
    input,
    output: {
        ...base,
        format: 'umd',
        name: 'Storagetify',
        file
    },
    plugins
})


file = pkgJson.module;
if (process.env.NODE_ENV === 'production') {
    file = file.replace(/\.js$/, '.min.js')
}


config.push({
    input,
    output: {
        ...base,
        file,
        format: 'esm'
    },
    plugins
})


export default config;