const { Command } = require('discord-akairo');

class PingCommand extends Command {
    constructor() {
        super('ping', {
            aliases: ['ping'],
            category: 'general'
        });
    }

    async exec(message) {
        const sent = await message.send('Pong!');
        const timeDiff = sent.createdAt - message.createdAt;
        const text = `🔂\u2000**RTT**: ${timeDiff} ms\n💟\u2000**Heartbeat**: ${Math.round(this.client.ping)} ms`;
        return sent.edit(`${sent.content}\n${text}`);
    }
}

module.exports = PingCommand;
