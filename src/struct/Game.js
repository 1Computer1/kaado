const { AkairoModule } = require('discord-akairo');

class Game extends AkairoModule {
    constructor(name, message, players, options = {}) {
        super(name, null, options);

        this.name = name;
        this.message = message;
        this.channel = message.channel;

        // These need to be set due to handler not instantiating the class.
        this.guild = message.guild;
        this.client = message.client;
        this.handler = this.client.gameHandler;

        // The startingPlayers prop must never be changed.
        // The players prop is okay for mutating.
        this.startingPlayers = new Set(players);
        this.players = new Set(players);

        this.minPlayers = options.minPlayers || 1;
        this.maxPlayers = options.maxPlayers || 2;
        this.waitTime = options.waitTime || 30;

        this.startTime = message.createdTimestamp;
        this.countdown = setTimeout(async () => {
            clearTimeout(this.countdown);
            this.countdown = null;
            this.initiated = true;

            if (this.startingPlayers.size < this.minPlayers) {
                this.channel.send(`Not enough players (${this.minPlayers} required) to play this game.`);
                this.handler.removeGame(this);
                return;
            }

            await this.channel.send(`${this.waitTime} seconds has passed, the game will now start.`);
            await this.startGame();
            this.started = true;
        }, this.waitTime * 1000);

        // Initiated means maximum players reached or countdown reached.
        // Started means the startGame method has finished.
        this.initiated = false;
        this.started = false;
    }

    startGame() {
        throw new Error(`${this.constructor.name}#startGame not implemented.`);
    }

    async handleMessage(message) {
        if (this.initiated) {
            return message.send(`A ${this.name} game is already ongoing here, you cannot join it.`);
        }

        this.addPlayer(message.member);

        if (this.startingPlayers.length >= this.maxPlayers) {
            clearTimeout(this.countdown);
            this.countdown = null;
            this.initiated = true;

            await message.send(`You have joined the ${this.name} game.`);
            await this.channel.send('Maximum players reached, the game will now start.');

            const m = await this.startGame();
            this.started = true;
            return m;
        }

        return message.send(`You have joined the ${this.name} game.`);
    }

    addPlayer(player) {
        if (this.initiated || this.started || this.startingPlayers.length > this.maxPlayers) return false;
        if (this.startingPlayers.has(player.id)) return false;

        this.players.add(player.id);
        this.startingPlayers.add(player.id);

        const gameMap = this.handler.ongoingGames.get('poker');
        const channels = new Map();
        channels.set(this.channel.id, this);
        gameMap.set(player.id, channels);

        return true;
    }

    getPlayer(index) {
        const playerIDs = this.players.values();

        for (let i = 0; i < index; i++) {
            playerIDs.next();
        }

        return this.guild.member(playerIDs.next().value);
    }
}

module.exports = Game;
