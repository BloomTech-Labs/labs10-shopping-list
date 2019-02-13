import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Shopping List</h1>
        </header>
        <div className='listHeader'>
          <h2>Lamont House</h2>
        </div>
      </div>
    );
  }
}

export default App;
