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
import Invite from './components/Invite';
import {getCurrentUser, checkEmail} from './store/actions/rootActions';

class App extends Component {

  componentWillMount(){
    if(localStorage.getItem('email') && !this.props.currentUser){
      this.props.checkEmail();
    }
  }

  render() {
    return (
      <div>
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
        <Route path = '/invite' component = {Invite} />
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
  getCurrentUser,
  checkEmail,
})(App));