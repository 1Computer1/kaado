const { Command } = require('discord-akairo');

class BalanceCommand extends Command {
    constructor() {
        super('balance', {
            aliases: ['balance', 'bal', 'money'],
            category: 'economy',
            channelRestriction: 'guild',
            args: [
                {
                    id: 'member',
                    type: 'member',
                    default: m => m.member
                }
            ]
        });
    }

    exec(message, { member }) {
        const balance = this.client.profiles.get(member.id, 'balance', 0);

        const text = member.id === message.member.id ? 'Your' : `${member}'s`;
        return message.send(`${text} balance is ${balance.toLocaleString()} \\🍬`);
    }
}

module.exports = BalanceCommand;
