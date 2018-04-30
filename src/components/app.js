import React, { Component } from 'react';
import Grid from '../containers/grid';

export default class App extends Component {
  render() {
    return (
      <div className="App">
      	<h1>Othello</h1>
      	<Grid />
      </div>
    );
  }
}
