import React from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {checkOut, removeFromCart} from '../store/actions/rootActions';
import './Styles/UserCart.css'
import {
    MDBListGroup,
    MDBListGroupItem,
    MDBContainer,
    MDBBtn,
    MDBIcon,
    MDBBadge,
    MDBInput, MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter,
    MDBTooltip,
    MDBScrollbar,
} from "mdbreact";

class UserCart extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            amount: '',
        }
    }

    handleChange = event => {
        event.preventDefault();
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleCheckout = event => {
        event.preventDefault();
        console.log('checkout');

        let info = {
            userId: this.props.currentUser.id,
            groupId: this.props.match.params.id,
            cartItems: this.props.userCart,
            amount: this.state.amount
        }
        if(this.state.amount > 0 && this.state.amount !== ''){
            this.props.checkOut(info);
        }

        this.setState({
            amount: '',
        })
    }
    render(){
        return(
            <div className = 'user-cart-container'>
            <h2>Shopping Cart</h2>

            <div className = 'cart-items'>
            {this.props.userCart !== null ? (
                this.props.userCart.map(item => (
                    /** @TODO break these divs into components */
                    <div className = 'cart-item' key = {item.id}>
                        <button type="button" className="close" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                        {item.name}
                    </div>
                ))
            ) : <h4>No Items in Cart</h4>}
            </div>

                <div className = 'checkout-container'>
                    <MDBInput size="lg"  label="Total $ Spent" type = 'text' name = 'amount' valueDefault= {this.state.amount} onChange = {this.handleChange}></MDBInput>
                    <MDBBtn color="success" onClick = {this.handleCheckout} >Checkout</MDBBtn>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    state = state.rootReducer; // pull values from state root reducer
    return {
        //state items
        userCart: state.userCart,
        currentUser: state.currentUser,
    }
}

export default withRouter(connect(mapStateToProps, {
    // actions
    checkOut,
    removeFromCart,
})(UserCart));