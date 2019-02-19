import React, { Component } from 'react';
import './App.css';
import TestView from './views/testView.js';
import LandingPage from './views/landingPageView.js';
import Login from './components/Login';

import {Route} from 'react-router-dom';


class App extends Component {
  render() {
    return (
      <div className="App">
        <Route exact path='/' component={LandingPage} />
        <Route path='/test' component={TestView} />
        <Route path = '/login' component = {Login} />

      </div>
    );
  }
}

export default App;
