const { Command } = require('discord-akairo');

class BalanceCommand extends Command {
    constructor() {
        super('balance', {
            aliases: ['balance', 'bal', 'money'],
            category: 'economy',
            args: [
                {
                    id: 'user',
                    type: 'relevant',
                    default: m => m.author
                }
            ]
        });
    }

    exec(message, { user }) {
        const balance = this.client.profiles.get(user.id, 'balance', 0);

        const text = user.id === message.author.id ? 'Your' : `${user.tag}'s`;
        return message.send(`${text} balance is ${balance.toLocaleString()} \\🍬`);
    }
}

module.exports = BalanceCommand;
