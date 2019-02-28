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
import {getCurrentUser} from './store/actions/rootActions';

class App extends Component {

  componentDidMount(){
    if(!this.props.currentUser && localStorage.getItem('email')){
      console.log('get user')
      this.props.getCurrentUser(localStorage.getItem('email'));
    }
  }


  render() {
    return (
      <div className = 'App'>
      <Navigation />
      <Switch>
        <Route exact path='/' component={Home} />
        <Route 
          path = '/profile' 
          component={UserProfile} />
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
  state = state.rootReducer; // pull values from state root reducer
  return {
      //state items
      currentUser: state.currentUser
  }
}

export default withRouter(connect(mapStateToProps, {
  // actions
  getCurrentUser
})(App));