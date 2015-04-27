/* Global vars */

var turn = 1;

/* The below statement is called on program start and calls the start function after a delay. The delay is necessary as the 'object' elements do not load immediately and the unit SVGs cannot be loaded unless the 'object' elements are available. The delay may have to increase if there are more objects added. */
window.setTimeout(start, 500)

/* Functions */

function start() {
    for (var i = 0; i < 7; ++i) {
        for (var j = 0; j < 7; ++j) {
            createTile({imageName:"Grass", gridLocation:{"x":i,"y":j}})
        }
    }
    createUnit({svg:"svg_spaceship_anim", HP:100, speed:2, player:1, gridLocation:{"x":0,"y":2}})
    createUnit({svg:"svg_spaceship", HP:100, speed:1, player:0, gridLocation:{"x":2,"y":1}})
    updateTurnText();
}

function updateTurnText() {
    document.getElementById("info").textContent = "Turn " + turn
}

function nextTurn() {
    ++turn
    updateTurnText()
}