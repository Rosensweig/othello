import { combineReducers } from 'redux';
import ActivePlayerReducer from './reducer_active_player';
import LegalMovesReducer from './reducer_legal_moves';
import GridReducer from './reducer_grid';

const rootReducer = combineReducers({
	grid: GridReducer,
	activePlayer: ActivePlayerReducer,
	legalMoves: LegalMovesReducer
});


export default rootReducer;
