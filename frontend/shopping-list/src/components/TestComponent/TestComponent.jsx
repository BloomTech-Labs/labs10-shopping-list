import React from "react";
// import PropTypes from "prop-types";
import Navigation from '../../components/Navigation/Navigation.jsx';

function TestComponent(props) {

  return (
    <div className = 'test-container'>
      
      <div className = 'test-header'>
      <Navigation />
      <h1>Welcome!</h1>
      </div>
      
    </div>
  );
}

export default TestComponent;
