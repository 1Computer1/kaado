const { Command } = require('discord-akairo');

class GiftCommand extends Command {
    constructor() {
        super('gift', {
            aliases: ['gift', 'give'],
            category: 'economy',
            args: [
                {
                    id: 'target',
                    type: 'relevant'
                },
                {
                    id: 'amount',
                    type: 'integer'
                }
            ]
        });
    }

    async exec(message, { target, amount }) {
        if (!target) return message.send('You must who to give \\🍬 to.');
        if (!amount) return message.send('You must provide how much \\🍬 to give.');

        const sourceBalance = this.client.profiles.get(message.author.id, 'balance', 0);
        if (sourceBalance < amount) {
            return message.send('You don\'t have enough \\🍬 to give!');
        }

        const targetBalance = this.client.profiles.get(target.id, 'balance', 0);

        await this.client.profiles.set(message.author.id, 'balance', sourceBalance - amount);
        await this.client.profiles.set(target.id, 'balance', targetBalance + amount);
        return message.send(`You have gifted ${target} ${amount.toLocaleString()} \\🍬`);
    }
}

module.exports = GiftCommand;
