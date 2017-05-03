const { Listener } = require('discord-akairo');
const Logger = require('../../util/Logger');

class ErrorListener extends Listener {
    constructor() {
        super('error', {
            emitter: 'commandHandler',
            eventName: 'error',
            category: 'commandHandler'
        });
    }

    exec(error, message) {
        Logger.error('A handler error occured.');
        Logger.stackTrace(error);

        if (message.guild && !message.channel.permissionsFor(this.client.user).has('SEND_MESSAGES')) return;

        const cb = '```';
        message.channel.send([
            'An unexpected error has occured.',
            'Please contact Kaado\'s creator to get this fixed.',
            'Note that if you were in the middle of a game, it is likely still ongoing.',
            'Try a command to continue the game as normal.',
            cb,
            error,
            cb
        ]);
    }
}

module.exports = ErrorListener;
