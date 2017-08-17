const Suit = {
    CLUBS: 0,
    DIAMONDS: 1,
    HEARTS: 2,
    SPADES: 3
}

const Rank = {
    ACE: 0,
    TWO: 1,
    THREE: 2,
    FOUR: 3,
    FIVE: 4,
    SIX: 5,
    SEVEN: 6,
    EIGHT: 7,
    NINE: 8,
    TEN: 9,
    JACK: 10,
    QUEEN: 11,
    KING: 12
}

class Exception {
    constructor(id, message) {
        this.message = message;
        this.id = id;
    }
}

class Card {
    constructor(suit, rank) {
        this.suit = suit
        this.rank = rank
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
        for (var i = this.cards - 1; i > 0; i--) {
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

class Player {
    constructor(money, name) {
        this.money = money
        this.name = name
        this.cards = []
    }

    addMoney(money) {
        this.money += money
    }

    setName(name) {
        this.name += name
    }
}

class Pot {
    constructor() {
        this.clearPot()
    }

    addToPot(pos, phase, value) {
        if (typeof(this[phase][pos]) === "undefined") {
            this[phase][pos] = 0
        }
        this[phase][pos] += value
    }

    clearPot() {
        this.preFlop = []
        this.flop = []
        this.turn = []
        this.river = []
    }
}

class PokerTable {
    constructor(buyin, smallBlind, bigBlind) {
        this.players = []
        this.buyin = buyin
        this.deck = new Deck()
        this.gameStarted = false
        this.button = 0
        this.burned = []
        this.community = []
        this.currentPlayer = 0
        this.playersInGame = []
        this.currentBet = 0
        this.smallBlind = smallBlind
        this.bigBlind = bigBlind
        this.currentPhase = "dealer"
        this.pot = new Pot()
    }

    addPlayer(name) {
        if (this.gameStarted) {
            throw new Exception("GameStartedException", "Can't add " + name + " to the table. Game already started.")
        }
        if (this.getNumberOfPlayers() == 10) {
            throw new Exception("FullTableException", "Can't add " + name + " to the table. 10 players already present.")
        }
        if (this.getPositionByName(name) > -1) {
            throw new Exception("SameNameException", "Can't add " + name + " to the table. Name already used.")
        }
        var player = new Player(this.buyin, name)
        this.players.push(player)
    }

    getNumberOfPlayers() {
        return this.players.length
    }

    nextPlayer(pos) {
        if (pos >= 0 && pos < this.getNumberOfPlayers()) {
            return (pos + 1) % this.getNumberOfPlayers()
        } else {
            return -1
        }
    }

    getPositionByName(name) {
        var pos = -1
        for (var i = 0; i < this.getNumberOfPlayers(); i++) {
            if (this.players[i].name === name) {
                pos = i
            }
        }
        return pos
    }

    _distributeCards() {
        //Burn before flop card
        this.burned.push(this.deck.selectTopCard())

        //Distribute first card to each player
        for (var player of this.players) {
            var firstCard = this.deck.selectTopCard()
            player.cards.push(firstCard)
        }

        //Distribute second card to each player
        for (var player of this.players) {
            var secondCard = this.deck.selectTopCard()
            player.cards.push(secondCard)
        }

        //Give flop to community
        this.community.push(this.deck.selectTopCard())
        this.community.push(this.deck.selectTopCard())
        this.community.push(this.deck.selectTopCard())

        //Burn before turn card
        this.burned.push(this.deck.selectTopCard())

        //Give turn to community
        this.community.push(this.deck.selectTopCard())

        //Burn before river card
        this.burned.push(this.deck.selectTopCard())

        //Give river to community
        this.community.push(this.deck.selectTopCard())
    }

    _getBlinds() {
        //Small blind bet
        this.currentPlayer = this.nextPlayer(this.button)
        this.players[this.currentPlayer].money -= this.smallBlind;
        this.pot.addToPot(this.currentPlayer, "preFlop", this.smallBlind)

        //Big blind bet
        this.currentPlayer = this.nextPlayer(this.currentPlayer)
        this.players[this.currentPlayer].money -= this.bigBlind;
        this.pot.addToPot(this.currentPlayer, "preFlop", this.bigBlind)
    }

    getTableSum() {
        var sum = 0
        for (var player of this.players) {
            sum += player.money
        }
        for (var bet of this.pot.preFlop) {
            sum += bet
        }
        for (var bet of this.pot.flop) {
            sum += bet
        }
        for (var bet of this.pot.turn) {
            sum += bet
        }
        for (var bet of this.pot.river) {
            sum += bet
        }
        return sum
    }

    getButtonName() {
        return this.players[this.button].name
    }

    getCurrentPlayerName() {
        return this.players[this.currentPlayer].name
    }

    startGame() {
        if (this.getNumberOfPlayers() < 2) {
            throw new Exception("NotEnoughPlayers", "There is not enough players to start game (minimum 2)")
        }
        if (this.gameStarted) {
            throw new Exception("GameAlreadyStarted", "A game is already started.")
        }
        this.gameStarted = true
        this.deck.shuffle()
        this.playersInGame
        this._distributeCards()
        this._getBlinds()
        this._startPreFlop()
    }

    nextPhase() {
        switch (currentPhase) {
            case "dealer":
                _startPreFlop()
                break
            case "preFlop":
                _startFlop()
                break
            case "flop":
                _startTurn()
                break
            case "turn":
                _startRiver()
                break
            default:
                throw new Exception("NoMorePhases", "No more phases on this game.")
                break
        }
    }

    _startPreFlop() {
        //Next player to big blind
        this.currentPlayer = this.nextPlayer(this.currentPlayer)
        this.currentBet = 0
        this.currentPhase = "preFlop"
    }

    _startFlop() {
        this.currentPlayer = smallBlind
        this.currentBet = 0
        this.currentPhase = "flop"
    }

    _startTurn() {
        this.currentPlayer = smallBlind
        this.currentBet = 0
        this.currentPhase = "turn"
    }

    _startRiver() {
        this.currentPlayer = smallBlind
        this.currentBet = 0
        this.currentPhase = "river"
    }

    bet(name, value) {
        var pos = this.getPositionByName(name)
        if (pos !== this.currentPlayer) {
            throw new Exception("NotYourTurn", "It is not your turn, " + name + ".")
        }
        if (value < this.currentBet) {
            throw new Exception("TooLowBet", "The current bet is " + bet + ". Please make a higher bet.")
        }
        //implement next player
    }
}

exports.PokerTable = PokerTable
exports.Rank = Rank
exports.Suit = Suit