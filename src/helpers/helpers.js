
// returns list of positions that represent legal moves for a player
export function getLegalMoves(player, grid) {
	const adjacentPositions = findAdjacent(grid);
	const legalPositions = [];
	for (var position of adjacentPositions) {
		if (checkLegalMove(position, player, grid)) {
			legalPositions.push(position[0]*8+position[1]); //flatten coords to single numerical key
		}
	}
	return legalPositions;
}

// Returns an array of coords with null contents and non-null neighbors.
// These are potential legal moves, and provides the list for
// which coords to investigate further
function findAdjacent(grid) {
	const adjacentPositions = [];
	for (var y=0; y<8; y++) {
		for (var x=0; x<8; x++) {
			if (grid[y][x] != null) {
				continue;
			}
			// For a single position, checks for non-null neighbors
			// Loop is named so we can break out of it and inner loop
			// at the same time
			singlePosLoop: for (var i=-1; i<2; i++) {
				if (y+i<0 || y+i >7) {continue;} // don't try to check positions off the board!
				for (var j=-1; j<2; j++) {
					if (x+j<0 || x+j > 7) {continue;}
					if (i===0 && j===0) {continue;}
					if (grid[y+i][x+j] != null) { // we have at least one non-null neighbor
						adjacentPositions.push([y,x]);
						break singlePosLoop; //breaks out of 2 loops at once
					}
				}
			}
		}
	}
	return adjacentPositions;
}

//checks whether a move is legal (would flip at least one tile)
function checkLegalMove(position, player, grid) {
	return (
		evalHorizLine(position, player, grid, false) ||
		evalVertLine(position, player, grid, false) ||	
		evalDiagDRLine(position, player, grid, false) ||
		evalDiagURLine(position, player, grid, false)
	);
}

//Returns a new grid, flipping tiles according to a move
export function makeMove(position, player, grid) {
	const y = position[0];
	const x = position[1]
	const newGrid = JSON.parse(JSON.stringify(grid)); //make a copy of the grid, because we'll be changing it.
	newGrid[y][x] = player;
	evalHorizLine(position, player, newGrid, true);
	evalVertLine(position, player, newGrid, true);
	evalDiagDRLine(position, player, newGrid, true);
	evalDiagURLine(position, player, newGrid, true);
	return newGrid;
}

//Evaluates the flips in a line, based on a move.
//Returns the flipped line, but doesn't change original.
//Takes a move index, rather than an (x,y) coord.
function evalLine(index, player, line) {
	const opponent = (player==="W") ? "B" : "W";
	var newLine = line.slice();
	var sandwichCenter = 0;
	//check left for sandwich
	for (var i=index-1; i>0; i--) {
		if (newLine[i] === opponent) {
			//opponent tile in center of our sandwich,
			// but we don't yet know whether our tile is on the other end
			sandwichCenter++;
			continue;
		}
		else if (newLine[i] === player && sandwichCenter) {
			// active player tile is on the other end of our sandwich,
			// and we have opponent tile(s) in the middle
			while (sandwichCenter) {
				i++;
				newLine[i] = player; 
				sandwichCenter--;
			}
			break; // changes finished on left
		}
		break; //we've hit an empty space
	}
	sandwichCenter = 0; //reset our center, then check right
	for (var i=index+1; i<line.length; i++) {
		if (newLine[i] === opponent) {
			sandwichCenter++;
			continue;
		}
		else if (newLine[i] === player && sandwichCenter) {
			while (sandwichCenter) {
				i--;
				newLine[i] = player;
				sandwichCenter--;
			}
			break;
		}
		break;
	}
	return newLine;
}

// evaluates the flips in the grid a move would create,
// along the horizontal line.
// If change=true, makes necessary changes in the grid.
// Otherwise, returns true/false for whether there would be any flips.
function evalHorizLine(position, player, grid, change=false) {
	const y = position[0];
	const x = position[1];
	const line = grid[y];
	const newLine = evalLine(x, player, line);
	if (!change) {
		return (JSON.stringify(line) != JSON.stringify(newLine));
	} else {
		grid[y] = newLine;
	}
	return newLine;
}

// Same options as above, for vertical line
function evalVertLine(position, player, grid, change=false) {
	const y = position[0];
	const x = position[1];
	const line = [];
	for (var i=0; i<8; i++) {
		line.push(grid[i][x]);
	}
	const newLine = evalLine(y, player, line);
	if (!change) {
		return (JSON.stringify(line) != JSON.stringify(newLine));
	} else {
		for (var i=0; i<8; i++) {
			grid[i][x]=newLine[i];
		}
	}
	return newLine;
}

