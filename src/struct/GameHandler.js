const { AkairoHandler, Constants } = require('discord-akairo');
const Game = require('./Game');

class GameHandler extends AkairoHandler {
    constructor(client, directory) {
        super(client, directory, Game);

        /**
         * A map of games by game name, player, and channels.
         * Perhaps a little overkill and I may have missed an easier method.
         *
         * ongoingGames:
         *      gameName => gameMap:
         *          playerID => channels:
         *              channelID => <Game>
         */
        this.ongoingGames = new Map();
    }

    // Overrides the load method in order to load only class constructors.
    // This is because a new Game instance has to be made for each game.
    load(thing, isReload = false) {
        if (!/\.(js|json|ts)$/.test(thing)) return undefined;

        const mod = require(thing);

        if (!(mod instanceof this.classToHandle.constructor)) {
            return undefined;
        }

        mod.id = mod.ID;
        if (this.modules.has(mod.id)) throw new Error(`${this.classToHandle.name} ${mod.id} already loaded.`);

        this._apply(mod, thing);
        if (!isReload) this.emit(Constants.AkairoHandlerEvents.LOAD, mod);
        return mod;
    }

    loadAll() {
        super.loadAll();
        for (const id of this.modules.keys()) {
            this.ongoingGames.set(id, new Map());
        }

        return this;
    }

    createGame(name, message, players = [message.member.id], options = {}) {
        const GameConstructor = this.modules.get(name);
        const game = new GameConstructor(message, players, options);
        this.addGame(game);
        return game;
    }

    addGame(game) {
        const gameMap = this.ongoingGames.get(game.id);
        for (const playerID of game.startingPlayers) {
            const channels = gameMap.get(playerID) || new Map();
            channels.set(game.channel.id, game);
            gameMap.set(playerID, channels);
        }
    }

    removeGame(game) {
        const gameMap = this.ongoingGames.get(game.id);
        for (const playerID of game.startingPlayers) {
            const channels = gameMap.get(playerID);
            channels.delete(game.channel.id);
        }
    }

    findGame(player, channel) {
        for (const gameMap of this.ongoingGames.values()) {
            const channels = gameMap.get(player.id);
            if (channels) {
                const game = channels.get(channel.id);
                if (game) return game;
            }
        }

        return null;
    }

    findExisting(id, channel) {
        const gameMap = this.ongoingGames.get(id);
        for (const channels of gameMap.values()) {
            for (const game of channels.values()) {
                if (game.channel.id === channel.id) return game;
            }
        }

        return null;
    }
}

module.exports = GameHandler;
