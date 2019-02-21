import React from 'react';
import Navigation from './Navigation';
import './styles/Home.css';

class Home extends React.Component{
    render(){
        return(
            <div className = 'home-container'>
                <div className = 'home-banner'>
                <h1>SHOPTRAK</h1>
                <h2>Share what you shop.</h2>
                </div>
            </div>
        )
    }
}

export default Home;