// Webpage 
const playerNameEl = document.getElementById("player-name")
const statMetalEl = document.getElementById("stat-metal")
const statCrystalEl = document.getElementById("stat-crystal")
const statEnergyEl = document.getElementById("stat-energy")
const gameTickBtn = document.getElementById("game-tick-btn")

gameTickBtn.addEventListener("click", function() {
    gameTick()
})

// GAME LOGIC
const currentGame = "season1"
const currentPlayer = "Iris"

class game {
    constructor(name) {
        this.name = name
        this.startDate = Date.now()
        this.players = {} // Updated to object, will contain player name(later id and highscore)
    }
}

// Create current game, if not in cloud
if (localStorage.getItem(currentGame) === null) {
    const currentGameObj = new game(currentGame)
    cloudSave(currentGameObj.name, currentGameObj)
    console.log("Created save file")
}

// Player fuctions
class player {
    constructor(name) {
        // this.id = Math.floor(Math.random() * 1000000)
        this.name = name
        this.startDate = Date.now()
        this.lastAction = Date.now()

        this.metal = 50
        this.crystal = 0
        this.energy = 0

        this.metalMultiplier = 1
        this.crystalMultiplier = 0.1
    }
}

function createPlayer(name) {
    const playerObj = new player(name)

    // Create player main game object
    const playerGameObj = {
        playerName: name,
        highscore: 100
    }
    const gameObj = cloudGetObj(currentGame)    
    gameObj.players[name] = playerGameObj
    cloudSave(currentGame, gameObj)

    // Create player cloud profile
    cloudSave(playerObj.name, playerObj)
}

// createPlayer("Iris")

function giftMetal(playerName){
    const playerObj = cloudGetObj(playerName)

    if (playerObj === null) {
        console.log("No player found")
    } else {
        playerObj.metal += 500
        playerObj.lastAction = Date.now()
        cloudSave(playerObj.name, playerObj)
    }
}

function buildMine(playerName){
    const playerObj = cloudGetObj(playerName)
    if (playerObj === null) {
        console.log("No player found")
    } else {
        console.log("Building mine costing 1000 metal")
        playerObj.metal -= 1000
        playerObj.crystal -= 10 
        playerObj.metalMultiplier += 1
        playerObj.lastAction = Date.now()
        cloudSave(playerObj.name, playerObj)
    }
}

function resourceTick(playerName) {
    const playerObj = cloudGetObj(playerName)

    const timeDifference = Math.floor((Date.now() - playerObj.lastAction)/1000)

    // Give metal // BUG if tick is quicker than 10 seconds, crystal will be floored
    playerObj.metal += Math.floor(timeDifference * playerObj.metalMultiplier)
    playerObj.crystal += Math.floor(timeDifference * playerObj.crystalMultiplier)

    playerObj.lastAction = Date.now()
    cloudSave(playerObj.name, playerObj)
}


// Metal mines levels
// const metalMine = {
//     level1 : buildCost; 10 metal, 5 crystal, 
//              production_type; metal
//              production_ammount; 50 
//              energy_consumption; 10
//     level2 : buildCost; 50 metal, 25 crystal, 
//              production_type; metal
//              production_ammount; 100 
//              energy_consumption; 25
// }


// Utility functions
function cloudSave(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

function cloudGetObj(key) {
    return JSON.parse(localStorage.getItem(key))
}


// Local game
function gameTick() {
    console.log("Tick!")
    play(currentPlayer)
}

// Player webinterface
function updateWebInterface(playerName) {
    const playerObj = cloudGetObj(playerName)

    // update interface
    playerNameEl.textContent = `Player: ${playerName}`
    statMetalEl.textContent = `Metal: ${playerObj.metal}`
    statCrystalEl.textContent = `Crystal: ${playerObj.crystal}`
    statEnergyEl.textContent = `Energy: ${playerObj.energy}`
}


function play(playerName) {
    resourceTick(currentPlayer)
    updateWebInterface(playerName)
}

play(currentPlayer)
