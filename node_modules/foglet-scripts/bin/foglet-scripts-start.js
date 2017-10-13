#!/usr/bin/env node
/*
MIT License

Copyright (c) 2017 Thomas Minier

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
'use strict'

const childProcess = require('child_process')
const program = require('commander')
const packageInfos = require('../package.json')
const SCRIPT_PATH = 'node_modules/foglet-signaling-server/express-signaling-server.js'

function runScript (callback) {
  // keep track of whether callback has been invoked to prevent multiple invocations
  var invoked = false
  var process = childProcess.fork(SCRIPT_PATH)

  // listen for errors as they may prevent the exit event from firing
  process.on('error', err => {
    if (invoked) return
    invoked = true
    callback(err)
  })

  // execute the callback once the process has finished running
  process.on('exit', code => {
    if (invoked) return
    invoked = true
    var err = code === 0 ? null : new Error(`Exit code ${code}`)
    callback(err)
  })
}

program
  .version(packageInfos.version)
  .description('Start signaling server at http://localhost:3000')
  .usage('[options]')

program.on('--help', () => {
  process.stdout.write('\n  Example:\n')
  process.stdout.write('\n')
  process.stdout.write('    foglet-scripts start\n')
  process.stdout.write('\n')
})

program.parse(process.argv)

runScript(err => {
  if (err) {
    process.stderr.write(err)
    process.stderr.write('\n')
    process.exit(1)
  }
  process.stdout.write('Stopping signaling server\n')
  process.exit(0)
})
