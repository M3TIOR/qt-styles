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
const path = require('path');
const fs = require('fs');

module.exports = (env) => {
	let outputPath = path.resolve(__dirname, "dist");

	// Some versions of Webpack will fail if we don't have the output directory
	// available before the build is initiated. So we'll create it here before it
	// becomes an issue.
	if (! fs.statSync(outputPath).isDirectory()) fs.mkdirSync(outputPath);

	return {
		mode: env.mode,
		cache: false, // never cache, otherwise it will kill effectiveness of watch mode
		//watch: env.watch, // make sure to await file updates when previewing. (switched to cli option)
		//stats: "verbose",

		entry: () => {
			let entries = Object();

			/* Loop through all the folders in the current directory with file types
			 * because we need to know which ones are directories */
			fs.readdirSync(".", { withFileTypes: true }).forEach( (directory) => {
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
						"Suppressing possible entry point ",directory.name," could not ",
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
			new InertEntryPlugin()
		],

		optimization: {
			minimizer: [
				//new OptimizeCSSAssetsPlugin({})
			],
			splitChunks: {
				cacheGroups: {
					vendors: {
						priority: -10,
						test: /[\\/]node_modules[\\/]/
					}
				},

				chunks: 'async',
				minChunks: 1,
				minSize: 30000,
				name: true
			}
		}
	};
};
