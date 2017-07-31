const { Command } = require('discord-akairo');
const { SlotMachine, SlotSymbol } = require('slot-machine');

const symbols = [
    new SlotSymbol('1', {
        display: '🍒',
        points: 1,
        weight: 100
    }),
    new SlotSymbol('2', {
        display: '🍋',
        points: 1,
        weight: 100
    }),
    new SlotSymbol('3', {
        display: '🍇',
        points: 1,
        weight: 100
    }),
    new SlotSymbol('4', {
        display: '🍉',
        points: 1,
        weight: 100
    }),
    new SlotSymbol('5', {
        display: '🍊',
        points: 1,
        weight: 100
    }),
    new SlotSymbol('a', {
        display: '💵',
        points: 5,
        weight: 60
    }),
    new SlotSymbol('b', {
        display: '💰',
        points: 10,
        weight: 40
    }),
    new SlotSymbol('c', {
        display: '💎',
        points: 100,
        weight: 20
    }),
    new SlotSymbol('w', {
        display: '🃏',
        points: 1,
        weight: 40,
        wildcard: true
    })
];

class SlotsCommand extends Command {
    constructor() {
        super('slots', {
            aliases: ['slots', 'slot'],
            category: 'games',
            args: [
                {
                    id: 'option',
                    type: 'dynamicInt'
                }
            ]
        });
    }

    async exec(message, { option }) {
        if (option === 'list') {
            const embed = this.client.util.embed()
            .setTitle('Payout Table')
            .setDescription(symbols.map(s => `${s.display}\u2000**${s.points.toLocaleString()}**x  \\🍬`));

            return message.channel.send({ embed });
        }

        if (isNaN(option) || ![1, 2, 5, 10].includes(option)) {
            return message.send('You can only play with 1, 2, 5, or 10 \\🍬');
        }

        const bal = this.client.profiles.get(message.author.id, 'balance', 0);
        if (bal < option) {
            return message.send('You do not have enough \\🍬 to play!');
        }

        const machine = new SlotMachine(3, symbols);
        const results = machine.play();

        const embed = this.client.util.embed();
        const dollarSigns = '   💲 💲 💲   ';

        embed.description = (results.lines.slice(-2)[0].isWon ? '\n↘' : '\n⬛')
        + dollarSigns
        + (results.lines.slice(-1)[0].isWon ? '↙' : '⬛');

        for (let i = 0; i < results.lines.length - 2; i++) {
            embed.description += (results.lines[i].isWon ? '\n➡   ' : '\n⬛   ')
            + results.lines[i].symbols.map(s => s.display).join(' ')
            + (results.lines[i].isWon ? '   ⬅' : '   ⬛');
        }

        embed.description += (results.lines.slice(-1)[0].isWon ? '\n↗' : '\n⬛')
        + dollarSigns
        + (results.lines.slice(-2)[0].isWon ? '↖' : '⬛');

        const points = results.lines.reduce((total, line) => total + line.points, 0);
        const payout = option * points;

        embed.addField(
            points ? 'You have won!' : 'You have lost!',
            points ? `You have earned ${payout.toLocaleString()} \\🍬` : 'Better luck next time!'
        );

        await this.client.profiles.set(message.author.id, 'balance', bal - option + payout);
        return message.channel.send({ embed });
    }
}

module.exports = SlotsCommand;
