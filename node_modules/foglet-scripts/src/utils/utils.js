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

const { overlayConnect, pathConnect, starConnect } = require('./connection.js')

/**
 * Perform a Mocha/Jasmine test with the `done` callback, but only terminate the
 * test after `done` has been called `limit` times.
 * @param  {integer} limit - How many times `done` should be called
 * @param  {function} test  - Test function callbed with the `done` callback
 * @return {function} Test function for Mocha/Jasmine `it`
 */
const doneAfter = (limit, test) => {
  return done => {
    let cpt = 0
    test(() => {
      cpt++
      if (cpt >= limit) done()
    })
  }
}

module.exports = {
  connect: {
    path: pathConnect,
    star: starConnect,
    overlay: overlayConnect
  },
  doneAfter
}
