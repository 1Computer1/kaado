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
        this.addTypes();
        return this;
    }

    addTypes() {
        const resolver = this.commandHandler.resolver;
        resolver.addTypes({
            game: word => {
                if (!word) return null;
                word = word.toLowerCase();
                return this.gameHandler.modules.find(game => {
                    return game.id.toLowerCase() === word
                    || game.name.toLowerCase() === word;
                });
            }
        });
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
