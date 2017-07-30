const { Command } = require('discord-akairo');
const moment = require('moment');

class DailyCommand extends Command {
    constructor() {
        super('daily', {
            aliases: ['daily'],
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

    async exec(message, { member }) {
        const prevDaily = this.client.profiles.get(message.member.id, 'previousDaily');
        const timeDiff = (message.editedTimestamp || message.createdTimestamp) - prevDaily;
        const oneDay = 24 * 60 * 60 * 1000;

        if (!prevDaily || timeDiff >= oneDay) {
            const amount = member.id === message.member.id ? 200 : 300;
            const balance = this.client.profiles.get(member.id, 'balance', 0);
            await this.client.profiles.set(member.id, 'balance', balance + amount);
            await this.client.profiles.set(message.member.id, 'previousDaily', message.editedTimestamp || message.createdTimestamp);

            const text = member.id === message.member.id ? 'You have' : `${member} has`;
            return message.send(`${text} received ${amount.toLocaleString()} \\🍬`);
        }

        const timeRequired = oneDay - timeDiff;
        return message.send(`You have to wait ${moment.duration(timeRequired, 'ms').format('h[h] [and] m[m]')} for your next daily.`);
    }
}

module.exports = DailyCommand;
