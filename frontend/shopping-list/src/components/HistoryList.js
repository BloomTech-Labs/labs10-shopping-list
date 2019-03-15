import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getGroupHistoryList } from "../store/actions/rootActions";
import History from "./History";

class HistoryList extends React.Component {
  componentWillMount() {
    if (!this.props.groupHistoryList) {
      this.props.getGroupHistoryList(this.props.match.params.id);
    }
  }

  componentWillReceiveProps = newProps => {
    if (newProps.needsNewHistoryList === true) {
      this.props.getGroupHistoryList(this.props.match.params.id);
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      item: ""
    };
  }

  render() {
    const grp =
      this.props.userGroups !== null
        ? this.props.userGroups.filter(
            grp => grp.id === Number(this.props.match.params.id)
          )
        : this.props.userGroups;

    return (
      <div className="item-list-container">
        <h1>
          {this.props.userGroups !== null ? grp[0].name : "Loading name..."}
        </h1>
        <div className="item-list">
          {this.props.groupHistoryList !== null ? (
            this.props.groupHistoryList.slice(0).reverse().map(trip => (
              <History trip={trip} key={trip.id} />
            ))
          ) : (
            <div>Loading History....</div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  state = state.rootReducer; // pull values from state root reducer
  return {
    //state items
    groupHistoryList: state.groupHistoryList,
    needsNewHistory: state.needsNewHistory,
    needsNewHistoryList: state.needsNewHistoryList,
    userGroups: state.userGroups
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    {
      // actions
      getGroupHistoryList
    }
  )(HistoryList)
);
