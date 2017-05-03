const { Listener } = require('discord-akairo');
const Logger = require('../../util/Logger');

class UnhandledRejectionListener extends Listener {
    constructor() {
        super('unhandledRejection', {
            emitter: 'process',
            eventName: 'unhandledRejection',
            category: 'process'
        });
    }

    exec(error) {
        Logger.error('An unhandled error occured.');
        Logger.stackTrace(error);
    }
}

module.exports = UnhandledRejectionListener;
