const { AkairoClient, SequelizeProvider } = require('discord-akairo');
const path = require('path');

const Deck = require('./Deck');
const GameHandler = require('./GameHandler');

const Database = require('./Database');
const User = require('../models/users');
const Guild = require('../models/guilds');

class KaadoClient extends AkairoClient {
    constructor(config) {
        super({
            ownerID: config.ownerID,
            prefix: m => {
                if (m.guild) return this.settings.get(m.guild.id, 'prefix', this.config.prefix);
                return this.config.prefix;
            },
            allowMention: true,
            emitters: { process },
            commandDirectory: path.join(__dirname, '..', 'commands'),
            inhibitorDirectory: path.join(__dirname, '..', 'inhibitors'),
            listenerDirectory: path.join(__dirname, '..', 'listeners')
        }, {
            messageCacheMaxSize: 50,
            disableEveryone: true,
            disabledEvents: ['TYPING_START']
        });

        this.config = config;
        this.profiles = new SequelizeProvider(User, { dataColumn: 'profile' });
        this.settings = new SequelizeProvider(Guild, { dataColumn: 'settings' });
        this.gameHandler = new GameHandler(this, path.join(__dirname, '..', 'games'));
    }

    build() {
        super.build();
        return this.addTypes();
    }

    addTypes() {
        this.commandHandler.resolver.addTypes({
            game: word => {
                if (!word) return null;
                word = word.toLowerCase();
                return this.gameHandler.modules.find(game => {
                    return game.id.toLowerCase() === word
                    || game.name.toLowerCase() === word;
                });
            }
        });

        return this;
    }

    loadAll() {
        super.loadAll();
        this.gameHandler.loadAll();
        return this;
    }

    async start() {
        await Deck.loadAssets();
        await Database.authenticate();
        await this.profiles.init();
        await this.settings.init();
        return this.login(this.config.token);
    }
}

module.exports = KaadoClient;
