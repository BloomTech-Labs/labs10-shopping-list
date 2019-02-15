import React, { Component } from 'react';
import './App.css';
import TestView from './views/testView.js';
import LandingPageView from './views/landingPageView.js';
import {Route} from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route exact path='/' component={LandingPageView} />
        <Route path='/testview' component={TestView} />
      </div>
    );
  }
}

export default App;
