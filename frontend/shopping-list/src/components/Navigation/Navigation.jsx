import React from "react";
import PropTypes from "prop-types";
import {Link} from 'react-router-dom';

function Navigation(props) {

  return (
    <div className = 'navigation-container'>
      
      <div className = 'nav-links'>
      <Link to = '/'>Home</Link>
      <Link to = '/login'>Login</Link>
      </div>
      
    </div>
  );
}

export default Navigation;
