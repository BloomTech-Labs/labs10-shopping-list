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

                </div>
            </div>
        )
    }
}

export default Home;