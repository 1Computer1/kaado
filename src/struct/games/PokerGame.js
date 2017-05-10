const Deck = require('../Deck');
const Game = require('../Game');
const { Hand } = require('pokersolver');

class PokerGame extends Game {
    constructor(message, players) {
        super('poker', message, players, {
            minPlayers: 2,
            maxPlayers: 8,
            waitTime: 30
        });

        this.deck = new Deck().fill().shuffle();

        this.currentRound = 0;
        this.tableCards = [];
        this.tableMoney = 0;

        this.currentTurn = 0;
        this.playerCards = new Map();
        this.playerBalances = new Map();

        // Eventually this will be a Map of people's starting balances for when there is an actual economy.
        // For now, everyone has a thousand dollars! Woo!
        this.startingBalance = 1000;
        this.playerAllIn = new Set();

        this.totalBets = new Map();
        this.roundBets = new Map();
        this.previousBets = [];
    }

    get currentPlayer() {
        return this.getPlayer(this.currentTurn);
    }

    get previousBet() {
        return this.previousBets[0];
    }

    async send(text, withCards = true) {
        const prefix = this.client.commandHandler.prefix();

        const embed = this.client.util.embed()
        .addField(`Round ${this.currentRound + 1}`, [
            text,
            `**${this.currentPlayer.displayName}** has a balance of $**${this.playerBalances.get(this.currentPlayer.id)}**.`,
            '',
            `Type \`${prefix}p bet <amount>\` to bet.`,
            `Type \`${prefix}p check\` to check.`,
            `Type \`${prefix}p fold\` to fold.`,
            `Type \`${prefix}p allIn\` to go all-in.`,
            `Type \`${prefix}p skip\` to skip after an all-in.`
        ]);

        const options = { embed };

        if (this.tableCards.length && withCards) {
            const image = await Deck.drawCards(this.tableCards);
            options.files = [
                {
                    attachment: image,
                    name: 'cards.png'
                }
            ];

            embed
            .setImage('attachment://cards.png')
            .addField('Cards on Table', this.tableCards.map(card => `${card.toEmojiForm()}\u2000(${card})`));
        }

        return this.channel.send(`${this.currentPlayer}, it is your turn!`, options);
    }

    async startGame() {
        const promises = [];

        for (const playerID of this.players) {
            const cards = this.deck.draw(2);

            this.playerCards.set(playerID, cards);
            this.playerBalances.set(playerID, this.startingBalance);
            this.totalBets.set(playerID, 0);

            const imagePromise = Deck.drawCards(cards);
            const embed = this.client.util.embed()
            .addField('Your Cards', cards.map(card => `${card.toEmojiForm()}\u2000(${card})`))
            .setImage('attachment://cards.png');

            const promise = imagePromise.then(image => this.client.users.get(playerID).send({
                files: [
                    {
                        attachment: image,
                        name: 'cards.png'
                    }
                ],
                embed
            }));

            promises.push(promise);
        }

        await Promise.all(promises);
        return this.send('The poker game has started!', false);
    }

