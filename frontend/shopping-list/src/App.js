import React, { Component } from 'react';
import './App.css';
import {Route} from 'react-router-dom';
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import Callback from './components/Callback';
<<<<<<< HEAD
import GroupsProfile from "./components/GroupsProfile";
=======
import GroupsProfile from './components/GroupsProfile';
>>>>>>> 8d69328970f921cb32680232591cf04a981947e5

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route exact path='/' component={Home} />
        <Route path = '/profile' component={UserProfile} />
        <Route path = '/callback' component = {Callback} />
        <Route path='/groups' component={GroupsProfile} />
      </div>
    );
  }
}

export default App;
