class Player {
    constructor(money, name) {
        this.money = money
        this.name = name
        this.pot = {
            preFlop: 0,
            flop: 0,
            turn: 0,
            river: 0
        }
        this.onRound = true
        this.cards = []
    }

    addMoney(value) {
        this.money += value
    }

    transferMoneyToPot(value, phase) {
        this.money -= value
        this.pot[phase] += value
    }

    setName(name) {
        this.name += name
    }

    getCurrentValueFromPlayer(phase) {
        return this.pot[phase]
    }
}

exports.Player = Player