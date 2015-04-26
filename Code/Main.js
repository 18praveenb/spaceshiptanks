/* Global setting vars */

var sizeUnit = 50
var selectedUnit = -1;
var units = [] /* Keys: svg, HP, speed, player, gridLocation*/
var tiles = [] /* Keys: imageName, gridLocation*/
var turn = 1;

window.setTimeout(start, 500) /*may have to increase this if there is more to load*/

function start() {
    for (var i = 0; i < 7; ++i) {
        for (var j = 0; j < 7; ++j) {
            createTile({imageName:"grass", gridLocation:{"x":i,"y":j}})
        }
    }
    createUnit({svg:"svg_spaceship_anim", HP:100, speed:2, player:1, gridLocation:{"x":0,"y":2}})
    createUnit({svg:"svg_spaceship", HP:100, speed:1, player:0, gridLocation:{"x":2,"y":1}})
    updateTurnText();
}

function unitClicked(event) {
    if (paramsForUnit(this).player) {
        select(this)
    }
}

function unitMousedOver(event) {
    var params = paramsForUnit(this)
    var unitDetailString = "An " + params.svg + " with " + params.HP + " HP and " + params.speed + " movement speed. Belongs to " + (params.player ? "you." : "the enemy.")
    document.getElementById("info").textContent = unitDetailString
}

function unitMouseOut(event) {
    updateTurnText()
}

function updateTurnText() {
    document.getElementById("info").textContent = "Turn " + turn
}

function nextTurn() {
    ++turn
    updateTurnText()
}