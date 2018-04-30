import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { move, moveOptions, switchPlayer } from '../actions/index';
import Cell from '../components/cell';

class Grid extends Component {
	constructor(props) {
		super(props);
		this.renderGrid = this.renderGrid.bind(this);
		this.renderRow = this.renderRow.bind(this);
	}

	componentDidMount() {
		this.props.move();
		this.props.moveOptions(this.props.activePlayer, this.props.grid);
	}

	componentWillReceiveProps(nextProps) {
		if (JSON.stringify(nextProps.grid) !== JSON.stringify(this.props.grid ||
			nextProps.activePlayer !== this.props.activePlayer)) {
			this.props.moveOptions(nextProps.activePlayer, nextProps.grid);
		} 
	}

	render() {
		return (
			<div className="grid">
				<table>
					<tbody>
						{this.renderGrid()}
					</tbody>
				</table>
			</div>
		);
	}

	renderGrid() {
		var grid = this.props.grid;
		if (!grid || !grid[0]) { 
			return null;}
		var rendered = [];
		for (var y=0; y<8; y++) {
			rendered.push(this.renderRow(y));
		}
		return rendered;
	}

	renderRow(y) {
		const renderedRow = [];
		var moves = this.props.legalMoves;
		if (!moves) { moves=[]; }
		for (var x=0; x<8; x++) {
			const legal = moves.indexOf(y*8+x) > -1;
			const content = this.props.grid[y][x];
			const key = y*8+x;
			renderedRow.push(<Cell 
				content={content} 
				legal={legal} 
				move={this.props.move} 
				player={this.props.activePlayer} 
				key={key} 
				k={key} 
				switchPlayer={this.props.switchPlayer} 
				moveOptions={this.props.moveOptions}
				/>)
		}
		return (<tr key={y}>{renderedRow}</tr>);
	}
}



function mapDispatchToProps(dispatch) {
	return bindActionCreators({move, moveOptions, switchPlayer}, dispatch);
}

function mapStateToProps(state) {
	return state;
}

export default connect(mapStateToProps, mapDispatchToProps)(Grid);