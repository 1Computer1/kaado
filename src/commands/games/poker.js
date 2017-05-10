const { Command } = require('discord-akairo');

class PokerCommand extends Command {
    constructor() {
        super('poker', {
            aliases: ['poker', 'p'],
            args: [
                {
                    id: 'option',
                    type: ['start', ['bet', 'b'], ['check', 'c'], ['fold', 'f'], ['skip', 's'], ['allIn', 'all-in', 'a']],
                    default: 'start'
                },
                {
                    id: 'amount',
                    type: (word, message, args) => {
                        if (args.option === 'bet') {
                            return this.handler.resolver.type('integer')(word);
                        }

                        return '';
                    }
                }
            ],
            category: 'games',
            channelRestriction: 'guild'
        });
    }

    exec(message, { option, amount }) {
        const gameHandler = this.client.gameHandler;
        const conflictGame = gameHandler.findGame(message.member, message.channel);

        if (option === 'start') {
            if (conflictGame) {
                if (conflictGame.name !== 'poker') {
                    return message.send(`You are already in a ${conflictGame.name} game.`);
                }

                return message.send('You have already joined this poker game.');
            }

            const game = gameHandler.findExisting('poker', message.channel);

            if (!game) {
                const createdGame = gameHandler.createGame('poker', message);
                return message.send([
                    'A new poker game has been created.',
                    `A maximum of ${createdGame.maxPlayers} players can play.`,
                    `The game will start in ${createdGame.waitTime} seconds.`
                ]);
            }

            return game.handleMessage(message);
        }

        if (conflictGame && conflictGame.name !== 'poker') {
            return message.send(`You are already in a ${conflictGame.name} game.`);
        }

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

        if (option === 'skip') return this.execSkip(game, message);

        if (game.playerAllIn.has(game.currentPlayer.id)) {
            return message.send('You can only skip due to having gone all-in.');
        }

        return this[`exec${option.capitalize()}`](game, message, amount);
    }

    execBet(game, message, amount) {
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

    execCheck(game, message) {
        if (game.previousBet) {
            return message.send('You can only bet, fold, or go all-in at this point!');
        }

        return game.check();
    }

    execFold(game) {
        return game.fold();
    }

    execSkip(game, message) {
        if (!game.playerAllIn.has(game.currentPlayer.id)) {
            return message.send('You cannot skip unless you have gone all-in.');
        }

        return game.skip();
    }

    execAllIn(game) {
        return game.allIn();
    }
}

module.exports = PokerCommand;
