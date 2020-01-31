import React from 'react';
import logo from './logo.svg';
import './App.css';
import Board from './components/Board';

class App extends React.Component {
  state = {
    rows: 10,
    cols: 10,
    mines: 20
  };
  render() {
    const { rows, cols, mines } = this.state;
    return (
      <div className="App">
        <Board rows={rows} columns={cols} mines={mines}/>
      </div>
    );
  }
}

export default App;
