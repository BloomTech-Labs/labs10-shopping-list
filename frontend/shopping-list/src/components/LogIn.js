import React from 'react';
import auth0 from 'auth0-js';

class Login extends React.Component {

    auth0 = new auth0.WebAuth({
        domain: process.env.REACT_APP_AUTH0_DOMAIN,
        clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
        redirectUri: 'http://localhost:3000/callback',
        responseType: 'token id_token',
        scope: 'profile email openid'
    });


    constructor(){
        super();
        this.state = {};
    }

    login(){
        this.auth0.authorize();
    }
    
    render(){
        console.log(process.env);
        console.log(process.env.NODE_ENV);
        return(
            <div className = 'login-container'>
            Login Container
            </div>
        )
    }
}

export default Login;