'use strict';

/**
 * Interface that peer-sampling protocol must implement for this module to work.
 */
class IPSP {

    /**
     * Send a message to a peer.
     * @param {string} peerId The identifier of the peer to send the message to.
     * @param {object} message The message to send.
     * @param {number} [retry = 0] Retry to send the message once per second
     * during retry milliseconds
     * @return {Promise} Resolved if the message has been sent, rejected
     * otherwise.
     */
    send (peerId, message, retry = 0) {};

    /**
     * Receive a message from a peer.
     * @param {string} peerId The identifier of the peer that sent the message.
     * @param {object} message The message received.
     */
    _receive(peerId, message) {};
};

module.exports = IPSP;
