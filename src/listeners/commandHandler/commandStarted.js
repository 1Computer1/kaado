const { Listener } = require('discord-akairo');
const Logger = require('../../util/Logger');

class CommandStartedListener extends Listener {
    constructor() {
        super('commandStarted', {
            emitter: 'commandHandler',
            eventName: 'commandStarted',
            category: 'commandHandler'
        });
    }

    exec(message, command) {
        Logger.log(`=> ${command.id}`);
    }
}

module.exports = CommandStartedListener;
