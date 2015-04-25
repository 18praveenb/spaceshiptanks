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
        "x": gridPoint.x*sizeUnit - document.getElementById("scene").getBoundingClientRect(),
        "y": gridPoint.y*sizeUnit
    }
}

function gridPointsEqual(point1, point2) {
    return ((point1.x == point2.x) && (point1.y == point2.y))
}

function gridPointDifference(point1, point2) {
    return Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y)
}