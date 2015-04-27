/* Global vars */

var selectedUnit = -1;
var units = [] /* Keys: svg, HP, speed, player, gridLocation*/

/* Functions */

function createUnit(parameters) {
    /* Create the unit as an SVG node and set parameters relating to its display on the page */
    var unit = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    unit.setAttribute("width", sizeUnit)
    unit.setAttribute("height", sizeUnit)
    unit.setAttribute("x", parameters.gridLocation.x*sizeUnit)
    unit.setAttribute("y", parameters.gridLocation.y*sizeUnit)
    unit.setAttribute("type", "unit")
    /* Add a reference to the unit SVG node to the parameters object */
    parameters["node"] = unit
    /* Add the parameter to the units array */
    units.push(parameters)
    
    unit.setAttribute("id", "Unit" + String(units.length-1))
    /* Add a reference to the unit's parameters list to the unit SVG node */
    unit.setAttribute("arrayNumber", units.length-1)
    /* Get the SVG file with the given ID from the objects list and copy it to the unit node */
    var svg = document.getElementById(parameters.svg).contentDocument.documentElement.cloneNode(true)
    unit.appendChild(svg)
    
    scene.appendChild(unit)
    
    unit.addEventListener("click", unitClicked)
    unit.addEventListener("mouseover", unitMousedOver)
    unit.addEventListener("mouseout", unitMouseOut)
}

/* Called whenever a unit is clicked and toggles selection */
function select(unit) {
    /* Deselect the unit if it is selected */
    if (unit == selectedUnit) {
        selectedUnit = -1
        unit.setAttribute("highlight", "false")
        /* Stop highlighting tiles the unit can move to */
        resetTileHighlighting()
    }
    else {
        /* If another unit is selected, deselect it before selecting this unit */
        if (selectedUnit != -1) {
            select(selectedUnit)
        }
        selectedUnit = unit
        unit.setAttribute("highlight", "true")
        /* Highlight tiles the unit can move to */
        highlightTilesAroundUnit(unit)
    }
}

/* Moves a unit SVG node to a new location on the grid and updates the parameters object for that unit with the new location (this will be useful for saving and restoring state later) */
function setGridLocation(unit, newGridLocation) {
    units[unit.getAttribute("arrayNumber")].gridLocation = newGridLocation
    unit.setAttribute("x", newGridLocation.x*sizeUnit)
    unit.setAttribute("y", newGridLocation.y*sizeUnit)
}

/* Get the parameters list for a unit SVG node. */
function paramsForUnit(unit) {
    return units[unit.getAttribute("arrayNumber")]
}

function unitClicked(event) {
    /* Units contolled by the enemy belong to player 0 and will fail the if statement below. This system will need to be revised if a multiplayer system is implemented. */
    if (paramsForUnit(this).player) {
        select(this)
    }
}

function unitMousedOver(event) {
    /* This function displays information about a unit in the info paragraph when the mouse is held over the unit */
    var params = paramsForUnit(this)
    var unitDetailString = params.svg + " with " + params.HP + " HP and " + params.speed + " movement belongs to " + (params.player ? "you." : "the enemy.")
    document.getElementById("info").textContent = unitDetailString
}

function unitMouseOut(event) {
    /* When the mouse is removed from a unit, make the info paragraph show the current turn again. */
    updateTurnText()
}