// Same options as above, for diagonal line going down to the right
function evalDiagDRLine(position, player, grid, change=false) {
	const y = position[0];
	const x = position[1];
	const line = [];
	var i = (x<y) ? x : y; // find starting point
	while ((x-i) < 8 && (y-i) < 8) {
		line.push(grid[y-i][x-i]);
		i--; //move down and right.
		// (y-axis is upside down the way JS prints arrays by default)
	}
	i = ((7-x)<y) ? 7-x : y;
	const newLine = evalLine(i, player, line);
	if (!change) {
		return (JSON.stringify(line) != JSON.stringify(newLine));
	} else {
		i = (x<y) ? x : y;
		for (var j=0; j<newLine.length; j++) {
			grid[y-i][x-i]=newLine[j];
			i--;
		}
	}
	return newLine;
}

// Same options as above, for diagonal line going up to the right
function evalDiagURLine(position, player, grid, change=false) {
	const y = position[0];
	const x = position[1];
	const line = [];
	var i = ((7-x)<y) ? 7-x : y;
	while ((y-i) < 8 && (x+i) > 0) {
		line.push(grid[y-i][x+i]);
		i--;
	}
	i = ((7-x)<y) ? 7-x : y;
	const newLine = evalLine(i, player, line);
	if (!change) {
		return (JSON.stringify(line) != JSON.stringify(newLine));
	} else {
		i = ((7-x)<y) ? 7-x : y;
		for (var j=0; j<newLine.length; j++) {
			grid[y-i][x+i] = newLine[j];
			i--;
		}
	}
	return newLine;
}


//formLine refactored into other functions above,
// but left here so you can see my thought process/evolution 

// function formLine(position, grid, orientation) {
// 	var line = [];
// 	var y = position[0];
// 	var x = position[1];
// 	switch (orientation) {
// 		case HORIZ: 
// 			line = grid[y];
// 			break;
// 		case VERT:
// 			for (var i=0; i<8; i++) {
// 				line.push(grid[i][x]);
// 			}
// 			break;
// 		case DIAGDR:
// 			var i = (x<y) ? x : y;
// 			while ((x-i) < 8 && (y-i) < 8) {
// 				console.log(`x=${x-i}, y=${y-i}`);
// 				line.push(grid[y-i][x-i]);
// 				i--;
// 			}
// 			break;
// 		case DIAGUR: 
// 			var i = ((7-x)<(y)) ? 7-x : y;
// 			while ((y-i) < 8 && (x+i) > 0) {
// 				console.log(`y=${y-i}, x=${x+i}`);
// 				line.push(grid[y-i][x+i]);
// 				i--;
// 			}
// 			break;
// 		default:
// 			throw "Orientation not valid";
// 	}
// 	return line;
// }

// const HORIZ = "HORIZONTAL";
// const VERT = "VERTICAL";
// const DIAGDR = "DIAGONAL_DOWN_RIGHT";
// const DIAGUR = "DIAGONAL_UP_RIGHT";



// ===========================================
// some quick and dirty testing I used along the way
// ===========================================

// const testGrid = [];
// for (var i=0; i<8; i++) {
// 	testGrid.push([]);
// 	for (var j=1; j<9; j++) {
// 		testGrid[i].push((i*8)+j);
// 	}
// }
// const testPosition=[5,3];
// console.log(testGrid);
// console.log(`Testing all orientations for position [${testPosition[0]}][${testPosition[1]}]=${testGrid[testPosition[0]][testPosition[1]]}`);
// console.log(HORIZ, ":\n", formLine(testPosition, testGrid, HORIZ));
// console.log(VERT, ":\n", formLine(testPosition, testGrid, VERT));
// console.log(DIAGDR, ":\n", formLine(testPosition, testGrid, DIAGDR));
// console.log(DIAGUR, ":\n", formLine(testPosition, testGrid, DIAGUR));



// const testEvalLine = [null, "W", "B", "B"];
// console.log(`Testing line ${testEvalLine}, player "W", position 1:`);
// console.log(evalLine(1, "W", testEvalLine));


// var initialState=[];
// for (var i=0; i<8; i++) {
// 	initialState.push([]);
// 	for (var j=0; j<8; j++) {
// 		if (i<3 || i>4 || j<3 || j>4) {
// 			initialState[i].push(null);
// 		} else if (i===j) {
// 			initialState[i].push('W');
// 		} else {
// 			initialState[i].push('B');
// 		}
// 	}
// }
// console.log("Initial state: \n", initialState);
// console.log("Adjacent spaces: ", findAdjacent(initialState));
// console.log("Legal moves for W: ", getLegalMoves("W", initialState));
// console.log("New grid after move y=4, x=2: \n", makeMove([4,2], "W", initialState));
