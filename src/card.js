const Suit = {
    CLUBS: { id: 0, name: "Clubs" },
    DIAMONDS: { id: 1, name: "Diamonds" },
    HEARTS: { id: 2, name: "Hearts" },
    SPADES: { id: 3, name: "Spades" }
}

const Rank = {
    TWO: { id: 0, name: "Two" },
    THREE: { id: 1, name: "Three" },
    FOUR: { id: 2, name: "Four" },
    FIVE: { id: 3, name: "Five" },
    SIX: { id: 4, name: "Six" },
    SEVEN: { id: 5, name: "Seven" },
    EIGHT: { id: 6, name: "Eight" },
    NINE: { id: 7, name: "Nine" },
    TEN: { id: 8, name: "Ten" },
    JACK: { id: 9, name: "Jack" },
    QUEEN: { id: 10, name: "Queen" },
    KING: { id: 11, name: "King" },
    ACE: { id: 12, name: "Ace" }
}

class Card {
    constructor(suit, rank) {
        this.suit = suit
        this.rank = rank
    }

    toString() {
        return this.rank.name + " of " + this.suit.name
    }
}

class Deck {
    constructor() {
        this.cards = []
        for (var rank in Rank) {
            for (var suit in Suit) {
                var card = new Card(Suit[suit], Rank[rank])
                this.cards.push(card)
            }
        }
    }

    // Fisher-Yates shuffle
    shuffle() {
        var rand = Math.floor(Math.random() * this.cards.length)
        for (var i = this.cards.length - 1; i >= 0; i--) {
            var index = Math.floor(Math.random() * this.cards.length)
            var tmp = this.cards[index]
            this.cards[index] = this.cards[i]
            this.cards[i] = tmp
        }
    }

    selectTopCard() {
        return this.cards.pop()
    }
}

exports.Suit = Suit
exports.Rank = Rank
exports.Card = Card
exports.Deck = Deck