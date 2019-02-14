import React, { Component } from 'react';
import './App.css';
import TestView from './views/testView.js'

class App extends Component {
  render() {
    return (
      <div className="App">
          <h1>Shopping List</h1>
        <div className='listHeader'>
          <h2>Lamont House</h2>
        </div>
        <TestView />
      </div>
    );
  }
}

export default App;
