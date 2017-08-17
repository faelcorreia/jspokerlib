var jspokerlib = require("../jspokerlib.js")
var PokerTable = jspokerlib.PokerTable

var pokerTable = new PokerTable(1000, 10, 20)

var names = ["Roland", "Susan", "Cuthbert", "Alain"]

function bet(name, value) {
    try {
        console.log(name + "> !bet 10")
        pokerTable.bet(name, 10)
        console.log(name + " bet 10.")
    } catch (err) {
        console.log(err.message)
    }
}

console.log()
for (name of names) {
    try {
        console.log(name + "> !join")
        pokerTable.addPlayer(name)
        console.log(name + " joined the table.")
    } catch (err) {
        console.log(err.message)
    }
}
console.log()
try {
    pokerTable.startGame()
    console.log("Game started. " + pokerTable.getButtonName() + " is with the button.")
    console.log()
    console.log("It is " + pokerTable.getCurrentPlayerName() + " turn.")
    bet("Roland", 10)
    bet("Alain", 10)
    console.log("It is " + pokerTable.getCurrentPlayerName() + " turn.")
} catch (err) {
    throw JSON.stringify(err)
}