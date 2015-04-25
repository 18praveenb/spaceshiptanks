function createTile(parameters) {
    var tile = document.createElementNS("http://www.w3.org/2000/svg", "image");
    tile.setAttribute("x", parameters.gridLocation.x*sizeUnit)
    tile.setAttribute("y", parameters.gridLocation.y*sizeUnit)
    tile.setAttribute("width", sizeUnit)
    tile.setAttribute("height", sizeUnit)
    tile.setAttributeNS("http://www.w3.org/1999/xlink", "href", imageDirectory + parameters.imageName + ".png")
    tile.setAttribute("preserveAspectRatio", "none")
    tile.setAttribute("type", "tile")
    parameters["node"]=tile
    tiles.push(parameters)
    
    tile.setAttribute("id", "tile" + tiles.length-1)
    tile.setAttribute("arrayNumber", tiles.length-1)
    
    tile.addEventListener("click", tileClicked)
    scene.appendChild(tile)
}

function tileClicked(event) {
    if (selectedUnit != -1) {
        var unitGridLocation = gridPointForNode(selectedUnit)
        var tileGridLocation = gridPointForNode(this)
        if (gridPointDifference(unitGridLocation, tileGridLocation) <= paramsForUnit(selectedUnit).speed) {
            setGridLocation(selectedUnit, tileGridLocation)
        }
        select(selectedUnit)
    }
}

function resetTileHighlighting() {
    function reset(tile) {
        if (tile.getAttribute("type") == "tile") {
            tile.setAttribute("href", imageDirectory+"Grass.png")
            tile.setAttribute("highlight", "false")
        }
    }
    enumerateChildNodes(scene.childNodes, reset)
}

function highlightTilesAroundUnit(unit) {
    function highlight(tile) {
        if (tile.getAttribute("type") == "tile") {
            if (gridPointDifference(gridPointForNode(tile), gridPointForNode(unit)) <= paramsForUnit(unit).speed) {
                tile.setAttribute("href", imageDirectory+"Grass highlighted.png")
                tile.setAttribute("highlight", "true")
            }
        }
    }
    enumerateChildNodes(scene.childNodes, highlight)
}

function paramsForTile(tile) {
    return tiles[tile.getAttribute("arrayNumber")]
}