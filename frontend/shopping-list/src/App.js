import React, { Component } from 'react';
import './App.css';
import {Route} from 'react-router-dom';
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import Callback from './components/Callback';
import GroupsProfile from "./components/GroupsProfile";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route exact path='/' component={Home} />
        <Route 
          path = '/profile' 
          component={UserProfile} 
          profilePicture={localStorage.getItem('img_url')}
        />
        <Route path = '/callback' component = {Callback} />
        <Route path='/groups' component={GroupsProfile} />
      </div>
    );
  }
}

export default App;
