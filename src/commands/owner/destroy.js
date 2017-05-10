const { Command } = require('discord-akairo');

class DestroyCommand extends Command {
    constructor() {
        super('destroy', {
            aliases: ['destroy'],
            category: 'owner',
            ownerOnly: true,
            protected: true,
            args: [
                {
                    id: 'force',
                    match: 'flag',
                    prefix: '--force'
                }
            ]
        });
    }

    exec(message, { force }) {
        if (force) return process.exit(0);
        return message.send('Disconnecting bot...').then(() => this.client.destroy());
    }
}

module.exports = DestroyCommand;
