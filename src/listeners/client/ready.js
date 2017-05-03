const { Listener } = require('discord-akairo');
const Logger = require('../../util/Logger');

class ReadyListener extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            eventName: 'ready',
            category: 'client'
        });
    }

    exec() {
        Logger.info('Kaado connected.');
        this.client.user.setGame('Hello!');
    }
}

module.exports = ReadyListener;
