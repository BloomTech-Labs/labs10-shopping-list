import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import auth0Client from './Auth';
import {Spinner} from 'reactstrap';
import {checkEmail, acceptInvite} from '../store/actions';

import './Styles/Callback.css';

class Callback extends Component {
  
  async componentDidMount() {
    await auth0Client.handleAuthentication();

    console.log('callback', this.props);

    if(localStorage.getItem('jwt')){
      window.location.href = '/groups'
    }
  }


  /**
   * @TODO Make this a nifty loading wheel or progress bar
   */

  render() {
    return (
        <div className = 'callback-container'>
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