import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import auth0Client from './Auth';
import {Spinner} from 'reactstrap';
import {connect} from 'react-redux';

class Callback extends Component {
  async componentDidMount() {
    await auth0Client.handleAuthentication();
    this.props.history.replace('/profile');
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

export default withRouter(Callback);