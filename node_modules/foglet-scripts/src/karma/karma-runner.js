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

const EventEmitter = require('events')
const { Server, stopper } = require('karma')
const getConfig = require('./karma-config.js')

class KarmaRunner extends EventEmitter {
  constructor (jsonConfig, callback) {
    super()
    this._jsonConfig = jsonConfig
    this._karmaConfig = getConfig(jsonConfig.browsers, jsonConfig.exclude, jsonConfig.timeout, jsonConfig.lint)
    this._server = new Server(this._karmaConfig, exitCode => {
      callback(exitCode)
      stopper.stop({ port: this._karmaConfig.port })
    })
    this._server.on('browser_error', err => this.emit('browser_error', err))
    this._server.on('run_complete', (browsers, results) => this.emit('run_complete', browsers, results))
  }

  run (callback) {
    this._server.start()
  }
}

module.exports = KarmaRunner
