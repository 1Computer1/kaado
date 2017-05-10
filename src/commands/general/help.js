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
            ])
            .addField('Texas Hold\'em Poker', [
                'Poker! Everyone loves poker! Play with friends!',
                'Don\'t bet away all your (unlimited) money!',
                'Cards are Touhou themed for extra cuteness!',
                '',
                `Play now by using \`${prefix}poker\`.`,
                `Get more info at \`${prefix}help poker\`.`
            ]);

            return message.channel.send({ embed });
        }

        const info = HelpCommand.DESCRIPTIONS[game.id] || {};

        const embed = this.client.util.embed();
        for (const [name, value] of info) {
            embed.addField(name, value.join('\n').replace(/{p}/g, prefix));
        }

        return message.channel.send({ embed });
    }
}

HelpCommand.DESCRIPTIONS = {
    poker: [
        [
            'About',
            [
                'To play poker, simply use `{p}poker`.',
                'There can be a minimum of 2 players, and a maximum of 8.',
                'Everyone will start with $1000 for betting.'
            ]
        ],
        [
            'Actions',
            [
                'While in-game, you can take the following actions on your turn:',
                '',
                '`{p}p bet <amount>` to bet.',
                '`{p}p check` to check.',
                '`{p}p fold` to fold.',
                '`{p}p allIn` to go all-in.',
                '`{p}p skip` to skip after an all-in.'
            ]
        ],
        [
            'Poker Hands',
            [
                '**Royal Flush**',
                'A, K, Q, J, and 10 of the same suit.',
                '',
                '**Straight Flush**',
                'Five cards in sequence of the same suit.',
                '',
                '**Four of a Kind**',
                'Four cards of the same rank.',
                '',
                '**Full House**',
                'Three of a kind and a pair.',
                '',
                '**Flush**',
                'Five cards of the same suit, not in sequence.',
                '',
                '**Straight**',
                'Five cards in sequence, not of same suit.',
                '',
                '**Three of a Kind**',
                'Three cards of the same rank.',
                '',
                '**Two Pair**',
                'Two different pairs.',
                '',
                '**Pair**',
                'Two cards of the same rank.'
            ]
        ]
    ]
};

module.exports = HelpCommand;
