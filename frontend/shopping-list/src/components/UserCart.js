import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { checkOut, removeFromCart } from "../store/actions/rootActions";
import "./Styles/UserCart.css";
import {MDBBtn, MDBInput, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader, MDBContainer} from "mdbreact";

class UserCart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: "",
      modal17: false,
      error: "",
    };
  }
  
  handleChange = event => {
    event.preventDefault();
    console.log(event.target.value);
    this.setState({
      [event.target.name]: event.target.value
    });
  };
  
  keyPress = event => {
    if(event.keyCode === 13){
      this.handleCheckout(event);
    }
  }

  handleCheckout = event => {
    event.preventDefault();
    // console.log('checkout');
    const amt = Number(this.state.amount);

    let info = {
      userId: this.props.currentUser.id,
      groupId: this.props.match.params.id,
      cartItems: this.props.userCart,
      amount: amt
    };

    if (this.props.userCart !== null) {
      if (Number(this.state.amount) > 0 && this.state.amount !== "") {
        this.setState({
          amount: ""
        });
        this.props.checkOut(info);
      } else {
        this.setState({modal17: true, error: "Total price was not entered."})
      }

    } else {
      this.setState({modal17: true, error: "Cart is empty!"})
    }

  };

  handleRemoveFromCart = (event, id) => {
    event.preventDefault();

    if (this.props.userCart !== null) {
      const item = this.props.userCart.filter((itm => itm.id === id));
      this.props.removeFromCart(item[0]);
    }
  }

  toggle = nr => () => {
    let modalNumber = "modal" + nr;
    this.setState({
      [modalNumber]: !this.state[modalNumber]
    });
  };


  render() {
    return (
      <div className="user-cart-container">
        <h2>Shopping Cart</h2>

        <div className="cart-items">
          {this.props.userCart !== null ? (
            this.props.userCart.map(item => (
              /** @TODO break these divs into components */
              <div className="cart-item" key={item.id}>

                {item.name}
              </div>
            ))
          ) : (
            <h4>No Items in Cart</h4>
          )}
        </div>

        <div className="checkout-container">
          <MDBInput
            size="lg"
            label="Total $ Spent"
            type="number"
            name="amount"
            step="0.01"
            valueDefault={this.state.amount}
            value={this.state.amount}
            onChange={this.handleChange}
            onKeyDown={this.keyPress}
          />
          <MDBBtn className="btn-dark-green" onClick={this.handleCheckout}>
            Check out
          </MDBBtn>
        </div>
        <MDBContainer>
          <MDBModal
              isOpen={this.state.modal17}
              toggle={this.toggle(17)}
              centered
          >
            <MDBModalHeader toggle={this.toggle(17)}>Warning</MDBModalHeader>
            <MDBModalBody>
              <h6>{this.state.error}</h6>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={this.toggle(17)}>
                Ok
              </MDBBtn>
            </MDBModalFooter>
          </MDBModal>
        </MDBContainer>
      </div>
    );
  }
}

const mapStateToProps = state => {
  state = state.rootReducer; // pull values from state root reducer
  return {
    //state items
    userCart: state.userCart,
    currentUser: state.currentUser
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    {
      // actions
      checkOut,
      removeFromCart
    }
  )(UserCart)
);
