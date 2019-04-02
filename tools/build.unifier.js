#!/usr/bin/env node
/***
 * MIT License
 *
 * Copyright (c) 2019 Ruby Allison Rose
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
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
	help: 'Sets the running mode to production and minimizes output stylesheets.',
	action: 'storeTrue',
	default: false,
});
parser.addArgument(['--live'],{
	help: 'Loads TEST project specified in a live stylesheet test window with file watching.',
	action: 'store',
});

// (OLD: FOR ANY ARGUMENT WITH MULTIPLE CHILDREN / action == append or nargs == + || *)
// This needs to be double stringified so it will be sanitised for the cli.
// This way the shell won't accidentally missinterpret something.

let args = parser.parseArgs()

let command = 'webpack';
let commandArgs = [];

commandArgs.push('--env.mode=' + (args.P ? 'production' : 'development'))

if (args.live)
	commandArgs.push('--env.liveEdit=' + JSON.stringify(args.live));

/**
 * Spawn webpack and redirect it's output stream to inherit this one so we can
 * actively see what webpack is doing while it's running.
 *
 * This effectively just hands off the rest of execution to webpack.
 */
let webpack = child_process.execFileSync(command, commandArgs, {stdio: "inherit"});
