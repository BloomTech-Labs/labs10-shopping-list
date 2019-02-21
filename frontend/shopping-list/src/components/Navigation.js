import React from 'react';
import {withRouter} from 'react-router-dom';
// import {Link, withRouter} from 'react-router-dom';
import auth0Client from './Auth';
import './Styles/Navigation.css';

class Navigation extends React.Component{
    
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
            <div className="Navbar">
                {
                    !localStorage.getItem('email') && 
                    <div className='button' onClick={auth0Client.signIn}>Sign In</div>
                }

                {
                    localStorage.getItem('email') && 
                    <div className='signedInNavBar'>
                        <div className='userGreeting'>
                            Hello, {localStorage.getItem('name')}
                        </div>
                        <div className='buttons'>
                            <div className='button' onClick={this.goToHome}>
                                Home
                            </div>
                            <div className='button' onClick={this.goToProfile}>
                                Profile
                            </div>
                            <div className='button' onClick = {this.signOut}>Sign out</div>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default withRouter(Navigation);