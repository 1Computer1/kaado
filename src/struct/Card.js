class Card {
    constructor(id) {
        this.id = id;

        this.suitID = Math.floor(this.id / 13);
        this.nameID = this.id % 13;

        this.suit = Card.SUITS[this.suitID];
        this.name = Card.NAMES[this.nameID];

        if (this.suit === Card.SUIT_IDS.JOKER) {
            this.name = this.nameID === 0 ? 'black' : 'red';
        }
    }

    get image() {
        const Deck = require('./Deck');
        return Deck.CARD_IMAGES[this.id];
    }

    toShortForm() {
        const shortName = this.nameID <= 7 ? this.nameID + 2 : this.name[0].toUpperCase();
        const shortSuit = this.suit[0];
        return `${shortName}${shortSuit}`;
    }

    toLongForm() {
        return `${this.name.capitalize()} of ${this.suit.capitalize()}`;
    }

    toEmojiForm() {
        const emojiName = this.nameID <= 7 ? `:${this.name}:` : `:regional_indicator_${this.name[0]}:`;
        const emojiSuit = `:${this.suit}:`;
        return `${emojiName}${emojiSuit}`;
    }

    toString() {
        return this.toLongForm();
    }
}

Card.SUITS = [
    'spades',
    'clubs',
    'diamonds',
    'hearts',
    'joker'
];

Card.SUIT_IDS = {
    SPADES: 0,
    CLUBS: 1,
    DIAMONDS: 2,
    HEARTS: 3,
    JOKER: 4
};

Card.NAMES = [
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
    'jack',
    'queen',
    'king',
    'ace'
];

Card.NAME_IDS = {
    TWO: 0,
    THREE: 1,
    FOUR: 2,
    FIVE: 3,
    SIX: 4,
    SEVEN: 5,
    EIGHT: 6,
    NINE: 7,
    TEN: 8,
    JACK: 9,
    QUEEN: 10,
    KING: 11,
    ACE: 12
};

module.exports = Card;
