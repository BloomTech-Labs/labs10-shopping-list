import React from 'react';
import LogIn from './LogIn.js';
import './Landing.css';

class LandingPage extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    render() {
        return (
            <div className='landingPage'>
                <LogIn />
                <h1 className='thing'>ShopTrak</h1>
                <p className='thing'>Welcome to our app. Where we fix all your problems with tracking your shopping list with the people you care about.</p>
            </div>
        )
    }
}

export default LandingPage;