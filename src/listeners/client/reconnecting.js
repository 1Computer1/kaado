const { Listener } = require('discord-akairo');
const Logger = require('../../util/Logger');

class ReconnectingListener extends Listener {
    constructor() {
        super('reconnecting', {
            emitter: 'client',
            eventName: 'reconnecting',
            category: 'client'
        });
    }

    exec() {
        Logger.info('Kaado reconnecting.');
        process.exit();
    }
}

module.exports = ReconnectingListener;
