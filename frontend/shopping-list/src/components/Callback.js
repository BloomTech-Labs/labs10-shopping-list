import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import auth0Client from './Auth';
import {Spinner} from 'reactstrap';
import {checkEmail} from '../store/actions';

class Callback extends Component {
  
  async componentDidMount() {
    await auth0Client.handleAuthentication();
    this.props.history.replace('/groups'); //reroute into groups
  }

  componentWillUnmount(){
    // see if we need to add new user to database
    this.props.checkEmail();
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
})(Callback));