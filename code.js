/* Should equal the number of SVG objects in the HTML doc. This isn't being calculated automatically because that occasionally fails to work. */
/* Props to my brother Pranav for this objectsLoaded idea. Before he suggested this, I was just implementing an n millisecond delay before loading the page. */
var objectsNotLoaded = 2;
var player1;
var player2;
/** Dictionary of all movement aspects of players: node for the nodes, hor(horizontal) and ver(vertical) for how many pixels to move in each direction, speed for pixels moved per sec **/
var p1move = {node: "", hor: 0, ver: 0, speed: 10};
var p2move = {node: "", hor: 0, ver: 0, speed: 10};

function objectLoaded() {
    --objectsNotLoaded;
    if (objectsNotLoaded == 0) {buildScene()}
}

window.onload = function(){
    console.log("Window width is "+window.innerWidth+" pixels");
    document.getElementById("scene").style.marginLeft = ((window.innerWidth-1000)/2)+"px";
    setInterval(function(){move();},50);
}

function buildScene() {
    p1move.node = createNode({svg:"spaceship", player:1, x:0, y:0});
    p2move.node = createNode({svg:"spaceship", player:2, x:100, y:0});
    
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
    return node;
}
/*** Movement Functions ***/
function move(){
    /* Future positions */
    var p1x = parseInt(p1move.node.getAttribute("x"),10)+p1move.speed*p1move.hor;
    var p1y = parseInt(p1move.node.getAttribute("y"),10)+p1move.speed*p1move.ver;
    var p2x = parseInt(p2move.node.getAttribute("x"),10)+p2move.speed*p2move.hor;
    var p2y = parseInt(p2move.node.getAttribute("y"),10)+p2move.speed*p2move.ver;
    /* Check if outside bounds */
    if(p1x < 0){p1x = 0;}
    if(p1y < 0){p1y = 0;}
    if(p1x > 950){p1x = 950;}
    if(p1y > 950){p1y = 950;}
    
    if(p2x < 0){p2x = 0;}
    if(p2y < 0){p2y = 0;}
    if(p2x > 950){p2x = 950;}
    if(p2y > 950){p2y = 950;}
    /* Set new positions */
    p1move.node.setAttribute("x", p1x);
    p1move.node.setAttribute("y", p1y);
    
    p2move.node.setAttribute("x", p2x);
    p2move.node.setAttribute("y", p2y);
}


/*** Keyboard integration ***/

function keyUp(event) {
    switch (event.keyCode) {
        case 37 /* left arrow */:
            p1move.hor = 0;
            break;
        case 39 /* right arrow */:
            p1move.hor = 0;
            break;
        case 38 /* up arrow */:
            p1move.ver = 0;
            break;
        case 40 /* down arrow */:
            p1move.ver = 0;
            break;
            
        case 65 /* A(left) */:
            p2move.hor = 0;
            break;
        case 68 /* D(right) */:
            p2move.hor = 0;
            break;
        case 87 /* W(up) */:
            p2move.ver= 0;
            break;
        case 83 /* S(down) */:
            p2move.ver= 0;
            break;
    }
}

function keyDown(event) {
    switch (event.keyCode) {
        case 37 /* left arrow */: 
            p("left");
            p1move.hor = -1;
            break;
        case 39 /* right arrow */: 
            p("right"); 
            p1move.hor = 1;
            break;
        case 38 /* up arrow */: 
            p("up");
            p1move.ver= -1;
            break;
        case 40 /* down arrow */: 
            p("down"); 
            p1move.ver= 1;
            break;
            
        case 65 /* A(left) */:
            p2move.hor = -1;
            break;
        case 68 /* D(right) */:
            p2move.hor = 1;
            break;
        case 87 /* W(up) */:
            p2move.ver= -1;
            break;
        case 83 /* S(down) */:
            p2move.ver= 1;
            break;
        
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
