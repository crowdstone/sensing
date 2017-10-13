'use strict';

const debug = require('debug')('unicast-definition');
const EventEmitter = require('events');
const merge = require('lodash.merge');

const MUnicast = require('./messages/municast.js');

/**
 * Unicast component that simply sends messages to a neighbor.  It provides
 * easy-to-use event-like functions on top of a peer-sampling
 * protocol. Protocols can send messages using unicast.emit('eventName',
 * neighborId, args) and the neighbor can catch them using
 * unicast.on('eventName', args).
 */
class Unicast extends EventEmitter {
    /**
     * @param {IPSP} psp The peer-sampling protocol.
     * @param {object} [options] The options of this unicast.
     * @param {string} [options.pid = 'default-unicast'] The name of this
     * unicast.
     * @param {number} [option.retry = 0] The number of attempt to send a
     * message.
     */
    constructor(psp, options = {}) {
        super();
        // #0 default options
        this.options = merge({retry: 0, pid: 'default-unicast'}, options);
        // #1 create the table of registered protocols
        this.psp = psp;
        // #2 overload the receipt of messages from the peer-sampling protocol
        let __receive = psp._receive;
        psp._receive = (peerId, message) => {
            try {
                __receive.call(psp, peerId, message);
            } catch (e) {
                if (message.type && message.type === 'MUnicast' &&
                    message.pid === this.options.pid) {
                    this._emit(message.event, ...(message.args));
                } else {
                    throw (e);
                };
            };
        };
        
        // #3 replace the basic behavior of eventemitter.emit
        this._emit = this.emit;        
        /**
         * Send a message using the emit function.
         * @param {string} event The event name.
         * @param {string} peerId The identifier of the peer to send the event
         * to.
         * @param {object[]} [args] The arguments of the event.
         * @returns {Promise} Resolved if the message seems to have been sent,
         * rejected otherwise (e.g. timeout, unkown peers).
         */
        this.emit = (event, peerId, ...args) => {
            return psp.send(peerId, new MUnicast(this.options.pid, event, args),
                            this.options.retry);
        };
        
        debug('just initialized on top of %s@%s.', this.psp.PID, this.psp.PEER);
    };

    /**
     * Destroy all listeners and remove the send capabilities
     */
    destroy () {
        this.removeAllListener();
        this.emit = this._emit; // retrieve basic behavior
    };
};

module.exports = Unicast;
