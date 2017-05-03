const { Listener } = require('discord-akairo');
const Logger = require('../../util/Logger');

class CommandBlockedListener extends Listener {
    constructor() {
        super('commandBlocked', {
            emitter: 'commandHandler',
            eventName: 'commandBlocked',
            category: 'commandHandler'
        });
    }

    exec(message, command, reason) {
        Logger.log(`=> ${command.id} ~ ${reason}`);

        const reply = {
            owner: 'You have to be the bot owner to use this command!',
            guild: 'You can only use this command in a guild.',
            dm: 'You can only use this command in a DM.',
            embeds: 'Please enable Embed Links for Kaado.',
            userPermissions: 'You do not have permissions to use this command.',
            clientPermissions: 'Kaado does not have permissions to use this command.'
        }[reason];

        if (!reply) return;
        if (message.guild && !message.channel.permissionsFor(this.client.user).has('SEND_MESSAGES')) return;

        message.send(reply);
    }
}

module.exports = CommandBlockedListener;
