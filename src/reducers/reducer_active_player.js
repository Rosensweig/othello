import { PLAYER } from '../actions/index';
import { getLegalMoves} from '../helpers/helpers';


export default function (state="B", action) {
	switch (action.type) {
		case PLAYER:
			return (action.payload.player === "W") ? "B" : "W";
	}
	return state;
}
