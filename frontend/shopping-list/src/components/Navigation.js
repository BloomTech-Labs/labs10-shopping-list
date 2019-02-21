import React from 'react';
import {Link, withRouter} from 'react-router-dom';
// import {Link, withRouter} from 'react-router-dom';
import auth0Client from './Auth';

import {connect} from 'react-redux';
import {checkEmail, addUserToState} from '../store/actions/rootActions';
import './styles/Navigation.css';


class Navigation extends React.Component{

    componentDidMount(){
        // populate state with user information
        if(!this.props.userId && localStorage.getItem('email')){
            this.props.checkEmail(localStorage.getItem('email'), this.props.addUserToState)
        }
    }
    
    signOut = () => { // logs out the current user and redirects to the homepage
        auth0Client.signOut();
        this.props.history.replace('/');
    };

    goToProfile = () => {
        this.props.history.replace('/profile');
    }
    
    goToHome = () => {
        this.props.history.replace('/');
    }

    render(){
        return(
            <div className = "navigation-container">

            <div className = 'nav-links'>
            <Link to = '/'>ABOUT</Link>
            <Link to = '/'>FEATURES</Link>
            <Link to = '/'>PLANS</Link>

            <div className = 'nav-login'>
                {/* Conditionally renders a sign-in or sign-out button if user is logged in/out*/}
                {
                    !localStorage.getItem('email') && 
                    <span className = 'nav-login-btn' onClick={auth0Client.signIn}>LOGIN</span>

                }

                {
                    localStorage.getItem('email') && 
                    <div className='nav-user-greeting'>
                        <span>MY ACCOUNT</span>
                        <span className = 'nav-user-btn' onClick = {this.signOut}><img src = {this.props.profilePicture} alt = 'user profile picture'></img></span>
                        
//                     <div className='signedInNavBar'>
//                         <div className='userGreeting'>
//                             Hello, {localStorage.getItem('name')}
//                         </div>
//                         <div className='buttons'>
//                             <div className='button' onClick={this.goToHome}>
//                                 Home
//                             </div>
//                             <div className='button' onClick={this.goToProfile}>
//                                 Profile
//                             </div>
//                             <div className='button' onClick = {this.signOut}>Sign out</div>
//                         </div>
                    </div>
                }

                </div>
                </div>

                
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
    }
}

export default withRouter(connect(mapStateToProps, {
    // actions
    checkEmail,
    addUserToState,
})(Navigation));