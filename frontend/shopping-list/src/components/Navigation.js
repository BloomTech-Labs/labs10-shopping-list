import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import auth0Client from './Auth';

class Navigation extends React.Component{
    
    signOut = () => {
        auth0Client.signOut();
        this.props.history.replace('/');
    };


    render(){
        return(
            <div>
                Navbar
                {
                    !auth0Client.isAuthenticated() && 
                    <button onClick={auth0Client.signIn}>Sign In</button>
                    }

                {
                    auth0Client.isAuthenticated() && 
                    <div>
                    <span>{auth0Client.getProfile().name}</span>
                    <button onClick = {this.signOut()}>Sign out</button>
                    </div>
                }
            </div>
        )
    }
}

export default withRouter(Navigation);