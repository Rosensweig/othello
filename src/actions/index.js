export const GRID = 'GRID';

export function newMove(position, activePlayer) {

	return {
		type: GRID,
		payload: {position, activePlayer}
	}
}