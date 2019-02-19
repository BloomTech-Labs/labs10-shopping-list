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
                    !localStorage.getItem('email') && 
                    <button onClick={auth0Client.signIn}>Sign In</button>
                    }

                {
                    localStorage.getItem('email') && 
                    <div>
                    <span>{localStorage.getItem('name')}</span>
                    <button onClick = {this.signOut}>Sign out</button>
                    </div>
                }
            </div>
        )
    }
}

export default withRouter(Navigation);