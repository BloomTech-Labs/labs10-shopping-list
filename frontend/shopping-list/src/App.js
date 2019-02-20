import React, { Component } from 'react';
import './App.css';
import {Route} from 'react-router-dom';
import Home from './components/Home';
// import UserProfile from './components/UserProfile';
import Callback from './components/Callback';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route exact path='/' component={Home} />
        {/* <Route path = '/profile' component={UserProfile} /> */}
        <Route path = '/callback' component = {Callback} />
      </div>
    );
  }
}

export default App;
