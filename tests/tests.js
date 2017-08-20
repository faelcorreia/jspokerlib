var chai = require("chai")
var expect = chai.expect
var jspokerlib = require("../src/jspokerlib.js")
var PokerTable = jspokerlib.PokerTable
var Rank = jspokerlib.Rank
var Suit = jspokerlib.Suit
var Hand = require("../src/comparator.js").Hand
var Card = require("../src/card.js").Card

var names = ["Roland", "Susan", "Jonas", "Thorin", "Eddie", "Jack", "Detta", "Oi", "Cuthbert", "Steven", "Roy"]

function addPlayersToTable(pokerTable, n) {
    if (n <= names.length) {
        for (var i = 0; i < n; i++) {
            pokerTable.addPlayerToTable(names[i])
        }
    }
}

describe("PokerTable", () => {
    it("should have buyin as the same value of the constructor argument", () => {
        var buyin = parseInt(Math.random() * 1000)
        var pokerTable = new PokerTable(buyin)
        expect(pokerTable.buyin).to.equal(buyin)
    })

    describe("Players", () => {

        it("should have the number of players 0 if no one is added", () => {
            var pokerTable = new PokerTable(1000, 10, 20)
            expect(pokerTable.getNumberOfPlayers()).to.equal(0)
        })

        it("should have the number of players 3 after three players added with the addPlayerToTable method", () => {
            var pokerTable = new PokerTable(1000, 10, 20)
            addPlayersToTable(pokerTable, 3)
            expect(pokerTable.getNumberOfPlayers()).to.equal(3)
        })

        it("should not let game start with 0 players", () => {
            var pokerTable = new PokerTable(1000, 10, 20)
            try {
                pokerTable.startGame()
            } catch (err) {
                expect(err.id).to.equal("NotEnoughPlayers")
            }
            expect(pokerTable.gameStarted).to.false
        })

        it("should not let game start with 1 players", () => {
            var pokerTable = new PokerTable(1000, 10, 20)
            addPlayersToTable(pokerTable, 1)
            try {
                pokerTable.startGame()
            } catch (err) {
                expect(err.id).to.equal("NotEnoughPlayers")
            }
            expect(pokerTable.gameStarted).to.false
        })

        it("should let game start with 2 players", () => {
            var pokerTable = new PokerTable(1000, 10, 20)
            addPlayersToTable(pokerTable, 2)
            try {
                pokerTable.startGame()
            } catch (err) {
                expect(err).to.undefined
            }
            expect(pokerTable.gameStarted).to.true
        })


        it("should not let add player with game started", () => {
            var pokerTable = new PokerTable(1000, 10, 20)
            addPlayersToTable(pokerTable, 2)
            pokerTable.startGame()
            try {
                pokerTable.addPlayerToTable("Susan")
            } catch (err) {
                expect(err.id).to.equal("GameStartedException")
            }
            expect(pokerTable.players.length).to.equal(2)
        })

        it("should have 2 cards each one after game started", () => {
            var pokerTable = new PokerTable(1000, 10, 20)
            addPlayersToTable(pokerTable, 3)
            pokerTable.startGame()
            var twoCards = true
            for (var player of pokerTable.players) {
                twoCards = player.cards.length == 2
                if (!twoCards)
                    break
            }
            expect(twoCards).to.true
        })


        it("should not let add more then 10 players", () => {
            var pokerTable = new PokerTable(1000, 10, 20)
            addPlayersToTable(pokerTable, 10)
            try {
                pokerTable.addPlayerToTable("Roy")
            } catch (err) {
                expect(err.id).to.equal("FullTableException")
            }
            try {
                pokerTable.addPlayerToTable("Henry")
            } catch (err) {
                expect(err.id).to.equal("FullTableException")
            }
            expect(pokerTable.players.length).to.equal(10)
        })

        it("should not let add two players with same name", () => {
            var pokerTable = new PokerTable(1000, 10, 20)
            addPlayersToTable(pokerTable, 1)
            try {
                pokerTable.addPlayerToTable("Roland")
            } catch (err) {
                expect(err.id).to.equal("SameNameException")
            }
            pokerTable.addPlayerToTable("Susan")
            expect(pokerTable.players.length).to.equal(2)
        })
    })
    describe("Game", () => {
        it("should not let game start without finish a already started game first", () => {
            var pokerTable = new PokerTable(1000, 10, 20)
            addPlayersToTable(pokerTable, 2)
            pokerTable.startGame()
            try {
                pokerTable.startGame()
            } catch (err) {
                expect(err.id).to.equal("GameAlreadyStarted")
            }
        })

        it("should have exact money of 2 buyins in a table with 2 players after game started (and blinds collected)", () => {
            var pokerTable = new PokerTable(1000, 10, 20)
            addPlayersToTable(pokerTable, 2)
            pokerTable.startGame()
            expect(pokerTable.getTableSum()).to.equal(2000)
        })
    })


    describe("Deck", () => {
        it("should have an array of cards with size of 52", () => {
            var pokerTable = new PokerTable(1000, 10, 20)
            expect(pokerTable.deck.cards.length).to.equal(52)
        })

        it("should have an array of 52 different types of cards and ordered", () => {
            var pokerTable = new PokerTable(1000, 10, 20)
            var ordered = true
            var i = 0
            for (var rank in Rank) {
                for (var suit in Suit) {
                    var card = pokerTable.deck.cards[i]
                    if (card.suit !== Suit[suit] || card.rank !== Rank[rank])
                        ordered = false
                    if (!ordered)
                        break
                    i++
                }
                if (!ordered)
                    break
            }
            expect(ordered).to.true
        })

        it("should have 36 cards after game is starded in a table with 4 players", () => {
            var pokerTable = new PokerTable(1000, 10, 20)
            addPlayersToTable(pokerTable, 4)
            pokerTable.startGame()
            expect(pokerTable.deck.cards.length).to.equal(36)
        })
    })

    describe("Community", () => {
        it("should have 5 cards after game is started", () => {
            var pokerTable = new PokerTable(1000, 10, 20)
            addPlayersToTable(pokerTable, 2)
            pokerTable.startGame()
            expect(pokerTable.community.length).to.equal(5)
        })
    })

    describe("Hand", () => {
        it("should return 1.10 in a High Card test - Jack of Spades", () => {
            var hand = new Hand([], [])
            hand.hand.push(new Card(Suit.SPADES, Rank.JACK))
            hand.hand.push(new Card(Suit.SPADES, Rank.TWO))
            hand.hand.push(new Card(Suit.CLUBS, Rank.THREE))
            hand.hand.push(new Card(Suit.HEARTS, Rank.TEN))
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.FOUR))
            hand.hand.push(new Card(Suit.CLUBS, Rank.FOUR))
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.TWO))
            hand.sortByRank()
            var check = hand.checkHighCard()
            expect(check).to.equal("1.10")
        })

        it("should return 2.8 in a Pair test - Nines", () => {
            var hand = new Hand([], [])
            hand.hand.push(new Card(Suit.SPADES, Rank.JACK))
            hand.hand.push(new Card(Suit.SPADES, Rank.NINE))
            hand.hand.push(new Card(Suit.CLUBS, Rank.THREE))
            hand.hand.push(new Card(Suit.HEARTS, Rank.TEN))
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.FOUR))
            hand.hand.push(new Card(Suit.CLUBS, Rank.FOUR))
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.NINE))
            hand.sortByRank()
            var check = hand.checkPair()
            expect(check).to.equal("2.8")
        })

        it("should return 2.0 in a Pair test - no pairs", () => {
            var hand = new Hand([], [])
            hand.hand.push(new Card(Suit.SPADES, Rank.JACK))
            hand.hand.push(new Card(Suit.SPADES, Rank.FIVE))
            hand.hand.push(new Card(Suit.CLUBS, Rank.THREE))
            hand.hand.push(new Card(Suit.HEARTS, Rank.TEN))
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.FOUR))
            hand.hand.push(new Card(Suit.CLUBS, Rank.SIX))
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.NINE))
            hand.sortByRank()
            var check = hand.checkPair()
            expect(check).to.equal("2.0")
        })

        it("should return 3.10.2 in a Two Pair test - Jacks and Threes", () => {
            var hand = new Hand([], [])
            hand.hand.push(new Card(Suit.SPADES, Rank.JACK))
            hand.hand.push(new Card(Suit.HEARTS, Rank.JACK))
            hand.hand.push(new Card(Suit.CLUBS, Rank.THREE))
            hand.hand.push(new Card(Suit.HEARTS, Rank.THREE))
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.FOUR))
            hand.hand.push(new Card(Suit.CLUBS, Rank.SIX))
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.NINE))
            hand.sortByRank()
            var check = hand.checkTwoPairs()
            expect(check).to.equal("3.10.2")
        })

        it("should return 3.0 in a Two Pair test - only one pair", () => {
            var hand = new Hand([], [])
            hand.hand.push(new Card(Suit.SPADES, Rank.JACK))
            hand.hand.push(new Card(Suit.HEARTS, Rank.JACK))
            hand.hand.push(new Card(Suit.CLUBS, Rank.THREE))
            hand.hand.push(new Card(Suit.HEARTS, Rank.QUEEN))
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.FOUR))
            hand.hand.push(new Card(Suit.CLUBS, Rank.SIX))
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.NINE))
            hand.sortByRank()
            var check = hand.checkTwoPairs()
            expect(check).to.equal("3.0")
        })

        it("should return 4.7 in a Three Of A Kind test - Eights", () => {
            var hand = new Hand([], [])
            hand.hand.push(new Card(Suit.SPADES, Rank.EIGHT))
            hand.hand.push(new Card(Suit.HEARTS, Rank.EIGHT))
            hand.hand.push(new Card(Suit.CLUBS, Rank.EIGHT))
            hand.hand.push(new Card(Suit.HEARTS, Rank.QUEEN))
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.FOUR))
            hand.hand.push(new Card(Suit.CLUBS, Rank.SIX))
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.NINE))
            hand.sortByRank()
            var check = hand.checkThreeOfAKind()
            expect(check).to.equal("4.7")
        })

        it("should return 4.0 in a Three Of A Kind test - no three of a kinds", () => {
            var hand = new Hand([], [])
            hand.hand.push(new Card(Suit.SPADES, Rank.EIGHT))
            hand.hand.push(new Card(Suit.HEARTS, Rank.TWO))
            hand.hand.push(new Card(Suit.CLUBS, Rank.EIGHT))
            hand.hand.push(new Card(Suit.HEARTS, Rank.QUEEN))
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.FOUR))
            hand.hand.push(new Card(Suit.CLUBS, Rank.SIX))
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.NINE))
            hand.sortByRank()
            var check = hand.checkThreeOfAKind()
            expect(check).to.equal("4.0")
        })

        it("should return 5.13 in a Straight test - 10 to A", () => {
            var hand = new Hand([], [])
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.NINE))
            hand.hand.push(new Card(Suit.SPADES, Rank.TEN))
            hand.hand.push(new Card(Suit.HEARTS, Rank.JACK))
            hand.hand.push(new Card(Suit.CLUBS, Rank.QUEEN))
            hand.hand.push(new Card(Suit.HEARTS, Rank.KING))
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.KING))
            hand.hand.push(new Card(Suit.CLUBS, Rank.ACE))
            hand.sortByRank()
            var check = hand.checkStraight()
            expect(check).to.equal("5.13")
        })

        it("should return 5.4 in a Straight test - A to 5", () => {
            var hand = new Hand([], [])
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.ACE))
            hand.hand.push(new Card(Suit.SPADES, Rank.TWO))
            hand.hand.push(new Card(Suit.HEARTS, Rank.THREE))
            hand.hand.push(new Card(Suit.CLUBS, Rank.FOUR))
            hand.hand.push(new Card(Suit.HEARTS, Rank.FIVE))
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.KING))
            hand.hand.push(new Card(Suit.CLUBS, Rank.ACE))
            hand.sortByRank()
            var check = hand.checkStraight()
            expect(check).to.equal("5.4")
        })

        it("should return 5.0 in a Straight test - no straights", () => {
            var hand = new Hand([], [])
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.TEN))
            hand.hand.push(new Card(Suit.SPADES, Rank.TWO))
            hand.hand.push(new Card(Suit.HEARTS, Rank.THREE))
            hand.hand.push(new Card(Suit.CLUBS, Rank.FOUR))
            hand.hand.push(new Card(Suit.HEARTS, Rank.FIVE))
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.KING))
            hand.hand.push(new Card(Suit.CLUBS, Rank.ACE))
            hand.sortByRank()
            var check = hand.checkStraight()
            expect(check).to.equal("5.0")
        })

        it("should return 6.13.12.4.3.2 in a Flush test - high Ace", () => {
            var hand = new Hand([], [])
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.ACE))
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.TWO))
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.THREE))
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.FOUR))
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.FIVE))
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.KING))
            hand.hand.push(new Card(Suit.CLUBS, Rank.ACE))
            hand.sortByRank()
            var check = hand.checkFlush()
            expect(check).to.equal("6.13.12.4.3.2")
        })

        it("should return 6.12.11.4.3.2 in a Flush test - high King", () => {
            var hand = new Hand([], [])
            hand.hand.push(new Card(Suit.CLUBS, Rank.ACE))
            hand.hand.push(new Card(Suit.CLUBS, Rank.TWO))
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.THREE))
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.FOUR))
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.FIVE))
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.KING))
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.QUEEN))
            hand.sortByRank()
            var check = hand.checkFlush()
            expect(check).to.equal("6.12.11.4.3.2")
        })

        it("should return 7.13.12 in a Full house test - Three Aces and two kings", () => {
            var hand = new Hand([], [])
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.ACE))
            hand.hand.push(new Card(Suit.SPADES, Rank.ACE))
            hand.hand.push(new Card(Suit.HEARTS, Rank.KING))
            hand.hand.push(new Card(Suit.CLUBS, Rank.ACE))
            hand.hand.push(new Card(Suit.HEARTS, Rank.FIVE))
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.KING))
            hand.hand.push(new Card(Suit.CLUBS, Rank.ACE))
            hand.sortByRank()
            var check = hand.checkFullHouse()
            expect(check).to.equal("7.13.12")
        })

        it("should return 7.3.9 in a Full house test - Three fours and two tens", () => {
            var hand = new Hand([], [])
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.ACE))
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.FOUR))
            hand.hand.push(new Card(Suit.HEARTS, Rank.TEN))
            hand.hand.push(new Card(Suit.CLUBS, Rank.TEN))
            hand.hand.push(new Card(Suit.HEARTS, Rank.FOUR))
            hand.hand.push(new Card(Suit.SPADES, Rank.THREE))
            hand.hand.push(new Card(Suit.CLUBS, Rank.FOUR))
            hand.sortByRank()
            var check = hand.checkFullHouse()
            expect(check).to.equal("7.3.9")
        })

        it("should return 7.0 in a Full house test - no full houses", () => {
            var hand = new Hand([], [])
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.ACE))
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.FOUR))
            hand.hand.push(new Card(Suit.HEARTS, Rank.TEN))
            hand.hand.push(new Card(Suit.CLUBS, Rank.TEN))
            hand.hand.push(new Card(Suit.HEARTS, Rank.FOUR))
            hand.hand.push(new Card(Suit.SPADES, Rank.THREE))
            hand.hand.push(new Card(Suit.CLUBS, Rank.FIVE))
            hand.sortByRank()
            var check = hand.checkFullHouse()
            expect(check).to.equal("7.0")
        })

        it("should return 8.13 in a Four Of A Kind test - ACEs", () => {
            var hand = new Hand([], [])
            hand.hand.push(new Card(Suit.SPADES, Rank.ACE))
            hand.hand.push(new Card(Suit.HEARTS, Rank.ACE))
            hand.hand.push(new Card(Suit.CLUBS, Rank.ACE))
            hand.hand.push(new Card(Suit.HEARTS, Rank.QUEEN))
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.ACE))
            hand.hand.push(new Card(Suit.CLUBS, Rank.SIX))
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.NINE))
            hand.sortByRank()
            var check = hand.checkFourOfAKind()
            expect(check).to.equal("8.13")
        })

        it("should return 8.0 in a Four Of A Kind test - no four of a kinds", () => {
            var hand = new Hand([], [])
            hand.hand.push(new Card(Suit.SPADES, Rank.EIGHT))
            hand.hand.push(new Card(Suit.HEARTS, Rank.TWO))
            hand.hand.push(new Card(Suit.CLUBS, Rank.EIGHT))
            hand.hand.push(new Card(Suit.HEARTS, Rank.QUEEN))
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.FOUR))
            hand.hand.push(new Card(Suit.CLUBS, Rank.SIX))
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.NINE))
            hand.sortByRank()
            var check = hand.checkFourOfAKind()
            expect(check).to.equal("8.0")
        })

        it("should return 9.13 in a Straight Flush test - 10 to A", () => {
            var hand = new Hand([], [])
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.NINE))
            hand.hand.push(new Card(Suit.CLUBS, Rank.TEN))
            hand.hand.push(new Card(Suit.CLUBS, Rank.JACK))
            hand.hand.push(new Card(Suit.CLUBS, Rank.QUEEN))
            hand.hand.push(new Card(Suit.HEARTS, Rank.KING))
            hand.hand.push(new Card(Suit.CLUBS, Rank.KING))
            hand.hand.push(new Card(Suit.CLUBS, Rank.ACE))
            hand.sortByRank()
            var check = hand.checkStraightFlush()
            expect(check).to.equal("9.13")
        })

        it("should return 9.4 in a Straight Flush test - A to 5", () => {
            var hand = new Hand([], [])
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.ACE))
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.TWO))
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.THREE))
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.FOUR))
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.FIVE))
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.KING))
            hand.hand.push(new Card(Suit.CLUBS, Rank.ACE))
            hand.sortByRank()
            var check = hand.checkStraightFlush()
            expect(check).to.equal("9.4")
        })

        it("should return 9.0 in a Straight Flush test - no straights", () => {
            var hand = new Hand([], [])
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.TEN))
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.TWO))
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.THREE))
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.FOUR))
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.FIVE))
            hand.hand.push(new Card(Suit.DIAMONDS, Rank.KING))
            hand.hand.push(new Card(Suit.CLUBS, Rank.ACE))
            hand.sortByRank()
            var check = hand.checkStraightFlush()
            expect(check).to.equal("9.0")
        })
    })
})