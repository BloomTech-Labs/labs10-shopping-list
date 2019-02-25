import React, { Component } from 'react';
import './App.css';
import {Route, Switch, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import Callback from './components/Callback';
import GroupsPage from "./components/GroupsPage";
import GroupsProfile from "./components/GroupsProfile";
import Navigation from './components/Navigation';
import BillingPage from './components/BillingPage';

class App extends Component {
  render() {
    return (
      <div className = 'App'>
      <Navigation />
      <Switch>
        <Route exact path='/' component={Home} />
        <Route 
          path = '/profile' 
          component={UserProfile} 
          profilePicture={localStorage.getItem('img_url')}
        />
        <Route path = '/callback' component = {Callback} />
        <Route exact path='/groups' component={GroupsPage} />
        <Route path='/groups/:id' render={props => <GroupsProfile {...props} />} />
        <Route path = '/billing' component = {BillingPage} />
      </Switch>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return{
    //state
  }
}


export default withRouter(connect(mapStateToProps, {
  //actions
})(App));
