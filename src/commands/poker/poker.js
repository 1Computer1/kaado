const { Command } = require('discord-akairo');

class PokerCommand extends Command {
    constructor() {
        super('poker', {
            aliases: ['poker'],
            category: 'poker',
            channelRestriction: 'guild',
            description: [
                'poker',
                'Starts a game of poker or joins an existing one.'
            ]
        });
    }

    exec(message) {
        // Eventually, something should be done about the commands.
        // Just in case more games get added that requires the same actions, i.e. betting.

        const gameHandler = this.client.gameHandler;
        const conflictGame = gameHandler.findGame(message.member, message.channel);

        if (conflictGame) {
            if (conflictGame.name !== 'poker') {
                return message.send(`You are already in a ${conflictGame.name} game.`);
            }

            return message.send('You have already joined this poker game.');
        }

        const game = gameHandler.findExisting('poker', message.channel);

        if (!game) {
            const createdGame = gameHandler.createGame(this.id, message);
            return message.send([
                'A new poker game has been created.',
                `A maximum of ${createdGame.maxPlayers} players can play.`,
                `The game will start in ${createdGame.waitTime} seconds.`
            ]);
        }

        return game.handleMessage(message);
    }
}

module.exports = PokerCommand;
