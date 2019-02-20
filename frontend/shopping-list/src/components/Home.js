import React from 'react';
import Navigation from './Navigation';
import './Styles/Home.css';

class Home extends React.Component{
    render(){
        return(
            <div>
                <Navigation />
                <div className='componentName element'>Home</div>
                <div className='appDescription'>
                    Welcome to ShopTrak. We know tracking home supplies & groceries can be difficult. Let's make it easier on you and the ones you care about.
                </div>
            </div>
        )
    }
}

export default Home;