import React from 'react';

class LandingPage extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    render() {
        return (
            <div className='landingPage'>
                <h1>ShopTrak</h1>
                <p>Welcome to our app. Where we fix all your problems with tracking your shopping list with the people you care about.</p>
            </div>
        )
    }
}

export default LandingPage