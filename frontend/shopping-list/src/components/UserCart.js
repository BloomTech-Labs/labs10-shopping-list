import React from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {checkOut} from '../store/actions/rootActions';

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
    }

    render(){
        return(
            <div className = 'user-cart-container'>
            <h2>Shopping Cart</h2>

            {this.props.userCart !== null ? (
                this.props.userCart.map(item => (
                    <div className = 'cart-item' key = {item.id}>{item.name}</div>
                ))
            ) : <h4>No Items in Cart</h4>}


                
                This Trip I Paid:
                    <input type = 'text' name = 'amount' value = {this.state.amount} placeholder = '$' onChange = {this.handleChange}></input><button onClick = {this.handleCheckout}>Check Out</button>
            
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
})(UserCart));