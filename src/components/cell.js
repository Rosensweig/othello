import React from 'react';
import Black from '../../static/BlackCircle.png';
import White from '../../static/WhiteCircle.png';

export default (props) => {
	var content;
	if (props.legal) {
		content = (
			<div className="cell legal" onClick={() => {
				props.move(props.k, props.player); 
				props.switchPlayer(props.player);
			}} />
		);
	} else if (props.content==="W") {
		content = (
			<div className="cell"><img src={White} height="48px" width="48px" /></div>
		);
	} else if (props.content==="B") {
		content = (
			<div className="cell"><img src={Black} height="48px" width="48px" /></div>
		);
	} else {
		content = <div className="cell"></div>
	}
	
	var image = "";
	var moveFunction = props.legal ? props.move : null;
	if (props.content==="W") {
		image = <img src={White} height="48px" width="48px" />
	} else if (props.content==="B") {
		image = <img src={Black} height="48px" width="48px" />
	}

	return (
		<td>
			{content}
		</td>
	);
}