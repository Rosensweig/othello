import { GRID } from '../actions/index';


export default function(state=initialState(), action) {
	switch (action.type) {
		case GRID:
			return state
	}
	return state;
}

function initialState() {
	const initialState=[];
	for (var i=0; i<8; i++) {
		initialState.push([]);
		for (var j=0; j<8; j++) {
			if (i<3 || i>4 || j<3 || j>4) {
				initialState[i].push(null);
			} else if (i===j) {
				initialState[i].push('W');
			} else {
				initialState[i].push('B');
			}
		}
	}
	console.log(initialState);
	return initialState;
}