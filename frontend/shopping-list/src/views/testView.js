import React, { Component } from "react";
import { connect } from "react-redux";

import TestComponent from "../components/TestComponent/TestComponent.jsx";
// import Navigation from '../components/Navigation/Navigation.jsx';

class TitlebarView extends Component {
  state = {
  };

  render() {
    return (
      <div className = 'main-view'>
      <TestComponent />
      </div>
    );
  }
}

const mapStateToProps = state => ({
});

export default connect(
  mapStateToProps
)(TitlebarView);
