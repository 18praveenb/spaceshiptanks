/*** HTML links and other fundamental stuff ***/

var displayParameters = ["player", "health", "attack", "speed"]; /*This should match precisely with the list of display cells in the HTML and be in the same order. */

var objectsNotLoaded = 2; /* Should equal the number of SVG objects in the HTML doc. This isn't being calculated automatically because that occasionally fails to work. */
/* Props to my brother Pranav for this objectsLoaded idea. Before he suggested this, I was just implementing an n millisecond delay before loading the page. */
function objectLoaded() {
	--objectsNotLoaded;
	if (objectsNotLoaded == 0) {buildScene()}
}

function buildScene() {
	for (var x = 0; x < 7; ++x) {
		for (var y = 0; y < 5; ++y) {
			if ((x == 3) && (y == 3)) {createNode(type:"addnew", svg:"addnew", gridLocation:{"x":x,"y":y})};}
			else {createNode({type:"tile", svg:"grass", gridLocation:{"x":x,"y":y}});}
		}
	}
	createNode({displayName: "Space Destroyer", type:"unit", svg:"spaceship", health:50, speed:2, attack:10, player:1, gridLocation:{"x":0,"y":2}});
	createNode({displayName: "Why don't I get a cool title like Space Destroyer?", type:"unit", svg:"spaceship", health:50, speed:3, attack:9, player:2, gridLocation:{"x":6,"y":2}});
	showTurnText();
}

var parameterArrays = {
tile: [], /* Keys: type, svg, gridLocation */
unit: [] /* Keys: type, svg, health, speed, player, attack, gridLocation */
}

/*** Helper functions ***/

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


/*** Turns ***/

var turn = 1;
var currentPlayer = 1;

function finishTurn() {
	currentPlayer = (currentPlayer % 2) + 1;
	if (currentPlayer == 1) {++turn}
	showTurnText();
}

/*** Alert box ***/

var showingAlert = false;

function alertInBox(alert, duration) {
	dgid("helper").hidden = true;
	dgid("stats_title").hidden = true;
	dgid("stats_alert").hidden = false;
	dgid("stats_alert").textContent = alert;
	hideBoxParameters();
	if (duration) {
		var showingAlert = true;
		setTimeout(function() {showingAlert = false; showTurnText}, duration)
	}
}

function hideBoxParameters() {
	enumerate(displayParameters, function(key) {
			  dgid("stats_row_"+key).hidden = true;
			  })
}

function makeUnitInfoVisible() {
	dgid("stats_title").hidden = false;
	enumerate(displayParameters, function(key) {
			  dgid("stats_row_"+key).hidden = false;
			  })
}

function showTurnText() {
	if (showingAlert) {return}
	dgid("stats_alert").hidden = true;
	dgid("helper").hidden = false;
	dgid("stats_title").hidden = false;
	hideBoxParameters();
	dgid("stats_title").textContent = "Player " + currentPlayer + "'s turn"
}

function showInfo(unit) {
	if (showingAlert) {return}
	dgid("stats_alert").hidden = true;
	var params = parametersForNode(unit);
	dgid("helper").hidden = true;
	dgid("stats_title").textContent = params.displayName
	enumerate(displayParameters, function(key){
			  dgid("stats_"+key).textContent = params[key]
			  dgid("stats_row_"+key).hidden = false;
			  })
}

/*** Grid points ***/

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
	
	if (node.type == "unit") {
		node.setAttribute("highlight", "unit_idle");
	}
	else {
		node.setAttribute("highlight", "none")
	}
	
	scene.appendChild(node);
	//return(node); /* enable if the node is needed for anything */
}

function parametersForNode(node) {
	var array = parameterArrays[node.getAttribute("type")];
	return array[node.getAttribute("arrayNumber")]
}

function nodeClicked(event) {
	var location = parametersForNode(this).gridLocation
	if (selectedUnit == "none") {
		if ((this.getAttribute("type") == "unit")) {
			if (parametersForNode(this).player == currentPlayer) {
			toggleSelectionOfUnit(this);
			}
			else {
				alertInBox("You can't select this unit. It belongs to another player.")
			}
		}
	}
	else {
		switch (unitMoveTypeForPoint(parametersForNode(this).gridLocation)) {
			case "move": setGridLocation(selectedUnit, parametersForNode(this).gridLocation); finishTurn(); break;
			case "attack": attack(selectedUnit, unitAtPoint(location)); finishTurn(); break;
			default: break;
		}
		toggleSelectionOfUnit(selectedUnit);
	}
}

function nodeMouseOver(event) {
	if (this.getAttribute("type") == "unit") {
		showInfo(this);
	}
}

function nodeMouseOut(event) {
	showTurnText();
}

/*** Tiles ***/

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
				case "move": tile.setAttribute("highlight", "tile_move"); break;
				case "attack": tile.setAttribute("highlight", "tile_attack"); break;
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
	if (selectedUnit != "none") {
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
	}
	return "none";
}

/*** Units ***/

var selectedUnit = "none";

function toggleSelectionOfUnit(unit) {
	if (unit == selectedUnit) {
		selectedUnit = "none";
		unit.setAttribute("highlight", "unit_idle");
		resetTileHighlighting();
	}
	else {
		/* Deselect the currently selected unit before selecting this one. Only one unit can be selected at a time. */
		if (selectedUnit != "none") {
			toggleSelectionOfUnit(selectedUnit);
		}
		selectedUnit = unit;
		unit.setAttribute("highlight", "unit_selected");
		highlightTilesAroundUnit(unit);
	}
}

/* Moves a unit SVG node to a new location on the grid, and updates the parameters object for that unit with the new location (which will be useful for saving and restoring state later) */
function setGridLocation(unit, newGridLocation) {
	parameterArrays.unit[unit.getAttribute("arrayNumber")].gridLocation = newGridLocation;
	unit.setAttribute("x", locationForGridPoint(newGridLocation).x);
	unit.setAttribute("y", locationForGridPoint(newGridLocation).y);
}

/* Currently lacking fancy animations :( */
function attack(from, to) {
	parametersForNode(to).health -= parametersForNode(from).attack;
	if (parametersForNode(to).health <= 0) {
		to.remove();
		parametersForNode(to).health = 0;
	}
}
