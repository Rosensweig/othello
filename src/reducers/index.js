import { combineReducers } from 'redux';
import ActivePlayerReducer from './reducer_active_player';
import LegalMovesReducer from './reducer_legal_moves';
import GridReducer from './reducer_grid';

const rootReducer = combineReducers({
  state: (state = {
  	active: ActivePlayerReducer,
  	moves: LegalMovesReducer,
  	grid: GridReducer
  }) => state
});

export default rootReducer;
