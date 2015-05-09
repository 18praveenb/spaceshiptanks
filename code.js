var parameterArrays = {
tile: [], /* Keys: type, svg, gridLocation */
unit: [] /* Keys: type, svg, HP, speed, palyer, gridLocation */
}


/* Calls the start function after a delay because the 'object' elements do not load immediately and are needed to access SVGs. May be removed if SVGs are added inline to the index.html document */
window.setTimeout(start, 500);

function start() {
    for (var i = 0; i < 7; ++i) {
        for (var j = 0; j < 7; ++j) {
            createNode({type:"tile", svg:"grass", gridLocation:{"x":i,"y":j}});
        }
    }
    createNode({type:"unit", svg:"spaceship", HP:100, speed:2, player:0, gridLocation:{"x":0,"y":2}});
    createNode({type:"unit", svg:"spaceship_animated", HP:100, speed:1, player:0, gridLocation:{"x":2,"y":1}});
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

/*** Turn system ***/

var turn = 1;

var currentPlayer = 0;

function updateTurnText() {
    document.getElementById("info").textContent = "Turn " + turn;
}

function nextTurn() {
    ++turn;
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
    
    node.setAttribute("type", parameters.type);
    node.setAttribute("arrayNumber", parameterArrays[parameters.type].length);
    node.setAttribute("id", parameters.type + " " + String(parameterArrays[parameters.type].length));
    
    parameters["node"] = node;
    parameterArrays[parameters.type].push(parameters);
    
    node.addEventListener("click", nodeClicked);
    //if (node.type == )
    
    scene.appendChild(node);
    
}

function nodeClicked(event) {
    switch (this.getAttribute("type")) {
        case "unit": unitClicked(this); break;
        case "tile": tileClicked(this); break;
    }
}

function parametersForNode(node) {
    var array = parameterArrays[node.getAttribute("type")];
    return array[node.getAttribute("arrayNumber")]
}

/*** Tile system ***/

function tileClicked(tile) {
    if (selectedUnit != "none") {
        var unitGridLocation = gridPointForNode(selectedUnit)
        var tileGridLocation = gridPointForNode(tile)
        if (gridPointDifference(unitGridLocation, tileGridLocation) <= parametersForNode(selectedUnit).speed) {
            setGridLocation(selectedUnit, tileGridLocation)
        }
        toggleSelectionOfUnit(selectedUnit)
    }
}

function resetTileHighlighting() {
    function reset(tile) {
        if (tile.getAttribute("type") == "tile") {
            /* Disables CSS highlighting of the tile. */
            tile.setAttribute("highlight", "false")
        }
    }
    enumerateChildNodes(scene.childNodes, reset)
}

function highlightTilesAroundUnit(unit) {
    function highlight(tile) {
        if (tile.getAttribute("type") == "tile") {
            if (gridPointDifference(gridPointForNode(tile), gridPointForNode(unit)) <= parametersForNode(unit).speed) {
                /* Enables CSS highlighting of the tile. */
                tile.setAttribute("highlight", "true")
            }
        }
    }
    enumerateChildNodes(scene.childNodes, highlight)
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
    parameterArrays.unit[unit.getAttribute("arrayNumber")].gridLocation = newGridLocation
    unit.setAttribute("x", locationForGridPoint(newGridLocation).x)
    unit.setAttribute("y", locationForGridPoint(newGridLocation).y)
}

function unitClicked(unit) {
    if (parametersForNode(unit).player == currentPlayer) {
        toggleSelectionOfUnit(unit);
    }
}

function unitMousedOver(event) {
    /* Displays information about a unit in the info paragraph when the mouse is held over the unit */
    var parameters = parametersForNode(this);
    var unitDetailString = parameters.svg + ": " + parameters.HP + " HP and " + parameters.speed + " speed; player " + String(parameters.player);
    document.getElementById("info").textContent = unitDetailString;
}

function unitMouseOut(event) {
    /* Info paragraphs shows the turn when not showing unit info. */
    updateTurnText();
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