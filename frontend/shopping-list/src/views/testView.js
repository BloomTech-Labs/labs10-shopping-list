import React, { Component } from "react";
import { connect } from "react-redux";

import TestComponent from "../components/TestComponent/TestComponent.jsx";

class TitlebarView extends Component {
  state = {
  };

  render() {
    return (
      <TestComponent />
    );
  }
}

const mapStateToProps = state => ({
});

export default connect(
  mapStateToProps
)(TitlebarView);
