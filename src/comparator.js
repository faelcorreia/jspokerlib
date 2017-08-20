class Hand {
    constructor(community, cards) {
        this.hand = []
        for (var card of community) {
            this.hand.push(card)
        }
        for (var card of cards) {
            this.hand.push(card)
        }
    }

    sortByRank() {
        this.hand.sort((card1, card2) => {
            var ret = 0
            if (card1.rank.id < card2.rank.id)
                ret = -1
            else if (card1.rank.id > card2.rank.id)
                ret = 1
            else {
                if (card1.suit.id < card2.suit.id)
                    ret = -1
                else if (card1.suit.id > card2.suit.id)
                    ret = 1
                else
                    ret = 0
            }
            return ret
        })
    }

    sortBySuit() {
        this.hand.sort((card1, card2) => {
            var ret = 0
            if (card1.suit.id < card2.suit.id)
                ret = -1
            else if (card1.suit.id > card2.suit.id)
                ret = 1
            else {
                if (card1.rank.id < card2.rank.id)
                    ret = -1
                else if (card1.rank.id > card2.rank.id)
                    ret = 1
                else
                    ret = 0
            }
            return ret
        })
    }

    _createScore(type, values) {
        var score = type
        for (var value of values) {
            score += "." + value
        }
        return score
    }

    _getHighCard() {
        this.sortByRank()
        return this.hand[this.hand.length - 1]
    }

    _getPairs() {
        this.sortByRank()
        return this.hand.filter((card1) => {
            var cont = 0
            for (var card2 of this.hand) {
                if (card1.rank.id === card2.rank.id && card1.suit.id !== card2.suit.id) {
                    cont++
                }
            }
            return cont == 1
        })
    }

    _getThreeOfAKinds() {
        this.sortByRank()
        return this.hand.filter((card1) => {
            var cont = 1
            for (var card2 of this.hand) {
                if (card1.rank.id === card2.rank.id && card1.suit.id !== card2.suit.id) {
                    cont++
                }
            }
            return cont == 3
        })
    }

    _getFourOfAKinds() {
        this.sortByRank()
        return this.hand.filter((card1) => {
            var cont = 1
            for (var card2 of this.hand) {
                if (card1.rank.id === card2.rank.id && card1.suit.id !== card2.suit.id) {
                    cont++
                }
            }
            return cont == 4
        })
    }

    //TODO
    _duplicateAces() {

    }

    //TODO
    _getStraight() {
        this.sortByRank()
        var lastCardSequence = 0
        var firstCardSequence = 0
        for (var i = 0; i < this.hand.length - 4; i++) {
            var sequenceCount = 1
            var actual = i
            var card1 = this.hand[i]
            for (var j = i + 1; j < this.hand.length; j++) {
                var card2 = this.hand[j]
                if (card2.rank.id == card1.rank.id + 1) {
                    sequenceCount++
                    card1 = this.hand[j]
                    actual = j
                } else if (card2.rank.id == card1.rank.id) {
                    card1 = this.hand[j]
                    actual = j
                } else {
                    break
                }
            }
            if (sequenceCount == 5) {
                lastCardSequence = actual
                firstCardSequence = i
            }
        }
        //for (var i = 0; i < this.hand.length; i++) {
        //   var sequenceCount = 1
        //  var card1 = this.hand[i]
        // if (card1.rank.id === Rank.ACE.id) {
        //    for (var j = (i + 1) % this.hand.length; j < i;) {
        //       var card2 = this.hand[j]
        //  }
        // }
        // }
        if (lastCardSequence != firstCardSequence != 0) {
            return this.hand.slice(firstCardSequence, lastCardSequence + 1)
        } else {
            return []
        }
    }

    _getFlush() {
        this.sortBySuit()
        var cont = 0
        var flush = []
        for (var i = 0; i < this.hand.length - 4; i++) {
            var cont = 1
            var actual = i
            var card1 = this.hand[i]
            for (var j = i + 1; j < this.hand.length; j++) {
                var card2 = this.hand[j]
                if (card1.suit.id == card2.suit.id) {
                    cont++
                    actual = j
                }
            }
            if (cont >= 5) {
                flush = this.hand.slice(actual - cont + 1, actual + 1)
                break
            }
        }
        return flush
    }

    checkHighCard() {
        var highCard = this._getHighCard().rank.id
        return this._createScore(1, [highCard + 1])
    }

    checkPair() {
        var highPair = 0
        var score = 0
        var pairs = this._getPairs()
        if (pairs.length > 0) {
            highPair = pairs[pairs.length - 1].rank.id
            score = this._createScore(2, [highPair + 1])
        } else {
            score = this._createScore(2, [0])
        }
        return score
    }

    checkTwoPairs() {
        var highPair = 0
        var secondHighPair = 0
        var score = 0
        var pairs = this._getPairs()
        if (pairs.length / 2 > 1) {
            highPair = pairs[pairs.length - 1].rank.id
            secondHighPair = pairs[pairs.length - 3].rank.id
            score = this._createScore(3, [highPair + 1, secondHighPair + 1])
        } else {
            score = this._createScore(3, [0])
        }
        return score
    }

    checkThreeOfAKind() {
        var highThreeOfAKind = 0
        var score = 0
        var threeOfAKinds = this._getThreeOfAKinds()
        if (threeOfAKinds.length > 0) {
            highThreeOfAKind = threeOfAKinds[threeOfAKinds.length - 1].rank.id
            score = this._createScore(4, [highThreeOfAKind + 1])
        } else {
            score = this._createScore(4, [0])
        }
        return score
    }

    checkStraight() {
        var highStraight = 0
        var score = 0
        var straight = this._getStraight()
        if (straight.length > 0) {
            highStraight = straight[straight.length - 1].rank.id
            score = this._createScore(5, [highStraight + 1])
        } else {
            score = this._createScore(5, [0])
        }
        return score
    }

    checkFlush() {
        var score = 0
        var flush = this._getFlush()
        var highFlush = 0
        if (flush.length > 0) {
            highFlush = flush[flush.length - 1].rank.id
            score = this._createScore(6, flush.reverse().slice(0, 5).map((card) => { return card.rank.id + 1 }))
        } else {
            score = this._createScore(6, [0])
        }
        return score
    }

    checkFullHouse() {
        var highPair = 0
        var highThreeOfAKind = 0
        var score = 0
        var pairs = this._getPairs()
        var threeOfAKinds = this._getThreeOfAKinds()
        if (pairs.length > 0 && threeOfAKinds.length > 0) {
            highPair = pairs[pairs.length - 1].rank.id
            highThreeOfAKind = threeOfAKinds[threeOfAKinds.length - 1].rank.id
            score = this._createScore(7, [highThreeOfAKind + 1, highPair + 1])
        } else {
            score = this._createScore(7, [0])
        }
        return score
    }

    checkFourOfAKind() {
        var highFourOfAKind = 0
        var score = 0
        var fourOfAKinds = this._getFourOfAKinds()
        if (fourOfAKinds.length > 0) {
            highFourOfAKind = fourOfAKinds[fourOfAKinds.length - 1].rank.id
            score = this._createScore(8, [highFourOfAKind + 1])
        } else {
            score = this._createScore(8, [0])
        }
        return score
    }

    //TODO STRAIGHT
    checkStraightFlush() {
        var score = "9.0"
        return score
    }
}

class Comparator {
    constructor(pokerTable) {
        this.pokerTable = pokerTable
        this.hands = []
    }

    comparePlayers() {
        for (var player of this.pokerTable.players) {
            player.points = {}
            var playerHand = new Hand(this.pokerTable.community, player.cards)
            playerHand.sortByRank()
            player.points.highCard = playerHand.checkHighCard()
        }
    }
}

exports.Comparator = Comparator
exports.Hand = Hand