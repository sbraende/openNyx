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
const currentPlayer = "Seb"

class game {
    constructor(name) {
        this.name = name
        this.startDate = Date.now()
        this.players = []
    }
}

// Create season1Game, if not in cloud
if (localStorage.getItem(currentGame) === null) {
    const currentGameObj = new game(currentGame)
    cloudSave(currentGameObj.name, currentGameObj)
    console.log("Created save file")
}

// Player
class player {
    constructor(name) {
        this.id = Math.floor(Math.random() * 1000000)
        this.name = name
        this.startDate = Date.now()

        this.metal = 50
        this.crystal = 0
        this.energy = 0
    }
}

function createPlayer(name) {
    const playerObj = new player(name)
    const gameObj = cloudGetObj(currentGame)

    gameObj.players.push(playerObj)
    cloudSave(currentGame, gameObj)
}


// Resources 
class metal {
    constructor() {
        this.value = 0
        this.multiplier = 1
    }
}

// Metal mines levels
const metalMine = {
    level1 : buildCost; 10 metal, 5 crystal, 
             production_type; metal
             production_ammount; 50 
             energy_consumption; 10
    level2 : buildCost; 50 metal, 25 crystal, 
             production_type; metal
             production_ammount; 100 
             energy_consumption; 25
}


// Utility functions
function cloudSave(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

function cloudGetObj(key) {
    return JSON.parse(localStorage.getItem(key))
}


// Game Tick
function gameTick() {
    console.log("Tick!")

    // Get game object
    gameObj = cloudGetObj(currentGame)

    // For each player get current metal. 
    for (let i = 0; i < gameObj.players.length; i++) {
        gameObj.players[i].metal += 10
    }

    cloudSave(currentGame, gameObj)
    // Set new metal value based on tick

    updateWebInterface(currentPlayer)

}


// Player webinterface
function updateWebInterface(playerName) {

    // Get latest data from cloud
    gameObj = cloudGetObj(currentGame)

    // Get player object
    for (let i = 0; i < gameObj.players.length; i++) {

        if (gameObj.players[i].name === playerName) {

            // update interface
            playerNameEl.textContent = `Player: ${gameObj.players[i].name}`
            statMetalEl.textContent = `Metal: ${gameObj.players[i].metal}`
            statCrystalEl.textContent = `Crystal: ${gameObj.players[i].crystal}`
            statEnergyEl.textContent = `Energy: ${gameObj.players[i].energy}`
        }
    }
}
