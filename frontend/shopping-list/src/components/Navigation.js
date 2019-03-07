import React from 'react';
import {withRouter} from 'react-router-dom';
// import {Link, withRouter} from 'react-router-dom';
import auth0Client from './Auth';
import Auth0Lock from 'auth0-lock';

import {connect} from 'react-redux';
import {checkEmail,} from '../store/actions/rootActions';
import './Styles/Navigation.css';
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBNavbarToggler, MDBCollapse, MDBDropdown,
    MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem,
    // MDBIcon, MDBFormInline, 
    MDBBtn } from "mdbreact";

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

lock.on('authenticated', function(authResult){
    console.log('auth attempt');
    lock.getUserInfo(authResult.accessToken, function(error, profile){
        if(error){
            //handle error
            this.props.history.replace('/');
            return;
        }
        console.log('result \n \n \n', authResult);
        localStorage.setItem('jwt', authResult.idToken);
        localStorage.setItem('email', authResult.idTokenPayload.email);
        localStorage.setItem('name', authResult.idTokenPayload.name);
        localStorage.setItem('img_url', authResult.idTokenPayload.picture);
        localStorage.setItem('isLoggedIn', true);

        window.location.href = `${frontendURL}/groups`;
    })
})


class Navigation extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            collapseID: "",
            activeTabClassname: "home",
            isOpen: false,
        }
        
    }
    
    // Toggles dropdown menus for MDB
    // toggleCollapse = collapseID => () =>
    //     this.setState(prevState => ({
    //         collapseID: prevState.collapseID !== collapseID ? collapseID : ""
    //     }));

    toggleCollapse = () => {
        this.setState({ isOpen: !this.state.isOpen });
    }

    signOut = () => { // logs out the current user and redirects to the homepage
        auth0Client.signOut();
        // lock.logout();
        this.props.history.replace('/');
    };

    signIn = (event) => {
        event.preventDefault();
        console.log('click');
        lock.show();
    }

    render(){
        // Gather user id to determine if user is logged in or not
        let isLoggedIn = localStorage.getItem("isLoggedIn");

        // Gather the url pathname to set active class to proper link
        const pathname = this.props.location.pathname;
        return(
            <div className = 'navigation-container'>
            
            <MDBNavbar style={{backgroundColor: "#2A922D"}} dark expand="md">

                <MDBNavbarBrand>
                    <strong className="white-text">ShopTrak</strong>
                </MDBNavbarBrand>

                <MDBNavbarToggler onClick={this.toggleCollapse} />

                <MDBCollapse id="navbarCollapse3" isOpen={this.state.isOpen} navbar>
                    <MDBNavbarNav left>
                        <MDBNavItem active={pathname === "/" ? "active" : null} >
                            <MDBNavLink to="/">Home</MDBNavLink>
                        </MDBNavItem>
                        {isLoggedIn ? (
                            <MDBNavItem active={pathname === "/groups" ? "active" : null} >
                                <MDBNavLink to="/groups">Groups</MDBNavLink>
                            </MDBNavItem>
                        ) : null}

                    </MDBNavbarNav>

                    <MDBNavbarNav right>
                        <MDBNavItem>
                            {isLoggedIn ? (
                                <MDBDropdown>
                                    <MDBDropdownToggle className="dropdown-toggle" nav>
                                    {this.props.currentUser ? (
                                        <img src={this.props.currentUser.profilePicture} className="rounded-circle z-depth-0"
                                        style={{ height: "35px", padding: 0 }} alt="" />
                                    ) : null}
                                        
                                    </MDBDropdownToggle>
                                    <MDBDropdownMenu className="dropdown-default"
                                    style = {{'padding': '20px', 'margin-right': '20px'}}>
                                        
                                        <MDBNavLink to = '/profile' style={{color: "#000000"}}>My Account
                                        </MDBNavLink>
                                        
                                        <MDBNavLink to = '/' onClick={this.signOut} style={{color: "#000000"}}>
                                        Log Out
                                        </MDBNavLink>
                                    </MDBDropdownMenu>
                                </MDBDropdown>
                            ) : (
                                <MDBNavItem>
                                    <MDBBtn color="deep-orange" onClick={this.signIn}>
                                        Log In / Sign Up
                                    </MDBBtn>
                                </MDBNavItem>
                            ) }

                        </MDBNavItem>
                    </MDBNavbarNav>

                </MDBCollapse>
            </MDBNavbar>      
            </div>

        )
    }
}

const mapStateToProps = state => {
    state = state.rootReducer; // pull values from state root reducer
    return {
        //state items
        userId: state.userId,
        name: state.name,
        email: state.email,
        profilePicture: state.profilePicture,
        currentUser: state.currentUser,
        userGroups: state.userGroups,
    }
}

export default withRouter(connect(mapStateToProps, {
    // actions
    checkEmail,
})(Navigation));