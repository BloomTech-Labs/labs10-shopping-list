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


    render(){
        return(
            <div className = "navigation-container">
            
            <div className = 'nav-logo'>
            LOGO
            </div>

            <div className = 'nav-links'>
            <Link to = '/'>HOME</Link>
            <Link to = '/profile'>PROFILE</Link>
            <Link to = '/'>ABOUT</Link>
            <Link to = '/'>FEATURES</Link>
            </div>


            <div className = 'nav-login'>
                {/* Conditionally renders a sign-in or sign-out button if user is logged in/out*/}
                {
                    !localStorage.getItem('email') && 
                    <div onClick={auth0Client.signIn}>Sign In</div>
                }

                {
                    localStorage.getItem('email') && 
                    <div className='nav-user-greeting'>
                        <span>Hello, {this.props.name}</span>
                        <span className = 'nav-logout-btn' onClick = {this.signOut}>Sign out</span>
                    </div>
                }

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