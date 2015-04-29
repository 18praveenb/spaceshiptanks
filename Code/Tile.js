/* Global vars */
var tiles = [] /* Keys: svg, gridLocation*/

/* Functions */

function createTile(parameters) { /* It might be worth merging this an createUnit into a general createNode function as they are similar */
    /* Create the tile as an SVG image node (TODO: this should be changed to an actual SVG node so that the tile can be easily highlighted without loading a new image) */
    var tile = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    tile.setAttribute("x", parameters.gridLocation.x*sizeUnit)
    tile.setAttribute("y", parameters.gridLocation.y*sizeUnit)
    tile.setAttribute("width", sizeUnit)
    tile.setAttribute("height", sizeUnit)
    tile.setAttribute("type", "tile")
    /* Append an object with the tile's parameters and a reference to the SVG node to the tile array */
    parameters["node"]=tile
    /* Add the tile parameters to the tiles array */
    tiles.push(parameters)
    
    tile.setAttribute("id", "tile" + String(tiles.length-1))
    /* Add a reference to the array index of the tile's parameters object to the tile SVG node */
    tile.setAttribute("arrayNumber", String(tiles.length-1))
    /* Get the SVG file with the given ID from the objects list and copy it to the unit node – this code is literally copied from the createUnit function */
    var svg = document.getElementById("svg_"+parameters.svg).contentDocument.documentElement.cloneNode(true)
    tile.appendChild(svg)
    
    tile.addEventListener("click", tileClicked)
    scene.appendChild(tile)
}

function tileClicked(event) {
    /* If there is a selected unit, check to see if the unit has enough movement to move to this tile and if so, move it there. Whether or not the unit could move, deselect it. */
    if (selectedUnit != -1) {
        var unitGridLocation = gridPointForNode(selectedUnit)
        var tileGridLocation = gridPointForNode(this)
        /* Checks if the distance between the unit and the tile is less than or equal to the distance the unit can move. */
        if (gridPointDifference(unitGridLocation, tileGridLocation) <= paramsForUnit(selectedUnit).speed) {
            setGridLocation(selectedUnit, tileGridLocation)
        }
        /* Toggle the selection of the selected unit (deselect it). */
        select(selectedUnit)
    }
}

/* Unhighlight all tiles. */
function resetTileHighlighting() {
    function reset(tile) {
        if (tile.getAttribute("type") == "tile") {
            /* Disables CSS highlighting of the tile. */
            tile.setAttribute("highlight", "false")
        }
    }
    enumerateChildNodes(scene.childNodes, reset)
}

/* Highlights all tiles that a unit can move to. */
function highlightTilesAroundUnit(unit) {
    function highlight(tile) {
        if (tile.getAttribute("type") == "tile") {
            /* Checks if the distance between the unit and the tile is less than or equal to the distance the unit can move. */
            if (gridPointDifference(gridPointForNode(tile), gridPointForNode(unit)) <= paramsForUnit(unit).speed) {
                /* Enables CSS highlighting of the tile. */
                tile.setAttribute("highlight", "true")
            }
        }
    }
    enumerateChildNodes(scene.childNodes, highlight)
}

/* Get the parameters object for a tile SVG node. */
function paramsForTile(tile) {
    return tiles[tile.getAttribute("arrayNumber")]
}