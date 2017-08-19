var jspokerlib = require("../src/jspokerlib.js")
console.log(jspokerlib)
var PokerTable = jspokerlib.PokerTable

var pokerTable = new PokerTable(1000, 10, 20)

var names = ["Roland", "Susan", "Cuthbert", "Alain"]

var currentPhase = ""

function showCommunity() {
    var community = []
    pokerTable.getCommunity().map((card) => { community.push(card.toString()) })
    console.log(community)
    console.log()
}

function actionCallback(name, event, value, phase) {
    switch (event) {
        case "raise":
            console.log("TABLE> " + name + " raised " + value + ".")
            break
        case "bet":
            console.log("TABLE> " + name + " bet " + value + ".")
            break
        case "fold":
            console.log("TABLE> " + name + " folded.")
            break
        case "check":
            console.log("TABLE> " + name + " checked.")
            break
    }
    if (currentPhase != phase) {
        currentPhase = phase
        console.log()
        if (currentPhase === "endround") {
            console.log("TABLE> The round has ended.")
            showCommunity()
        } else {
            console.log("TABLE> The phase " + currentPhase + " started.")
            showCommunity()
            console.log("TABLE> It is " + pokerTable.getCurrentPlayerName() + " turn.")
        }
    }
}

function raise(name, value) {
    try {
        console.log(name + "> !raise " + value)
        pokerTable.raise(name, actionCallback, value)
    } catch (err) {
        console.log("TABLE> " + err.message)
    }
}

function bet(name) {
    try {
        console.log(name + "> !bet")
        pokerTable.bet(name, actionCallback, null)
    } catch (err) {
        console.log("TABLE> " + err.message)
    }
}

function fold(name) {
    try {
        console.log(name + "> !fold")
        pokerTable.fold(name, actionCallback, null)
    } catch (err) {
        console.log("TABLE> " + err.message)
    }
}

console.log()
for (name of names) {
    try {
        console.log(name + "> !join")
        pokerTable.addPlayerToTable(name)
        console.log("TABLE> " + name + " joined the table.")
    } catch (err) {
        console.log("TABLE> " + err.message)
    }
}
console.log()
try {
    pokerTable.startGame()
    currentPhase = pokerTable.getCurrentPhase()
    console.log("TABLE> Game started. " + pokerTable.getButtonName() + " is with the button.")
    console.log()
    console.log("TABLE> It is " + pokerTable.getCurrentPlayerName() + " turn.")
    bet("Roland")
    bet("Alain")
    bet("Roland")
    raise("Susan", 10)
    raise("Susan", 40)
    bet("Cuthbert")
    bet("Alain")
    fold("Roland")
    bet("Susan", 0)
    bet("Cuthbert")
    bet("Roland")
    raise("Alain", 20)
    bet("Susan")
    fold("Cuthbert")
    bet("Susan", 0)
    bet("Alain", 0)
    bet("Susan", 0)
    bet("Alain", 0)
    bet("Roland", 0)
} catch (err) {
    throw err.message
}