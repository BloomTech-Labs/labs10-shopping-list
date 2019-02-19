import React from 'react';

class LogInOptions extends React.Component {
    constructor(){
        super();
        this.state = {};
    }
    render(){
        return(
            <div className='thing login box'>
                <div className='sign signUp'>
                    Sign Up
                </div>
                <div className='sign signIn'>
                    Sign In
                </div>
            </div>
        )
    }
}

export default LogInOptions;