import React, { Component } from 'react';
import './App.css';
import TestView from './views/testView.js'

class App extends Component {
  render() {
    return (
      <div className="App">
        <TestView />
      </div>
    );
  }
}

export default App;
