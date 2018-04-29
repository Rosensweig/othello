export default {makeMove, getLegalMoves};

// takes a list of positions, player, and grid
// returns the positions that represent legal moves for that player
function getLegalMoves(positions, player, grid) {
	const legalPositions = [];
	for (var position of positions) {
		if (checkLegalMove(position, player, grid)) {
			legalPositions.push(position);
		}
	}
	return legalPositions;
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

//changes grid, flipping tiles according to a move
function makeMove(position, player, grid) {
	evalHorizLine(position, player, grid);
	evalVertLine(position, player, grid);
	evalDiagDRLine(position, player, grid);
	evalDiagURLine(position, player, grid);
	return grid;
}

//Evaluates the flips in a line, based on a move.
//Returns the flipped line, but doesn't change original.
//Takes a move index, rather than an (x,y) coord.
function evalLine(index, player, line) {
	var opponent = (player==="W") ? "B" : "W";
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
			// our tile is on the other end of our sandwich,
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
	newLine = evalLine(x, player, line);
	if (!change) {
		return (JSON.stringify(line) === JSON.stringify(newLine));
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
	newLine = evalLine(y, player, line);
	if (!change) {
		return (JSON.stringify(line) === JSON.stringify(newLine));
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
		// (y-axis is upside down the way JS prints arrays)
	}
	newLine = evalLine(i, player, line);
	if (!change) {
		return (JSON.stringify(line) === JSON.stringify(newLine));
	} else {
		i = (x<y) ? x : y;
		for (var j=0; j<newLine.length; j++) {
			grid[y-i][x-i]=newLine[j];
			i--; j++;
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
	newLine = evalLine(y, player, line);
	if (!change) {
		return (JSON.stringify(line) === JSON.stringify(newLine));
	} else {
		i = ((7-x)<y) ? 7-x : y;
		for (var j=0; j<newLine.length; j++) {
			line.push(grid[y-i][x+i]);
			i--;
		}
	}
	return newLine;
}


//formLine refactored into other functions above,
// but left here so you can see my thought process 

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