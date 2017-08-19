var chai = require("chai")
var expect = chai.expect
var jspokerlib = require("./jspokerlib.js")
var PokerTable = jspokerlib.PokerTable
var Rank = jspokerlib.Rank
var Suit = jspokerlib.Suit

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
})