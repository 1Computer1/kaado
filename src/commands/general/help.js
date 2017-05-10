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

    getDescription(game) {
        const prefix = this.handler.prefix();
        const descriptions = {
            poker: {
                about: `To play poker, simply use \`${prefix}poker\`.`,
                actions: [
                    'While in-game, you can take the following actions on your turn:',
                    '',
                    `\`${prefix}p bet <amount>\` to bet.`,
                    `\`${prefix}p check\` to check.`,
                    `\`${prefix}p fold\` to fold.`,
                    `\`${prefix}p allIn\` to go all-in.`,
                    `\`${prefix}p skip\` to skip after an all-in.`
                ]
            }
        };

        return descriptions[game.id];
    }

    exec(message, { game }) {
        const avatar = message.author.avatarURL('jpg', 128) || message.author.defaultAvatarURL;

        if (!game) {
            const prefix = this.handler.prefix();

            const embed = this.client.util.embed()
            .setAuthor(`${message.author.tag} :: List of Games`, avatar)
            .addField('Texas Hold\'em Poker', [
                'Poker! Everyone loves poker!',
                'Don\'t bet away all your money!',
                `Get more info at \`${prefix}help poker\`.`
            ]);

            return message.channel.send({ embed });
        }

        const info = this.getDescription(game) || {};

        const embed = this.client.util.embed()
        .setAuthor(`${message.author.tag} :: About Poker`, avatar)
        .addField('About', info.about || 'No description')
        .addField('Actions', info.actions || 'No actions.');

        return message.channel.send({ embed });
    }
}

module.exports = HelpCommand;
