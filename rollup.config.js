import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import copy from "rollup-plugin-copy";
import livereload from 'rollup-plugin-livereload';
import resolve from "rollup-plugin-node-resolve";
import svelte from "rollup-plugin-svelte";
import postcss from "rollup-plugin-postcss";
import preprocess from "svelte-preprocess";
import shader from 'rollup-plugin-shader';
import { terser } from 'rollup-plugin-terser';

const postcss_config = require("./postcss.config.cjs");

// const production = !process.env.NODE_ENV && !process.env.ROLLUP_WATCH;
const production = !(
    process.env.NODE_ENV === "dev" ||
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "test" ||
    process.env.ROLLUP_WATCH ||
    process.argv.filter(arg => arg.match(/\s-w/) !== null).length > 0
);

(function (prod_value) {
    console.log("PRODUCTION: ", prod_value);
}(production));

export default [

    // START BUILD: App ----
    {
        external: ["Shiny"],
        input: "src/main.js",
        output: {
            name: "apps",
            file: "static/main.js",
            exports: 'named',
            format: "iife",
            sourcemap: true
        },
        plugins: [
            babel({
                "runtimeHelpers": true
            }),

            commonjs({ sourceMap: false }),

            copy({
                targets: [
                    { src: "src/fonts/**", dest: "static/" },
                    { src: "src/images", dest: "static/" },
                ]
            }),

            postcss({
                extensions: ['.css'],
                extract: true,
                minimize: !!production,
                sourceMap: !production,
                use: [['sass', {
                    includePaths: [
                        './src/app.css',
                        './node_modules'
                    ]
                }]]
            }),

            resolve({
                browser: true,
                dedupe: importee =>
                    importee === "svelte" || importee.startsWith("svelte/")
            }),

            svelte({
                dev: !production,
                // hydratable: true,
                preprocess: preprocess({
                    postcss: postcss_config
                })
            }),

            shader( {
                // All match files will be parsed by default,
                // but you can also specifically include/exclude files
                include: [ 'node_modules/@sveltejs/gl/**/*.glsl', '**/*.vs', '**/*.fs' ],
                // specify whether to remove comments
                removeComments: true,   // default: true
            } ),

            // In dev mode, watch the `public` directory
            // and refresh the browser on changes
            !production && livereload({
                watch: [
                    'static/main.js',
                    'static/main.css',
                    'static/styles.css'
                ], delay: 1533}
            ),

            // In dev mode, call `npm run start` once
            // the bundle has been generated
            !production && serve(),

            // If we're building for production (npm run build
            // instead of npm run dev), minify
            production && terser()
        ],
        watch: {
            chokidar: {
                usePolling: true
            },
            clearScreen: false,
            exclude: [
                'static/*.css',
                'static/*.js',
                'static/**/*'
            ],
            include: [
                'static/*',
                'static/**/*',
                'src/*.js',
                'src/**/*.js',
                'src/*.svelte',
                'src/**/*.svelte'
            ]
        }
    }
    // END BUILD
];

function serve() {
    let started = false;

    return {
        writeBundle() {
            if (!started) {
                started = true;

                require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
                    stdio: ['ignore', 'inherit', 'inherit'],
                    shell: true
                });
            }
        }
    };
}
