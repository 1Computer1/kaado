const { Listener } = require('discord-akairo');
const Logger = require('../../util/Logger');

class DisconnectListener extends Listener {
    constructor() {
        super('disconnect', {
            emitter: 'client',
            eventName: 'disconnect',
            category: 'client'
        });
    }

    exec(closeInfo) {
        if (!closeInfo) {
            Logger.info('Kaado has disconnected for some reason.');
            process.exit();
            return;
        }

        Logger.info(`Kaado disconnected with code ${closeInfo.code}.`);
        process.exit();
    }
}

module.exports = DisconnectListener;
