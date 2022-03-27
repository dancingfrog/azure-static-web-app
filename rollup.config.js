import svelte from 'rollup-plugin-svelte';
import commonjs from 'rollup-plugin-commonjs';
import copy from 'rollup-plugin-copy'
import livereload from 'rollup-plugin-livereload';
import resolve from 'rollup-plugin-node-resolve';
import postcss from "rollup-plugin-postcss";
import shader from 'rollup-plugin-shader';
import { terser } from 'rollup-plugin-terser';

const production = !(
	process.env.ROLLUP_WATCH ||
	process.argv.filter(arg => arg.match(/\s-w/) !== null).length > 0
);

(function (prod_value) {
	console.log("PRODUCTION: ", prod_value);
}(production));

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		export: 'named',
		file: 'static/main.js'
	},
	plugins: [
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css: css => {
				css.write('static/main.css');
			}
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),

		// postcss({
		// 	extract: 'static/global.css',
		// 	plugins: []
		// }),

		commonjs(),

		copy({
			targets: [
				{ src: 'src/images', dest: 'static/' },
				{ src: 'src/styles/*', dest: 'static/' }
			]
		}),

		shader( {
			// All match files will be parsed by default,
			// but you can also specifically include/exclude files
			include: [ 'node_modules/@sveltejs/gl/**/*.glsl', '**/*.vs', '**/*.fs' ],
			// specify whether to remove comments
			removeComments: true,   // default: true
		} ),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `static` directory and refresh the
		// browser on changes when not in production
		!production && livereload('static'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};

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
