import React from 'react';
import {connect} from 'react-redux';
import {withRouter, Link} from 'react-router-dom';
import {getInviteInfo} from '../store/actions/index';
import {MDBCol, MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText} from 'mdbreact';
import Auth0Lock from 'auth0-lock';

import './Styles/Invite.css';


let frontendURL;
if(process.env.NODE_ENV === 'development'){
    frontendURL = 'http://localhost:3000';
} else {
    frontendURL = `https://labs10-shopping-list.netlify.com`
}

var lockOptions = {
    auth: {
        redirectUrl: `${frontendURL}/callback`,
        responseType: 'token id_token',
        params: {
            scope: 'profile openid email'
        }
    },
    theme: {
        primaryColor: '#FF7043'
    },
    languageDictionary: {
        title: 'ShopTrak'
    }

}

var lock = new Auth0Lock(
    process.env.REACT_APP_AUTH0_CLIENT_ID,
    process.env.REACT_APP_AUTH0_DOMAIN,
    lockOptions
)


class Invite extends React.Component {

    componentWillMount(){
        let inviteCode = this.props.location.search;
        inviteCode = inviteCode.replace('?', '');
        this.props.getInviteInfo(inviteCode); 
    }

    handleSignIn = event => {
        event.preventDefault();

        sessionStorage.setItem('pendingInvite', this.props.inviteInfo.inviteCode);

        if(localStorage.getItem('isLoggedIn')){
            this.props.history.replace('/groups');
        } else {
            lock.show();
        }
    }

    render(){
        return (
            <div className = 'invite-container'>
            {this.props.inviteInfo ? (
                <div className = 'invite-present'>
                <MDBCol>
                <MDBCard>
                <MDBCardBody>

                    <MDBCardTitle>
                    <h1>You're invited!</h1>
                    </MDBCardTitle>
                    <MDBCardText>
                    <h2>{this.props.inviteInfo.userName} invited you to join the "{this.props.inviteInfo.groupName}" group!</h2>
                    <Link to = '/'><MDBBtn color = 'danger' >Cancel</MDBBtn></Link>
                    <MDBBtn onClick = {this.handleSignIn}>Accept</MDBBtn>
                    <p>Click "Accept" to log in and join the group.</p>
                    </MDBCardText>
                        
                </MDBCardBody>

                </MDBCard>
                </MDBCol>
                
                
                </div>
            ) : (
                <div className = 'invite-absent'>
                <h1>Loading invite information...</h1>
                <h4>If this doesn't load or takes too long, <Link to = '/'>click here.</Link></h4>
                </div>
            )}
            
            </div>
        )
    }
}


const mapStateToProps = state => {
    state = state.rootReducer; // pull values from state root reducer
    return {
        //state items
        inviteInfo: state.inviteInfo
    }
}

export default withRouter(connect(mapStateToProps, {
    // actions
    getInviteInfo,
})(Invite));