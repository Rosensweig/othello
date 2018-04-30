import { LEGAL_MOVES } from '../actions/index';
import { getLegalMoves } from '../helpers/helpers';

export default function(state=[], action) {
	switch (action.type) {
		case LEGAL_MOVES:
			const {activePlayer, grid} = action.payload;
			const legalMoves = getLegalMoves(activePlayer, grid);
			return legalMoves;
	}
	return state;
}