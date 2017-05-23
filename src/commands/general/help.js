const { Command } = require('discord-akairo');

class HelpCommand extends Command {
    constructor() {
        super('help', {
            aliases: ['help'],
            category: 'general',
            protected: true,
            args: [
                {
                    id: 'game',
                    type: 'game'
                }
            ]
        });
    }

    exec(message, { game }) {
        const prefix = this.handler.prefix();

        if (!game) {
            const embed = this.client.util.embed()
            .addField('General Commands', [
                `\`${prefix}ping\` - Pings the bot.`,
                `\`${prefix}help\` - Gets this message or game info.`
            ]);

            for (const g of this.client.gameHandler.modules.values()) {
                embed.addField(g.BLURB[0].replace(/{p}/g, prefix), g.BLURB[1].join('\n').replace(/{p}/g, prefix));
            }

            return message.channel.send({ embed });
        }

        const embed = this.client.util.embed();
        for (const [name, value] of game.DESCRIPTION) {
            embed.addField(name, value.join('\n').replace(/{p}/g, prefix));
        }

        return message.channel.send({ embed });
    }
}

module.exports = HelpCommand;
