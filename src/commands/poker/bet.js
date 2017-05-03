const { Command } = require('discord-akairo');

class BetCommand extends Command {
    constructor() {
        super('bet', {
            aliases: ['bet', 'b'],
            category: 'poker',
            channelRestriction: 'guild',
            args: [
                {
                    id: 'amount',
                    match: 'content',
                    type: 'integer'
                }
            ],
            description: [
                'bet <amount>',
                'Bets some money.'
            ]
        });
    }

    exec(message, { amount }) {
        const gameHandler = this.client.gameHandler;

        const conflictGame = gameHandler.findGame(message.member, message.channel);
        if (conflictGame && conflictGame.name !== 'poker') return message.send(`You are already in a ${conflictGame.name} game.`);

        const game = gameHandler.findExisting('poker', message.channel);

        if (!game) {
            return message.send('A poker game does not exist to play on.');
        }

        if (!game.players.has(message.member.id)) {
            return message.send('You are not part of the poker game.');
        }

        if (!game.started) {
            return message.send('The poker game has not started!');
        }

        if (game.currentPlayer.id !== message.member.id) {
            return message.send('It is not your turn to play!');
        }

        if (game.playerAllIn.has(game.currentPlayer.id)) {
            return message.send('You can only skip due to having gone all-in.');
        }

        if (amount < 1) {
            return message.send('You are not allowed to bet that little money!');
        }

        if (amount > 1000) {
            return message.send('You are not allowed to bet that much money!');
        }

        if (game.playerBalances.get(game.currentPlayer.id) + game.roundBets.get(game.currentPlayer.id) - amount < 0) {
            return message.send('You do not have enough money to bet!');
        }

        if (amount !== game.previousBet && amount < game.previousBet * 2) {
            return message.send(`You need to bet equal or at least twice the previous bet of $**${game.previousBet}**!`);
        }

        return game.bet(amount);
    }
}

module.exports = BetCommand;
