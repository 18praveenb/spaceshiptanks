/* Should equal the number of SVG objects in the HTML doc. This isn't being calculated automatically because that occasionally fails to work. */
/* Props to my brother Pranav for this objectsLoaded idea. Before he suggested this, I was just implementing an n millisecond delay before loading the page. */
var objectsNotLoaded = 2;
p("hi");
function objectLoaded() {
    --objectsNotLoaded;
    if (objectsNotLoaded == 0) {buildScene()}
}
/*** Player data & info ***/
/* merged the movement into these objects */
var p1 = {
node: "none",
health:0,
attack:0,
speed:10,
vx:0, /* x velocity */
vy:0 /* y velocity */
}

var p2 = {
node:"none",
health:0,
attack:0,
speed:10,
vx:0, /* x velocity */
vy:0 /* y velocity */
}

/* Wow I forgot how this works for a while . . . maybe it should have comments */
function setStat(params) {
    /* get the p1 or p2 object and set its (health, attack, etc.) to whatevy */
    params.player[params.key] = params.value
    /* generates a string "p1" or "p2" based on whether the player is the p1 object or the p2 object */
    var player;
    switch (params.player) {
        case p1: player = "p1"; break;
        case p2: player = "p2"; break;
    }
    /* set the corresponding item (health, attack . . . ) in the display table to the new value */
    document.getElementById(player+"_"+params.key).textContent = params.value
}

function buildScene() {
    p1.node = createNode({svg:"spaceship", player:1, x:0, y:0});
    p2.node = createNode({svg:"spaceship", player:2, x:100, y:0});
    
    setStat({player: p1, key: "health", value: 25});
    setStat({player: p1, key: "attack", value: 1});
    setStat({player: p1, key: "speed", value: 1});
    
    setStat({player: p2, key: "health", value: 10});
    setStat({player: p2, key: "attack", value: 2});
    setStat({player: p2, key: "speed", value: 2});
    
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    setInterval(function(){update()}, 50);
}

/*** Helper functions ***/

/* Quicker way to write console.log */
function p(str) {
    console.log(str)
}

/* Quicker way to write getAttribute */
function ga(node, attr) {
    return node.getAttribute(attr)
}

/* Quicker way to write setAttribute */
function sa(node, attr, val) {
    node.setAttribute(attr, val)
}

/* Quicker way to write getElementById */
function gid(src, id) {
    return src.getElementById(id)
}

/* Quicker way to write document.getElementById */
function dgid(id) {
    return document.getElementById(id)
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

/*** Nodes ***/

function createNode(parameters) {
    
    var node = document.getElementById(parameters.svg).contentDocument.documentElement.cloneNode(true);
    
    node.setAttribute("x", parameters.x);
    node.setAttribute("y", parameters.y);
    node.setAttribute("player", parameters.player) /* negative numbers = walls, loot, etc. (will be decided later), 0 = computer controlled enemy, 1 = p1, 2 = p2 */
    node.setAttribute("id", "node_p"+parameters.player);
    
    scene.appendChild(node);
    return node;
}

/* Update will process movement of players, bullets, etc. as well as collision detection and other future stuff. Essentially a new frame */
function update(){
    
    /* Future positions */
    var p1x = ga(p1.node, "x")*1 + p1.speed*p1.vx;
    var p1y = ga(p1.node, "y")*1 + p1.speed*p1.vy;
    var p2x = ga(p2.node, "x")*1 + p2.speed*p2.vx;
    var p2y = ga(p2.node, "y")*1 + p2.speed*p2.vy;
    p(p1x);
    p(p1y);
    /* Check if outside bounds */
    if(p1x < 50){p1x = 50;}
    if(p1y < 50){p1y = 50;}
    if(p1x > 950){p1x = 950;}
    if(p1y > 950){p1y = 950;}
    
    if(p2x < 50){p2x = 50;}
    if(p2y < 50){p2y = 50;}
    if(p2x > 950){p2x = 950;}
    if(p2y > 950){p2y = 950;}
    
    /* Set new positions */
    p1.node.setAttribute("x", p1x);
    p1.node.setAttribute("y", p1y);
    p2.node.setAttribute("x", p2x);
    p2.node.setAttribute("y", p2y);
}


/*** Keyboard integration ***/

function keyUp(event) {
    switch (event.keyCode) {
        case 37 /* left arrow */:
            p1.vx = 0;
            break;
        case 39 /* right arrow */:
            p1.vx = 0;
            break;
        case 38 /* up arrow */:
            p1.vy = 0;
            break;
        case 40 /* down arrow */:
            p1.vy = 0;
            break;
            
        case 65 /* A(left) */:
            p2.vx = 0;
            break;
        case 68 /* D(right) */:
            p2.vx = 0;
            break;
        case 87 /* W(up) */:
            p2.vy= 0;
            break;
        case 83 /* S(down) */:
            p2.vy= 0;
            break;
    }
}

function keyDown(event) {
    switch (event.keyCode) {
        case 37 /* left arrow */: 
            p("left");
            p1.vx = -1;
            event.preventDefault(); /*stop keyboard scrolling of browser*/
            break;
        case 39 /* right arrow */: 
            p("right"); 
            p1.vx = 1;
            event.preventDefault(); /*stop keyboard scrolling of browser*/
            break;
        case 38 /* up arrow */: 
            p("up");
            p1.vy= -1;
            event.preventDefault(); /*stop keyboard scrolling of browser*/
            break;
        case 40 /* down arrow */: 
            p("down"); 
            p1.vy= 1;
            event.preventDefault(); /*stop keyboard scrolling of browser*/
            break;
            
        case 65 /* A(left) */:
            p2.vx = -1;
            break;
        case 68 /* D(right) */:
            p2.vx = 1;
            break;
        case 87 /* W(up) */:
            p2.vy= -1;
            break;
        case 83 /* S(down) */:
            p2.vy= 1;
            break;
        
    }
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
