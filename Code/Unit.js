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
    
    unit.setAttribute("id", "Unit " + units.length-1)
    unit.setAttribute("arrayNumber", units.length-1)
    scene.appendChild(unit)
    
    unit.addEventListener("click", unitClicked)
    unit.addEventListener("mouseover", unitMousedOver)
    unit.addEventListener("mouseout", unitMouseOut)
    
}

function select(unit) {
    if (unit == selectedUnit) {
        selectedUnit = -1
        unit.setAttribute("href", imageDirectory+paramsForUnit(unit).imageName+".png")
        resetTileHighlighting()
    }
    else {
        if (selectedUnit != -1) {
            select(selectedUnit)
        }
        selectedUnit = unit
        unit.setAttribute("href", imageDirectory+paramsForUnit(unit).imageName + " selected.png")
        highlightTilesAroundUnit(unit)
    }
}

function setGridLocation(unit, newGridLocation) {
    units[unit.getAttribute("arrayNumber")].gridLocation = newGridLocation
    unit.setAttribute("x", newGridLocation.x*sizeUnit)
    unit.setAttribute("y", newGridLocation.y*sizeUnit)
}

function paramsForUnit(unit) {
    return units[unit.getAttribute("arrayNumber")]
}
