import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import auth0Client from './Auth';
import {Spinner} from 'reactstrap';
import {checkEmail, acceptInvite} from '../store/actions';

class Callback extends Component {
  
  componentDidMount() {
    // await auth0Client.handleAuthentication();

    console.log('callback', this.props);

    if(localStorage.getItem('pendingInvite') && localStorage.getItem('isLoggedIn')){
      let inviteCode = localStorage.getItem('pendingInvite');
      console.log('pending invite', inviteCode);
      this.props.acceptInvite(inviteCode); // tell the server to add the now logged-in user to the invite group

      localStorage.removeItem('pendingInvite');

      this.props.history.replace('/groups'); //reroute into groups
    } else {
      if(localStorage.getItem('isLoggedIn')){
        this.props.history.replace('/groups'); //reroute into groups
      }
    }
  }


  /**
   * @TODO Make this a nifty loading wheel or progress bar
   */

  render() {
    return (
        <div>
        <h1>Loading profile...</h1>
        <Spinner style = {{width: '3rem', height: '3rem'}} type = "grow" />
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
  checkEmail,
  acceptInvite,
})(Callback));