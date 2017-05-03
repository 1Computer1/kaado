const { Inhibitor } = require('discord-akairo');

class DisabledSendingInhibitor extends Inhibitor {
    constructor() {
        super('sending', {
            reason: 'sending'
        });
    }

    exec(message) {
        if (!message.guild) return false;
        return !message.channel.permissionsFor(this.client.user).has('SEND_MESSAGES');
    }
}

module.exports = DisabledSendingInhibitor;
