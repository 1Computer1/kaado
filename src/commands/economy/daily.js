const { Command } = require('discord-akairo');
const moment = require('moment');

class DailyCommand extends Command {
    constructor() {
        super('daily', {
            aliases: ['daily'],
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

    async exec(message, { user }) {
        const prevDaily = this.client.profiles.get(message.author.id, 'previousDaily');
        const timeDiff = (message.editedTimestamp || message.createdTimestamp) - prevDaily;
        const oneDay = 24 * 60 * 60 * 1000;

        if (!prevDaily || timeDiff >= oneDay) {
            const amount = user.id === message.author.id ? 200 : 300;
            const balance = this.client.profiles.get(user.id, 'balance', 0);
            await this.client.profiles.set(user.id, 'balance', balance + amount);
            await this.client.profiles.set(message.author.id, 'previousDaily', message.editedTimestamp || message.createdTimestamp);

            const text = user.id === message.author.id ? 'You have' : `${user} has`;
            return message.send(`${text} received ${amount.toLocaleString()} \\🍬`);
        }

        const timeRequired = oneDay - timeDiff;
        return message.send(`You have to wait ${moment.duration(timeRequired, 'ms').format('h[h] [and] m[m]')} for your next daily.`);
    }
}

module.exports = DailyCommand;
