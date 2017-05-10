const { Command } = require('discord-akairo');

class ReloadCommand extends Command {
    constructor() {
        super('reload', {
            aliases: ['reload', 'r'],
            category: 'owner',
            ownerOnly: true,
            protected: true,
            args: [
                {
                    id: 'category',
                    default: 'general'
                },
                {
                    id: 'type',
                    type: [['command', 'cmd', 'c'], ['inhibitor', 'inhib', 'inh', 'i'], ['listener', 'lis', 'l']],
                    default: 'command'
                }
            ]
        });
    }

    exec(message, args) {
        const handlers = {
            command: [this.client.commandHandler, 'commands'],
            inhibitor: [this.client.inhibitorHandler, 'inhibitors'],
            listener: [this.client.listenerHandler, 'listeners']
        };

        const [handler, name] = handlers[args.type];
        const category = handler.findCategory(args.category) || handler.categories.find(c => c.id.startsWith(args.category));

        category.reloadAll();
        return message.send(`Reloaded ${category.id} ${name}.`);
    }
}

module.exports = ReloadCommand;
