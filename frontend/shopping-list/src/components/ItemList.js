import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Item from "./Item";
import {
  getUserGroups,
  getGroupItems,
  addItem
} from "../store/actions/rootActions";
import "./Styles/ItemList.css";
import { MDBBtn, MDBInput } from "mdbreact";

class ItemList extends React.Component {
  componentWillMount() {
    if (!this.props.groupItems) {
      this.props.getGroupItems(this.props.match.params.id);
    }
  }

  componentWillReceiveProps = newProps => {
    if (newProps.needsNewItems === true) {
      this.props.getGroupItems(this.props.match.params.id);
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      item: ""
    };
  }

  handleChange = event => {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleClickOutside = event => {
    console.log("outside", this.state.oldItem);
    if (!this.state.quantity) {
      if (this.state.oldQuantity) {
        this.setState({
          quantity: this.state.oldQuantity
        });
      } else {
        this.setState({
          quantity: 0
        });
      }
    }
    document.removeEventListener("mousedown", this.handleClickOutside);
  };

  handleSubmit = event => {
    event.preventDefault();
    if (this.state.item) {
      let item = {
        purchasedBy: null,
        groupID: Number(this.props.match.params.id),
        name: this.state.item,
        purchased: false,
        price: 0.0,
        quantity: 1
      };

      console.log("ITEMLIST ITEM =>", item);

      // send item to db
      this.props.addItem(item);

      this.setState({
        item: ""
      });
    } else {
      window.alert("Must include name.");
    }
  };

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
          {this.props.groupItems !== null ? (
            this.props.groupItems.map(item => (
              <Item item={item} key={item.id} />
            ))
          ) : (
            <h2>No Items on the List</h2>
          )}
        </div>

        <div className="form-group">
          <form onSubmit={this.handleSubmit}>
            <MDBInput
              size="md"
              label="Add an Item"
              type="text"
              name="item"
              valueDefault={this.state.item}
              onChange={this.handleChange}
              value={this.state.item}
            />
            <MDBBtn className="btn-dark-green" type="submit">
              Add to List
            </MDBBtn>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  state = state.rootReducer; // pull values from state root reducer
  return {
    //state items
    groupItems: state.groupItems,
    needsNewItems: state.needsNewItems,
    userGroups: state.userGroups
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    {
      // actions
      getGroupItems,
      addItem,
      getUserGroups
    }
  )(ItemList)
);
