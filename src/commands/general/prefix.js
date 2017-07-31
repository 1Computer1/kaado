const { Command } = require('discord-akairo');

class PrefixCommand extends Command {
    constructor() {
        super('prefix', {
            aliases: ['prefix'],
            category: 'general',
            channelRestriction: 'guild',
            args: [
                {
                    id: 'prefix',
                    default: () => this.client.config.prefix
                }
            ]
        });
    }

    async exec(message, { prefix }) {
        await this.client.settings.set(message.guild.id, 'prefix', prefix);
        return message.send(`Prefix has been changed to \`${prefix}\``);
    }
}

module.exports = PrefixCommand;
