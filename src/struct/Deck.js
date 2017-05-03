const Canvas = require('canvas');
const Card = require('./Card');
const fs = require('fs');

class Deck {
    constructor() {
        // 54 card images in total.
        // 52-53 are the jokers.
        // 54 is the card back.
        this.cards = [];
    }

    fill(includeJokers = false) {
        const cardAmount = includeJokers ? 54 : 52;

        for (let i = 0; i < cardAmount; i++) {
            const card = new Card(i);
            this.cards.push(card);
        }

        return this;
    }

    shuffle() {
        let curr = this.cards.length;
        let temp;
        let rand;

        while (curr !== 0) {
            rand = Math.random() * curr | 0;
            curr--;

            temp = this.cards[curr];
            this.cards[curr] = this.cards[rand];
            this.cards[rand] = temp;
        }

        return this;
    }

    draw(amount = 1) {
        return this.cards.splice(0, amount);
    }

    static async loadAssets() {
        const cardAmount = 55;
        const cardPromises = [];

        for (let i = 0; i < cardAmount; i++) {
            const promise = new Promise((resolve, reject) => {
                fs.readFile(`./src/resources/${i}.png`, (err, buffer) => {
                    if (err) return reject(err);
                    return resolve(buffer);
                });
            });

            cardPromises.push(promise);
        }

        this.CARD_IMAGES = await Promise.all(cardPromises);
    }

    static drawCards(cards) {
        const { Image } = Canvas;

        const height = 212;
        const width = 138 * cards.length;

        const canvas = new Canvas(width, height);
        const ctx = canvas.getContext('2d');

        for (const [i, card] of cards.entries()) {
            const image = new Image();
            image.src = card.image;
            ctx.drawImage(image, i * 138, 0, 138, 212);
        }

        return new Promise((resolve, reject) => {
            canvas.toBuffer((err, buffer) => {
                if (err) return reject(err);
                return resolve(buffer);
            });
        });
    }

    static generate(ids) {
        const deck = new Deck();
        const cards = Array.from({ length: ids.length }, (item, i) => new Card(ids[i]));
        deck.cards = cards;
        return deck;
    }
}

module.exports = Deck;
