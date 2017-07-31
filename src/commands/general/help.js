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
        const prefix = this.handler.prefix(message);

        if (!game) {
            const embed = this.client.util.embed()
            .addField('General Commands', [
                `\`${prefix}ping\` - Pings the bot.`,
                `\`${prefix}help\` - Gets this message or game info.`,
                `\`${prefix}prefix\` - Changes the prefix for commands.`
            ])
            .addField('Economy Commands', [
                `\`${prefix}balance\` - Shows yours or someone else's balance.`,
                `\`${prefix}daily\` - Gets the daily 200 \\🍬 or gift someone a daily 300 \\🍬.`,
                `\`${prefix}gift\` - Gifts someone a certain amount of money.`
            ])
            .addField('Minigame Commands', [
                `\`${prefix}slots\` - Plays a slot machine.\nUse \`${prefix}slots <1, 2, 5, 10>\` to play.\nUse \`${prefix}slots list\` for the payout table.`
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
