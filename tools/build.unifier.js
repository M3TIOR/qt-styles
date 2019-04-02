#!/usr/bin/env node
'use strict';

//External Imports
var argparse = require('argparse');

//Standard Library Imports
var child_process = require("child_process");


let parser = new argparse.ArgumentParser({
	version: '0.0.1',
	addHelp: true,
	description: 'qt-styles\' project build system.',
});
parser.addArgument(['-P'],{
	help: 'Sets the running mode to production from development.',
	action: 'storeTrue',
	default: false,
});
parser.addArgument(['--live'],{
	help: 'Loads TEST project specified in a live stylesheet test window with file watching.',
	action: 'store',
	default: null,
});

// (OLD: FOR ANY ARGUMENT WITH MULTIPLE CHILDREN / action == append or nargs == + || *)
// This needs to be double stringified so it will be sanitised for the cli.
// This way the shell won't accidentally missinterpret something.

let args = parser.parseArgs()

let command = 'webpack';
let commandArgs = [
	'--env.mode=' + (args.P ? 'production' : 'development'),

	'--env.liveEdit=' + JSON.stringify(args.live),
];

/**
 * Spawn webpack and redirect it's output stream to inherit this one so we can
 * actively see what webpack is doing while it's running.
 *
 * This effectively just hands off the rest of execution to webpack.
 */
let webpack = child_process.execFileSync(command, commandArgs, {stdio: "inherit"});
