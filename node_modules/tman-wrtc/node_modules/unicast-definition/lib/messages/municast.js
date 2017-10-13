'use strict';

/**
 * Message that triggers an event remotely for the protocol.
 */
class MUnicast {
    /**
     * @param {string} protocolId The identifier of the unicast protocol.
     * @param {string} eventName The name of the event to trigger.
     * @param {object[]} [args] The arguments of the event.
     */
    constructor(protocolId, eventName, args){
        this.pid = protocolId;
        this.event = eventName;
        this.args = args;
        this.type = 'MUnicast';
    };
};

module.exports = MUnicast;
