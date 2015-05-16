/* test comment */
console.log("HEEEEE");
var parameterArrays = {
tile: [], /* Keys: type, svg, gridLocation */
unit: [] /* Keys: type, svg, HP, speed, player, attack, gridLocation */
}
var playerArray = Array();
/* Should equal the number of SVG objects in the HTML doc. This isn't being calculated automatically because that occasionally fails to work. */
/* Props to my brother Pranav for this objectsLoaded idea. Before he suggested this, I was just implementing an n millisecond delay before loading the page. */
var objectsNotLoaded = 2;

function objectLoaded() {
    --objectsNotLoaded;
    if (objectsNotLoaded == 0) {buildScene()}
}

function buildScene() {
    for (var x = 0; x < 7; ++x) {
        for (var y = 0; y < 5; ++y) {
            createNode({type:"tile", svg:"grass", gridLocation:{"x":x,"y":y}});
        }
    }
    createNode({type:"unit", svg:"spaceship", HP:50, speed:2, attack:10, player:0, gridLocation:{"x":0,"y":2}});
    createNode({type:"unit", svg:"spaceship", HP:20, speed:3, attack:15, player:1, gridLocation:{"x":6,"y":2}});
    updateTurnText();
}

/*** Helper functions ***/

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

/*** Put beginning Stats ***/
/* RANDOM ERROR CANNOT GET innerHTML of NULL I DONT EVEN KNOW
for(var i = 1; i < 3; i++){
    document.getElementById("statsp1health").innerHTML=50;
}
*/

/*** Turn system ***/

var turn = 1;
var currentPlayer = 0;

function updateTurnText() {
    document.getElementById("info").textContent = "Turn " + turn + ", player " + (currentPlayer+1);
}

function finishTurn() {
    
    currentPlayer = (currentPlayer + 1) % 2;
    if (currentPlayer == 0) {++turn}
    updateTurnText();
}

/*** Grid point system ***/

/* Converts between SVG scene coordinates and abstract grid coordinates */

var sizeUnit = 50; /* Size of tile on the grid */

/* Receives scene coordinates, returns a grid point */
function gridPoint(x, y) {
    return {
        "x": Math.floor(x/sizeUnit),
        "y": Math.floor(y/sizeUnit)
    };
}

function gridPointForNode(node) {
    return gridPoint(node.getAttribute("x"), node.getAttribute("y"));
}

/* Receives grid point, returns scene coordinates */
function locationForGridPoint(gridPoint) {
    return {
        "x": gridPoint.x*sizeUnit,
        "y": gridPoint.y*sizeUnit
    };
}

/* Checks equality of grid points */
function gridPointsEqual(point1, point2) {
    return ((point1.x == point2.x) && (point1.y == point2.y));
}

/* Diagonal counts as two squares because of the way this is implemented */
function gridPointDifference(point1, point2) {
    return Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y);
}

/*** Node system ***/

function createNode(parameters) {
    
    var node = document.getElementById(parameters.svg).contentDocument.documentElement.cloneNode(true);
    
    node.setAttribute("x", parameters.gridLocation.x*sizeUnit);
    node.setAttribute("y", parameters.gridLocation.y*sizeUnit);
    node.setAttribute("width", sizeUnit);
    node.setAttribute("height", sizeUnit);
    
    node.setAttribute("player", parameters.player)
    node.setAttribute("type", parameters.type);
    node.setAttribute("arrayNumber", parameterArrays[parameters.type].length);
    node.setAttribute("id", parameters.type + " " + String(parameterArrays[parameters.type].length));
    
    parameters["node"] = node;
    parameterArrays[parameters.type].push(parameters);
    
    node.addEventListener("click", nodeClicked);
    node.addEventListener("mouseover", nodeMouseOver);
    node.addEventListener("mouseout", nodeMouseOut);
    
    scene.appendChild(node);
    //return(node);
}

