import React from 'react';
import {withRouter} from 'react-router-dom';
// import {Link, withRouter} from 'react-router-dom';
import auth0Client from './Auth';
import './Styles/Navigation.css';

class Navigation extends React.Component{
    
    signOut = () => {
        auth0Client.signOut();
        this.props.history.replace('/');
    };


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
                            <div className='button'>
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