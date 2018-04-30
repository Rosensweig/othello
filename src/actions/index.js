export const GRID = 'GRID';
export const LEGAL_MOVES = 'LEGAL_MOVES';
export const PLAYER = 'PLAYER';
export const RESET = 'RESET';

export function move(position=null, activePlayer=null) {
	var coords = null;
	if (position) {	//convert position key to coordinates
		const x = position % 8;
		const y = (position-x)/8;
		coords = [y,x];
	}
	return {
		type: GRID,
		payload: {position: coords, activePlayer}
	}
}

export function moveOptions(activePlayer, grid) {
	return {
		type: LEGAL_MOVES,
		payload: {activePlayer, grid}
	}
}

export function switchPlayer(activePlayer) {
	return {
		type: PLAYER,
		payload: {player: activePlayer}
	}
}