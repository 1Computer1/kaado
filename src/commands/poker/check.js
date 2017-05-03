const { Command } = require('discord-akairo');

class CheckCommand extends Command {
    constructor() {
        super('check', {
            aliases: ['check', 'c'],
            category: 'poker',
            channelRestriction: 'guild',
            description: [
                'check',
                'Checks for the round.'
            ]
        });
    }

    exec(message) {
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

        if (game.previousBet) {
            return message.send('You can only bet, fold, or go all-in at this point!');
        }

        return game.check();
    }
}

module.exports = CheckCommand;
