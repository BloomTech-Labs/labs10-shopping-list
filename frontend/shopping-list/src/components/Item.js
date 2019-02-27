import React from 'react';
import {purchaseItem} from '../store/actions/rootActions';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import moment from 'moment';

class Item extends React.Component {


    constructor(props){
        super(props);

        this.state = {
            purchased: props.item.purchased,
            price: props.item.price
        }
    }

    handleChange = event => {
        event.preventDefault();
        console.log(event.target.value);
        this.setState({
            price: Number(event.target.value)
        })
    }


    handlePurchase = event => {
        event.preventDefault();

        let time = moment().format(); //ISO standard

        let item = {
            price: this.state.price.toFixed(2),
            purchasedBy: this.props.userId,
            purchased: true,
            purchasedOn: time,
        }

        this.props.purchaseItem(item, this.props.item.id);

    }

    render(){
    
        return (
            <div className = 'item-container'>
            <h2>
            {this.props.item.name}
            </h2>

            <h2>{this.props.item.quantity}</h2>
           

            <form>
                $<input type = 'number' onChange = {this.handleChange} value = {this.state.price} placeholder = '$0.00' min = '0' step = 'any' >
                
                </input>
            <button type = 'submit' onClick = {this.handlePurchase}>Purchase</button>
            </form>
            </div>
        )
        }
}
const mapStateToProps = state => {
    state = state.rootReducer; // pull values from state root reducer
    return {
        //state items
        userId: state.userId,
        name: state.name,
        email: state.email,
        profilePicture: state.profilePicture,
        groups: state.groups,
        items: state.items,
    }
}

export default withRouter(connect(mapStateToProps, {
    // actions
    purchaseItem,

})(Item));