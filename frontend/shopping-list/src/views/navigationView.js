import React, { Component } from "react";
import { connect } from "react-redux";

import Navigation from "../components/TestComponent/TestComponent.jsx";

class NavView extends Component {
  state = {
  };

  render() {
    return (
      <Navigation />
    );
  }
}

const mapStateToProps = state => ({
});

export default connect(
  mapStateToProps
)(NavView);
