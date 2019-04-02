/*
 * (C) Copyright M3TIOR 2019
 */

/*
 * SplitChunksPlugin is enabled by default and replaced
 * deprecated CommonsChunkPlugin. It automatically identifies modules which
 * should be splitted of chunk by heuristics using module duplication count and
 * module category (i. e. node_modules). And splits the chunks…
 *
 * It is safe to remove "splitChunks" from the generated configuration
 * and was added as an educational example.
 *
 * https://webpack.js.org/plugins/split-chunks-plugin/
 *
 */


// External Library Requirements
const InertEntryPlugin = require('inert-entry-webpack-plugin');
const webpack = require('webpack');

// Standard Library Requirements
const subprocess = require('child_process');
const path = require('path');
const fs = require('fs');


function msleep(n) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}
function sleep(n) {
  msleep(n*1000);
}

function TesterBootstrap(options) {
  var defaultOptions = { live: "", outputPath: __dirname };

  this.options = Object.assign(defaultOptions, options);
}

TesterBootstrap.prototype.apply = function(compiler) {
	let name = "style-test-bootstrap";
  let options = this.options;
	let outputPath = options.outputPath;
	let liveEditorInstance = null;

	// WOOOT WOOOT FOR WEBPACK 4.0 PLUGIN API!!!
	// Still lovin' tappable

	compiler.hooks.done.tap(name, (stats) =>{
		if (Object.keys(stats.compilation.assets).length > 0){
			// I didn't think I needed this if block before but as it turns out I
			// do because otherwise, the exit call implemented within this
			// block will prevent webpack errors from being output to stdin when
			// they're our assets from being loaded properly.

			Object.keys(stats.compilation.assets).forEach( (project) => {
				if (path.basename(project, ".qss") == JSON.parse(options.live)){
					let command = "pyside2-style-test";
					let commandOpts = { stdio: "inherit" };
					let args = [
						"--file", path.join(outputPath, project)
					];

					// just in case this is called multiple times
					if (!liveEditorInstance){
						liveEditorInstance = subprocess.execFile(command, args, commandOpts);
						//sleep(3); // make sure we give the editor enough time to start up

						// register the child program needs to close when this one does.
						process.on('SIGINT', ()=>liveEditorInstance.kill("SIGKILL"));
					}
				}
			});

			if (!liveEditorInstance && options.live) {
				console.warn(`Couldn't find project ${options.live}.`)
				process.exit(-1);
			}
		}
	});

	// Can't access this for now. Found a workaround using process.on
	/*compiler.hooks.watchClose.tap(name, () => {
		if (liveEditorInstance) liveEditorinstance.kill()
	});*/
};

module.exports = (env) => {
	let outputPath = path.resolve(__dirname, "dist");
	let devMode = ( env.mode == "development" ? true : false );

	// Some versions of Webpack will fail if we don't have the output directory
	// available before the build is initiated. So we'll create it here before it
	// becomes an issue.
	if (! fs.statSync(outputPath).isDirectory()) fs.mkdirSync(outputPath);

	return {
		mode: env.mode,
		cache: false, // never cache, otherwise it will kill effectiveness of watch mode
		watch: ( env.liveEdit ? true : false), // make sure to await file updates when previewing.
		//stats: "verbose",

		entry: () => {
			let entries = Object();

			/* Loop through all the folders in the current directory with file types
			 * because we need to know which ones are directories */
			fs.readdirSync(__dirname, { withFileTypes: true }).forEach( (directory) => {
				if ( // Exclude...
					! directory.isDirectory() // hidden folders,
					|| directory.name.startsWith(".") // files,
					|| directory.name == "node_modules" // the node_modules folder,
					|| directory.name == path.basename(outputPath) ) return; // and our output folder

				// try and find a file starting with "qt." to use as our standard entrypoint
				// leaving out the rear segment to more easily allow other possible
				// contributors to use their favorite CSS preprocessors or none at all.
				let entry = null;
				fs.readdirSync(directory.name).forEach((file) => {
					if (file.startsWith("qt."))
						entry = path.resolve(__dirname, directory.name, file);
				})

				if ( entry === null ){
					// helpfull warning for other contributors
					console.warn("".concat(
						"Suppressing possible entry point '",directory.name,"' could not ",
						"locate initalizer file 'qt.(less|css|...)'.\nWas this intentional?"
					));
				}
				else {
					entries[directory.name] = entry
				}
			});

			return entries;
		},

		output: {
			path: outputPath,
			filename: "[name].qss"
		},

		module: {
			rules: [
				{
					test: /\.less$/i,
					use: [
						"extract-loader", // leaves file without js module entry
						"css-loader",
						{
							// HOLY CRAP THANK YOU CLEAN CSS!
							loader: "clean-css-loader",
							options: {
								format: (devMode ? "beautify" : undefined),
								inline: [(devMode ? "none" : "local")],
								level: 2,
							}
						},
						{
							loader: "less-loader",
							options: {
								noIeCompat: true
							}
						}
					]
				},
			]
		},

		plugins: [
			/* Allows us to use non-js entry-points */
			new InertEntryPlugin(),
			new TesterBootstrap({
				live: env.liveEdit,
				outputPath: outputPath
			}),
		],

		optimization: {
			minimizer: [
				/* NOTE: when webpack 5 comes out try and refurbish this.
				 *
				new OptimizeCSSAssetsPlugin({
					cssProcessorPluginOptions: {
						preset: ['default', { discardComments: { removeAll: true } }],
					},
				}),
				*/
			],
		}
	};
};
