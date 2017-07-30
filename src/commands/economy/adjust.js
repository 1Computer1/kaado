const { Command } = require('discord-akairo');

class AdjustCommand extends Command {
    constructor() {
        super('adjust', {
            aliases: ['adjust'],
            category: 'economy',
            ownerOnly: true,
            split: 'sticky',
            args: [
                {
                    id: 'source',
                    match: 'prefix',
                    prefix: ['from:', 'source:'],
                    type: 'user'
                },
                {
                    id: 'target',
                    match: 'prefix',
                    prefix: ['to:', 'target:'],
                    type: 'user'
                },
                {
                    id: 'amount',
                    type: 'integer',
                    default: 0
                }
            ]
        });
    }

    async exec(message, { source, target, amount }) {
        if (!source) return message.send('Source user is required.');
        const sourceBalance = this.client.profiles.get(source.id, 'balance', 0);

        if (target) {
            const targetBalance = this.client.profiles.get(target.id, 'balance', 0);
            await this.client.profiles.set(source.id, 'balance', sourceBalance - amount);
            await this.client.profiles.set(target.id, 'balance', targetBalance + amount);
            return message.send(`${amount.toLocaleString()} \\🍬 was transferred from ${source} to ${target}.`);
        }

        await this.client.profiles.set(source.id, 'balance', sourceBalance + amount);
        return message.send(`${source}'s balance was adjusted by ${amount.toLocaleString()} \\🍬`);
    }
}

module.exports = AdjustCommand;