function nodeClicked(event) {
    var location = parametersForNode(this).gridLocation
    if (selectedUnit == "none") {
        if ((this.getAttribute("type") == "unit") && (parametersForNode(this).player == currentPlayer)) {
            toggleSelectionOfUnit(this);
        }
    }
    else {
        switch (unitMoveTypeForPoint(parametersForNode(this).gridLocation)) {
            case "move": setGridLocation(selectedUnit, parametersForNode(this).gridLocation); break;
            case "attack": attack(selectedUnit, unitAtPoint(location)); break;
        }
        toggleSelectionOfUnit(selectedUnit)
    }
}

function nodeMouseOver(event) {
    if (this.getAttribute("type") == "unit") {
        var params = parametersForNode(this)
        var shortlistParams = {"unit": params.svg, "speed": params.speed, "HP": params.HP, "attack": params.attack, "player": params.player}
        document.getElementById("info").textContent = stringOfPropertiesOfObject(shortlistParams)
    }
}

function nodeMouseOut(event) {
    updateTurnText();
}

function parametersForNode(node) {
    var array = parameterArrays[node.getAttribute("type")];
    return array[node.getAttribute("arrayNumber")]
}

/*** Tile system ***/

function resetTileHighlighting() {
    function reset(tile) {
        if (tile.getAttribute("type") == "tile") {
            tile.setAttribute("highlight", "none")
        }
    }
    enumerateChildNodes(scene.childNodes, reset)
}

function highlightTilesAroundUnit(unit) {
    function highlight(tile) {
        if (tile.getAttribute("type") == "tile") {
            switch (unitMoveTypeForPoint(parametersForNode(tile).gridLocation)) {
                case "move": tile.setAttribute("highlight", "blue"); break;
                case "attack": tile.setAttribute("highlight", "red"); break;
            }
        }
    }
    enumerateChildNodes(scene.childNodes, highlight)
}

function unitAtPoint(point) {
    var unit = "none";
    function checkIfUnitIsAtPoint(aUnit) {
        if (aUnit.getAttribute("type") == "unit") {
        if (gridPointsEqual(parametersForNode(aUnit).gridLocation, point) ) {
            unit = aUnit;
            }
        }
    }
    enumerateChildNodes(scene.childNodes, checkIfUnitIsAtPoint);
    return unit;
}

function unitMoveTypeForPoint(point) {
    var unit = unitAtPoint(point);
    var difference = gridPointDifference(point, gridPointForNode(selectedUnit));
    if (difference <= parametersForNode(selectedUnit).speed && difference > 0) {
        if (unit == "none") {
            return "move";
        }
        else {
            return "attack";
        }
    }
    return "none";
}

/*** Unit system ***/

var selectedUnit = "none";

function toggleSelectionOfUnit(unit) {
    if (unit == selectedUnit) {
        selectedUnit = "none";
        unit.setAttribute("highlight", "false")
        resetTileHighlighting()
    }
    else {
        /* Deselect the currently selected unit before selecting this one. Only one unit can be selected at a time. */
        if (selectedUnit != "none") {
            toggleSelectionOfUnit(selectedUnit);
        }
        selectedUnit = unit
        unit.setAttribute("highlight", "true")
        highlightTilesAroundUnit(unit)
    }
}

/* Moves a unit SVG node to a new location on the grid, and updates the parameters object for that unit with the new location (which will be useful for saving and restoring state later) */
function setGridLocation(unit, newGridLocation) {
    parameterArrays.unit[unit.getAttribute("arrayNumber")].gridLocation = newGridLocation;
    unit.setAttribute("x", locationForGridPoint(newGridLocation).x);
    unit.setAttribute("y", locationForGridPoint(newGridLocation).y);
    finishTurn();
}

function attack(from, to) {
    finishTurn();
    parametersForNode(to).HP -= parametersForNode(from).attack;
    document.getElementById("statsp"+(parametersForNode(to).player+1)+"health").innerHTML = parametersForNode(to).HP;
    if (parametersForNode(to).HP <= 0) {
        to.remove()
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
