import React, { Component } from 'react';
import './App.css';
import {Route} from 'react-router-dom';
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import Callback from './components/Callback';
import GroupsPage from "./components/GroupsPage";
import GroupsProfile from "./components/GroupsProfile";

class App extends Component {
  render() {
    return (
      <div className="">
        <Route exact path='/' component={Home} />
        <Route path = '/profile' component={UserProfile} />
        <Route path = '/callback' component = {Callback} />
        <Route exact path='/groups' component={GroupsPage} />
        <Route path='/groups/:id' render={props => <GroupsProfile {...props} />} />
      </div>
    );
  }
}

export default App;
