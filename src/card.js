const Suit = {
    CLUBS: { id: 0, name: "Clubs" },
    DIAMONDS: { id: 1, name: "Diamonds" },
    HEARTS: { id: 2, name: "Hearts" },
    SPADES: { id: 3, name: "Spades" }
}

const Rank = {
    ACE: { id: 0, name: "Ace" },
    TWO: { id: 1, name: "Two" },
    THREE: { id: 2, name: "Three" },
    FOUR: { id: 3, name: "Four" },
    FIVE: { id: 4, name: "Five" },
    SIX: { id: 5, name: "Six" },
    SEVEN: { id: 6, name: "Seven" },
    EIGHT: { id: 7, name: "Eight" },
    NINE: { id: 8, name: "Nine" },
    TEN: { id: 9, name: "Ten" },
    JACK: { id: 10, name: "Jack" },
    QUEEN: { id: 11, name: "Queen" },
    KING: { id: 12, name: "King" }
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