    async endGame() {
        this.handler.removeGame(this);

        if (this.players.size === 1) {
            const embed = this.client.util.embed()
            .addField('Game Results', [
                'Everyone decided to fold!',
                `**${this.getPlayer(0).displayName}** wins $**${this.tableMoney}**!`
            ]);

            const options = {};

            if (this.tableCards.length) {
                const image = await Deck.drawCards(this.tableCards);
                options.file = {
                    attachment: image,
                    name: 'cards.png'
                };

                embed
                .setImage('attachment://cards.png')
                .addField('Cards on Table', this.tableCards.map(card => `${card.toEmojiForm()}\u2000(${card})`));
            }

            options.embed = embed;
            return this.channel.send(options);
        }

        const hands = [];

        for (const playerID of this.players) {
            const cards = this.playerCards.get(playerID);
            const mergedCards = this.tableCards.concat(cards).map(card => card.toShortForm());
            const hand = Hand.solve(mergedCards);
            hand.player = playerID;
            hand.original = cards;
            hands.push(hand);
        }

        const winners = Hand.winners(hands).map(hand => {
            return this.guild.member(hand.player).displayName;
        });

        const embed = this.client.util.embed()
        .addField('Game Results', [
            winners.length.plural('The winner is...', 'The winners are...'),
            `**${winners.join('**, **')}**`,
            '',
            `${winners.length.plural('They have', 'Each winner has')} won $**${Math.floor(this.tableMoney / winners.length)}**.`
        ]);

        embed.addField('Hands', hands.map(hand => {
            const name = this.guild.member(hand.player).displayName;
            const desc = hand.descr.replace(',', ':').replace(/'/g, '').replace(/&/g, 'and');
            const cards = hand.original.map(card => `${card.toEmojiForm()}\u2000(${card})`).join('\n');
            return `**${name}**: ${desc}\n${cards}`;
        }).join('\n\n'));

        const image = await Deck.drawCards(this.tableCards);

        embed
        .setImage('attachment://cards.png')
        .addField('Cards on Table', this.tableCards.map(card => `${card.toEmojiForm()}\u2000(${card})`));

        return this.channel.send({
            embed,
            files: [
                {
                    attachment: image,
                    name: 'cards.png'
                }
            ]
        });
    }

    async bet(amount) {
        if (amount === this.startingBalance) return this.allIn();

        const player = this.currentPlayer;

        const prevBal = this.playerBalances.get(player.id);
        const prevBet = this.roundBets.get(player.id) || 0;

        this.playerBalances.set(player.id, prevBal + prevBet - amount);
        this.roundBets.set(player.id, amount);
        this.totalBets.set(player.id, this.totalBets.get(player.id) - prevBet + amount);

        this.tableMoney -= prevBet;
        this.tableMoney += amount;

        this.previousBets.unshift(amount);
        if (this.previousBets.length > this.players.size) this.previousBets.pop();

        await this.channel.send([
            `**${player.displayName}** has bet $**${amount}**.`,
            `The total pool is now $**${this.tableMoney}**.`
        ]);

        return this.processNextTurn();
    }

    async check() {
        const player = this.currentPlayer;
        this.roundBets.set(player.id, 0);

        this.previousBets.unshift(0);
        if (this.previousBets.length > this.players.size) this.previousBets.pop();

        await this.channel.send([
            `**${player.displayName}** has decided to check.`,
            `The total pool is currently $**${this.tableMoney}**.`
        ]);

        return this.processNextTurn();
    }

    async fold() {
        const player = this.currentPlayer;
        this.players.delete(player.id);

        this.currentTurn -= 1;

        if (this.roundBets.has(player.id)) {
            const betIndex = this.previousBets.indexOf(this.roundBets.get(player.id));
            this.previousBets.splice(betIndex, 1);
        }

        await this.channel.send([
            `**${player.displayName}** has decided to fold.`,
            `The total pool is currently $**${this.tableMoney}**.`
        ]);

        if (this.players.size === 1) {
            return this.endGame();
        }

        return this.processNextTurn();
    }

    async skip() {
        const player = this.currentPlayer;

        await this.channel.send([
            `**${player.displayName}** had gone all-in and is skipping their turn.`,
            `The total pool is currently $**${this.tableMoney}**.`
        ]);

        this.previousBets.unshift(this.startingBalance);
        if (this.previousBets.length > this.players.size) this.previousBets.pop();

        return this.processNextTurn();
    }

    async allIn() {
        const player = this.currentPlayer;
        const prevBet = this.totalBets.get(player.id);

        this.playerAllIn.add(player.id);
        this.playerBalances.set(player.id, 0);
        this.roundBets.set(player.id, this.startingBalance);
        this.totalBets.set(player.id, this.startingBalance);

        this.tableMoney -= prevBet;
        this.tableMoney += this.startingBalance;

        this.previousBets.unshift(this.startingBalance);
        if (this.previousBets.length > this.players.size) this.previousBets.pop();

        await this.channel.send([
            `**${player.displayName}** has gone all-in!`,
            `The total pool is now $**${this.tableMoney}**.`
        ]);

        return this.processNextTurn();
    }

    incrementTurn() {
        this.currentTurn += 1;
        if (this.currentTurn >= this.players.size) {
            this.currentTurn = 0;
        }
    }

    processNextTurn() {
        if (this.previousBets.length === this.players.size && new Set(this.previousBets).size === 1) {
            return this.processNextRound();
        }

        this.incrementTurn();
        return this.send('The round continues...', false);
    }

    processNextRound() {
        if (this.currentRound === 0) {
            const cards = this.deck.draw(4);
            cards.shift();
            this.tableCards.push(...cards);
        } else
        if (this.currentRound >= 3) {
            return this.endGame();
        } else {
            const cards = this.deck.draw(2);
            cards.shift();
            this.tableCards.push(...cards);
        }

        this.currentTurn = 0;
        this.previousBets = [];
        this.roundBets = new Map();

        this.currentRound += 1;
        return this.send(this.currentRound === 1 ? 'Three cards have been drawn.' : 'A card has been drawn.');
    }
}

// Slightly hacky, but it works.
PokerGame.id = 'poker';
module.exports = PokerGame;
