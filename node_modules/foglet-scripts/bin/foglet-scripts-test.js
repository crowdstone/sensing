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

const KarmaRunner = require('../src/karma/karma-runner.js')
const readConfig = require('../src/read-config.js')
const program = require('commander')
const packageInfos = require('../package.json')
const programPackageInfos = require(`${process.cwd()}/package.json`)

program
  .version(packageInfos.version)
  .description('Run tests with Karma using the specified browsers')
  .usage('[options]')

program.on('--help', () => {
  process.stdout.write('\n  Example:\n')
  process.stdout.write('\n')
  process.stdout.write('    foglet-scripts test\n')
  process.stdout.write('\n')
})

program.parse(process.argv)

const config = readConfig(programPackageInfos)

if (config.browsers.length <= 0) {
  process.stderr.write('Error: you must specify at least one browser\n')
  process.exit(1)
}

// check for karma launchers corresponding to browsers
config.browsers.forEach(browser => {
  const launcher = `karma-${browser.toLowerCase()}-launcher`
  if ((!(launcher in programPackageInfos.dependencies)) && (!(launcher in programPackageInfos.devDependencies))) {
    process.stderr.write(`Error: you want to run tests using ${browser}, but the corresponding Karma launcher is not installed\n
      Try to run npm i -D ${launcher} to install it.\n`)
    process.exit(1)
  }
})

const runner = new KarmaRunner(config, exitCode => {
  process.stdout.write('Tests completed\n')
  process.exit(exitCode)
})

runner.run()
