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

const WebpackRunner = require('../src/webpack/webpack-runner.js')
const readConfig = require('../src/read-config.js')
const program = require('commander')
const packageInfos = require('../package.json')
const programPackageInfos = require(`${process.cwd()}/package.json`)

program
  .version(packageInfos.version)
  .description('Build foglet application using Webpack')
  .usage('[options]')

program.on('--help', () => {
  process.stdout.write('\n  Example:\n')
  process.stdout.write('\n')
  process.stdout.write('    foglet-scripts build\n')
  process.stdout.write('\n')
})

program.parse(process.argv)

const config = readConfig(programPackageInfos)

const runner = new WebpackRunner(config)

runner.run((err, stats) => {
  if (err || stats.hasErrors()) {
    process.stderr.write(err)
    process.stderr.write('\n')
    process.exit(1)
  }
  process.stdout.write(stats.toString({
    chunks: false,
    colors: true
  }))
  process.stdout.write('\n')
  process.stdout.write('Build complete!\n')
  process.exit(0)
})
