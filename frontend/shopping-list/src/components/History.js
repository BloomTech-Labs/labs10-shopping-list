import React from "react";
import {
  addToCart,
  removeFromCart,
  updateItem,
  deleteItem
} from "../store/actions/rootActions";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { MDBListGroup, MDBCard, MDBCardBody } from "mdbreact";
import "./Styles/History.css";

class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: "name",
      isEditing: false,
      inCart: false
    };
  }

  render() {
    // console.log("TRIP =>", this.props.trip);
    return (
      <div className="history-items" key={this.props.key}>
        <MDBCard>
          <MDBCardBody>
            <div className="d-flex w-100 justify-content-between">
              <h5 className="mb-1">{this.props.trip.userName}</h5>
              <small className="text-muted">
                {this.props.trip.dateString}
              </small>
            </div>
            <MDBListGroup>
              {this.props.trip.purchasedItems !== undefined ? this.props.trip.purchasedItems.map((item, index) => {
                return <p key={index}>{item.name}</p>
              }) : null}

              <h4>${this.props.trip.total.toFixed(2)}</h4>
            </MDBListGroup>
          </MDBCardBody>
        </MDBCard>
      </div>
    );
  }
}
const mapStateToProps = state => {
  state = state.rootReducer; // pull values from state root reducer
  return {
    //state items
    groupHistoryList: state.groupHistoryList
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    {
      // actions
      updateItem,
      deleteItem,
      addToCart,
      removeFromCart
    }
  )(History)
);
