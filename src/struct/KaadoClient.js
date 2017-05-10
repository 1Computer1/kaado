const { AkairoClient } = require('discord-akairo');
const Deck = require('./Deck');
const GameHandler = require('./GameHandler');

class KaadoClient extends AkairoClient {
    constructor(config) {
        super({
            ownerID: config.ownerID,
            // Per-guild prefixes, someday, maybe.
            // It's mostly a personal bot for now.
            prefix: config.prefix,
            allowMention: true,
            emitters: { process },
            commandDirectory: './src/commands/',
            inhibitorDirectory: './src/inhibitors/',
            listenerDirectory: './src/listeners/'
        }, {
            messageCacheMaxSize: 50,
            disableEveryone: true,
            disabledEvents: ['TYPING_START']
        });

        this.config = config;
        this.gameHandler = null;
    }

    build() {
        super.build();
        this.gameHandler = new GameHandler(this, './src/struct/games/');

        this.commandHandler.resolver.addTypes({
            game: word => {
                if (!word) return null;
                return this.commandHandler.modules.find(cmd => {
                    if (cmd.category.id !== 'games') return false;

                    for (let alias of cmd.aliases) {
                        alias = alias.toLowerCase();
                        if (word.toLowerCase().startsWith(alias)) {
                            return true;
                        }
                    }

                    return false;
                });
            }
        });

        return this;
    }

    loadAll() {
        super.loadAll();
        this.gameHandler.setup();
        return this;
    }

    async start() {
        await Deck.loadAssets();
        return this.login(this.config.token);
    }
}

module.exports = KaadoClient;
