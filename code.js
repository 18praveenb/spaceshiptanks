/* Should equal the number of SVG objects in the HTML doc. This isn't being calculated automatically because that occasionally fails to work. */
/* Props to my brother Pranav for this objectsLoaded idea. Before he suggested this, I was just implementing an n millisecond delay before loading the page. */
var objectsNotLoaded = 2;
var playerArray = Array();
console.log("hi");
function objectLoaded() {
    --objectsNotLoaded;
    if (objectsNotLoaded == 0) {buildScene()}
}

window.onload = function(){
    console.log("Window width is "+window.innerWidth+"pixels");
    document.getElementById("scene").style.marginLeft = ((window.innerWidth-1000)/2)+"px";
}

function buildScene() {
    createNode({svg:"spaceship", player:1, x:0, y:0});
    createNode({svg:"spaceship", player:2, x:100, y:0});
    
    setStat({player: p1, key: "health", value: 20});
    setStat({player: p1, key: "attack", value: 1});
    setStat({player: p2, key: "health", value: 10});
    setStat({player: p2, key: "attack", value: 2});
    
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
}

/*** Helper functions ***/

function p(str) {
    console.log(str)
}

function enumerate(array, block) {
    for (var i=0; i<array.length; ++i) {
        /* The block can return a boolean value. Returning false ends enumeration. */
        var shouldContinue = block(array[i]);
        if (shouldContinue == false) {break;}
    }
}

function enumerateChildNodes(childNodes, block) {
    function checkingBlock(node) {
        /* Element nodes (like tiles and units) have node type 1. Some other node types cause crashes when they are accessed with common enumeration functions. */
        if (node.nodeType == 1) {
            return block(node);
        }
    }
    enumerate(childNodes, checkingBlock);
}

function stringOfPropertiesOfObject(object) {
    var str = "";
    for (key in object) {
        str += key + ": " + object[key] + ", ";
    }
    return str;
}

/*** Node system ***/

function createNode(parameters) {
    
    var node = document.getElementById(parameters.svg).contentDocument.documentElement.cloneNode(true);
    
    node.setAttribute("x", parameters.x);
    node.setAttribute("y", parameters.y);
    node.setAttribute("player", parameters.player)
    node.setAttribute("id", "node_p"+parameters.player);
    
    scene.appendChild(node);
    playerArray.push(node);
}

/*** Keyboard integration ***/

function keyUp(event) {
    switch (event.keyCode) {
        case 37 /* left arrow */:
            break;
        case 39 /* right arrow */:
            playerArray[0].setAttribute("x", playerArray[0].getAttribute("x")+10);
            break;
        case 38 /* up arrow */:
            break;
        case 40 /* down arrow */:
            break;
    }
}

function keyDown(event) {
    switch (event.keyCode) {
        case 37 /* left arrow */: p("left"); break;
        case 39 /* right arrow */: p("right"); break;
        case 38 /* up arrow */: p("up"); break;
        case 40 /* down arrow */: p("down"); break;
    }
}

/*** Player data & info ***/

var p1 = {
health:0,
attack:0,
}

var p2 = {
health:0,
attack:0,
}

function setStat(params) {
    params.player[params.key] = params.value
    var player;
    switch (params.player) {
    case p1: player = "p1"; break;
    case p2: player = "p2"; break;
    }
    document.getElementById(player+"_"+params.key).textContent = params.value
}

/*
    This is a poem
    about coding.
    There is a problem:
    Xcode does not allow
    for extra scrolling.
    
    How, then, you ask,
    is it possible 
    to scroll
    past the limits 
    of the code?
    
    The answer
    is simple.
    Either add 
    line breaks
    or a poem,
    whitespace
    or words.
 
    I have chosen 
    the latter.
    You can probably 
    tell
    because this 
    is not
    whitespace.
 
    It is a poem
    (which is,
    in this case,
    just a set of
    sentences 
    with some line breaks
    in between).
 
    How would this poem look
    without line breaks?
 
    This is prose about coding. There is a problem: Xcode does not allow for extra scrolling. 
    How, then, you as, is it possible to scroll past the limits of the code?
    The answer is simple. Either add line breaks or prose, whitespace or words. 
    I have chosen the latter. You can probably tell because this is not whitespace. 
    It is prose (which is, in this case, just a poem without line breaks). 
    How would this prose look with some line breaks? See above.
 */
