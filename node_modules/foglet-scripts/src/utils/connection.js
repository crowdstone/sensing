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

/**
 * Connect peers in path.
 *
 * For example, given [p1, p2, p3], p1 is connected to p2 and p2 is connected to p3.
 * @param  {Foglet[]}  peers - Foglet peers to connect in path.
 * @param  {boolean} [duplex=false] - True if peers should be connected in duplex, False for half-duplex
 * @return {Promise} A Promise fullfilled when all peers are connected
 */
const pathConnect = (peers, duplex = false) => {
  const pairs = []
  for (let ind = 0; ind < peers.length - 1; ind++) {
    pairs.push([ peers[ind], peers[ind + 1] ])
  }
  return Promise.all(pairs.map(pair => {
    return pair[0].connection(pair[1])
    .then(() => {
      if (duplex) return pair[1].connection(pair[0])
      return Promise.resolve()
    })
  }))
}

/**
 * Connect peers in start.
 *
 * For example, given p1 and [p2, p3], p1 is connected to p2 and p3.
 * @param  {Foglet} center - The central peer in the star
 * @param  {Foglet[]}  peers - Foglet peers to connect with the centeral peer.
 * @param  {boolean} [duplex=false] - True if peers should be connected in duplex, False for half-duplex
 * @return {Promise} A Promise fullfilled when all peers are connected
 */
const starConnect = (center, peers, duplex = false) => {
  return Promise.all(peers.map(peer => {
    return center.connection(peer)
    .then(() => {
      if (duplex) return peer.connection(center)
      return Promise.resolve()
    })
  }))
}

const overlayConnect = (index, ...peers) => {
  return peers.reduce((prev, peer) => {
    return prev.then(() => {
      peer.share(index)
      return peer.connection(null, index)
    })
  }, Promise.resolve())
}

module.exports = {
  pathConnect,
  starConnect,
  overlayConnect
}
