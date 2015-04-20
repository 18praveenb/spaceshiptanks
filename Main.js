var sizeUnit = 75
var selectedUnit = -1;
var units = [] /* Keys: */
var imageDirectory = "Resources/Images/"

function start() {
    for (var i = 0; i < 9; ++i) {
        for (var j = 0; j < 4; ++j) {
            var tile = document.createElementNS("http://www.w3.org/2000/svg", "image");
            tile.setAttribute("x", String(sizeUnit*i))
            tile.setAttribute("y", String(sizeUnit*j))
            tile.setAttribute("width", sizeUnit)
            tile.setAttribute("height", sizeUnit)
            tile.setAttributeNS("http://www.w3.org/1999/xlink", "href", imageDirectory + "grass.png")
            tile.setAttribute("preserveAspectRatio", "none")
            tile.setAttribute("id", i + "" + j)
            tile.setAttribute("type", "tile")
            tile.addEventListener("click", tileClicked)
            scene.appendChild(tile)
        }
    }
    createUnit({imageName:"Spaceship", HP:100, speed:2, player:1, gridLocation:{"x":0,"y":2}})
    createUnit({imageName:"Soldier", HP:100, speed:1, player:2, gridLocation:{"x":2,"y":1}})
}

function tileClicked(event) {
    if (selectedUnit != -1) {
        var unitGridLocation = gridPointForNode(selectedUnit)
        var clickLocation = gridPointForEvent(event)
        if (gridPointDifference(unitGridLocation, clickLocation) <= paramsForNode(selectedUnit).speed) {
            setGridLocation(selectedUnit, clickLocation)
        }
        select(selectedUnit)
    }
}

function unitClicked(event) {
    select(this)
}

function select(node) {
    if (node == selectedUnit) {
        selectedUnit = -1
        node.setAttribute("href", imageDirectory+paramsForNode(node).imageName+".png")
        resetTileHighlighting()
    }
    else {
        if (selectedUnit != -1) {
            select(selectedUnit)
        }
        selectedUnit = node
        node.setAttribute("href", imageDirectory+paramsForNode(node).imageName + " selected.png")
        highlightTilesAroundNode(node)
    }
}

function gridPoint(x, y) {
    return {
        "x": Math.floor(x/sizeUnit),
        "y": Math.floor(y/sizeUnit)
    }
}

function gridPointForEvent(event) {
    return gridPoint(event.x, event.y)
}

function gridPointForNode(node) {
    return gridPoint(node.getAttribute("x"), node.getAttribute("y"))
}

function location(gridPoint) {
    return {
        "x": gridPoint.x*sizeUnit,
        "y": gridPoint.y*sizeUnit
    }
}

function gridPointsEqual(point1, point2) {
    return ((point1.x == point2.x) && (point1.y == point2.y))
}

function gridPointDifference(point1, point2) {
    return Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y)
}

function setGridLocation(unit, newGridLocation) {
    units[unit.getAttribute("arrayNumber")].gridLocation = newGridLocation
    unit.setAttribute("x", newGridLocation.x*sizeUnit)
    unit.setAttribute("y", newGridLocation.y*sizeUnit)
}

function imageNameForNode(node) { /*deprecated. use paramsForNode(node).imageName*/
    return node.getAttribute("href").match(RegExp("[^\\s\\.]*"))[0]
}

function paramsForNode(node) {
    return units[node.getAttribute("arrayNumber")]
}

function createUnit(parameters) {
    var unit = document.createElementNS("http://www.w3.org/2000/svg", "image")
    unit.setAttributeNS("http://www.w3.org/1999/xlink", "href", imageDirectory+parameters.imageName+".png")
    unit.setAttribute("height", sizeUnit)
    unit.setAttribute("width", sizeUnit)
    unit.setAttribute("x", parameters.gridLocation.x*sizeUnit)
    unit.setAttribute("y", parameters.gridLocation.y*sizeUnit)
    unit.setAttribute("preserveAspectRatio", "none")
    unit.setAttribute("type", "unit")
    parameters["node"] = unit
    units.push(parameters)
    
    unit.setAttribute("id", "Unit " + units.length)
    unit.setAttribute("arrayNumber", units.length-1)
    scene.appendChild(unit)
    
    unit.addEventListener("click", unitClicked)
    
}

function createTile(parameters) {
    //write this someday in the far far future. will be useful when implementing new types of terrain e.g. impassable walls, houses that can be entered, rivers, mountains, etc etc. maybe for checkpoint 2. This will also require overhauling the tile highlighting system and such.
    //BTW one day this whole convoluted "selected image system" may be blown away in favor of CSS highlighting if I ever learn how to do that or if it's even possible.
}

function resetTileHighlighting() {
    function reset(node) {
        if (node.getAttribute("type") == "tile") {
            node.setAttribute("href", imageDirectory+"grass.png")
        }
    }
    enumerateChildNodes(scene.childNodes, reset)
}

function highlightTilesAroundNode(node) {
    function highlight(tile) {
        if (tile.getAttribute("type") == "tile") {
            if (gridPointDifference(gridPointForNode(tile), gridPointForNode(node)) <= paramsForNode(node).speed) {
                tile.setAttribute("href", imageDirectory+"grass highlighted.png")
            }
        }
    }
    enumerateChildNodes(scene.childNodes, highlight)
}

function enumerate(array, block) {
    for (var i=0; i<array.length; ++i) {
        var shouldContinue = block(array[i])
        if (shouldContinue == false) {break}
    }
}

function enumerateChildNodes(childNodes, block) {
    function checkingBlock(node) {
        if (node.nodeType == 1) {
            return block(node)
        }
    }
    enumerate(childNodes, checkingBlock)
}