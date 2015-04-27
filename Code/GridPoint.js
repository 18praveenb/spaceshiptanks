/* GridPoints provide a means for converting between manipulable positions on a grid and the actual representation of that grid in the SVG scene. */

/* Global vars */

var sizeUnit = 50 /* Determines size of a tile on the grid */

/* Functions */

/* Given two scene coordinates, this determines which grid square they are on. */
function gridPoint(x, y) {
    return {
        "x": Math.floor(x/sizeUnit),
        "y": Math.floor(y/sizeUnit)
    }
}

/* determines the position on the grid of an SVG node based on its coordinates */
function gridPointForNode(node) {
    return gridPoint(node.getAttribute("x"), node.getAttribute("y"))
}

/* Convert a grid point to scene coordinates by multiplying by the size unit */
function location(gridPoint) {
    return {
        "x": gridPoint.x*sizeUnit - document.getElementById("scene").getBoundingClientRect(),
        "y": gridPoint.y*sizeUnit
    }
}

/* Compare the equality of two grid points */
function gridPointsEqual(point1, point2) {
    return ((point1.x == point2.x) && (point1.y == point2.y))
}

/* Determine how many squares away two grid points are. */
function gridPointDifference(point1, point2) {
    return Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y)
}