const { AkairoModule } = require('discord-akairo');

class Game extends AkairoModule {
    constructor(id, message, players, options = {}) {
        super(id, null, options);

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

        this.name = options.name || this.id;
        this.minPlayers = options.minPlayers || 1;
        this.maxPlayers = options.maxPlayers || 2;
        this.waitTime = options.waitTime || 30;
        this.entryFee = options.entryFee || 0;

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
            await this.preGame();
            await this.startGame();
            this.started = true;
        }, this.waitTime * 1000);

        // Initiated means maximum players reached or countdown reached.
        // Started means the startGame method has finished.
        this.initiated = false;
        this.started = false;
    }

    async preGame() {
        if (this.entryFee) {
            for (const playerID of this.players) {
                const bal = this.client.profiles.get(playerID, 'balance', 0);
                await this.client.profiles.set(playerID, 'balance', bal - this.entryFee); // eslint-disable-line no-await-in-loop
            }

            await this.channel.send(`${this.entryFee.toLocaleString()} \\🍬 has been collected from each player.`);
        }
    }

    startGame() {
        throw new Error(`${this.constructor.name}#startGame not implemented.`);
    }

    async handleMessage(message) {
        if (this.initiated) {
            return message.send(`A ${this.name} game is already ongoing here, you cannot join it.`);
        }

        const conflictGame = this.handler.findGame(message.member, message.channel);
        if (conflictGame && conflictGame.id === 'poker') {
            return message.send(`You have already joined this ${this.name} game.`);
        }

        if (this.entryFee && this.client.profiles.get(message.member.id, 'balance', 0) < this.entryFee) {
            return message.send(`You need ${this.entryFee.toLocaleString()} \\🍬 to join this game.`);
        }

        this.addPlayer(message.member);

        if (this.startingPlayers.length >= this.maxPlayers) {
            clearTimeout(this.countdown);
            this.countdown = null;
            this.initiated = true;

            await message.send(`You have joined the ${this.name} game.`);
            await this.channel.send('Maximum players reached, the game will now start.');

            await this.preGame();
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

        const gameMap = this.handler.ongoingGames.get(this.id);
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
